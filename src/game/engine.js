import { gameStore } from '../store/gameStore';
import { portfolioData, funFacts } from '../data/portfolioData';
import { MapGenerator } from './mapGenerator';

// --- MAP DIMENSIONS ---
const rows = 22;
const cols = 19;
let tileSize = 0;
let map = [];
let mapData = null;
let canvas, ctx;
let player;
let ghosts = [];
let animationFrameId;

let toastQueue = [];
let isToastVisible = false;
let lastFactIndex = -1;
let pelletsPerFact = 5;

// ─── Multiplayer state ────────────────────────────────────────────────────────

// Other players in the room: id → { nx, ny, vx, vy, mouthOpen, color, name, _x, _y }
// _x/_y are interpolated pixel positions for smooth rendering.
const remotePlayers = new Map();

// Local player appearance (overwritten by server assignment in multiplayer)
let localPlayerColor = '#facc15';
let localPlayerName = '';

// Multiplayer eat callbacks.
// When null, the engine handles scoring/toasts locally (solo mode).
// When set, the engine only removes the cell and delegates the rest to socketService.
let onSmallPelletEaten = null; // (row: number, col: number) => void
let onBigPelletEaten = null;   // (sectionId: number, row: number, col: number) => void

// ─── Palette ──────────────────────────────────────────────────────────────────

const palettes = [
    { wallFill: 'rgba(29, 78, 216, 0.2)', wallBorder: '#3b82f6', pellet: '#fca5a5' },
    { wallFill: 'rgba(220, 38, 38, 0.2)', wallBorder: '#ef4444', pellet: '#fef08a' },
    { wallFill: 'rgba(5, 150, 105, 0.2)', wallBorder: '#10b981', pellet: '#fbcfe8' },
    { wallFill: 'rgba(124, 58, 237, 0.2)', wallBorder: '#8b5cf6', pellet: '#93c5fd' },
    { wallFill: 'rgba(217, 119, 6, 0.2)', wallBorder: '#f59e0b', pellet: '#a7f3d0' },
    { wallFill: 'rgba(219, 39, 119, 0.2)', wallBorder: '#ec4899', pellet: '#bfdbfe' }
];

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Initialise (or re-initialise) the engine.
 * @param {HTMLCanvasElement} canvasEl
 * @param {object|null} serverMapData  When provided (multiplayer), skips local map generation.
 */
export function initGameEngine(canvasEl, serverMapData = null) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    resetGameData(serverMapData);
    startGameLoop();
}

export function startGameLoop() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    gameLoop();
}

/**
 * @param {object|null} serverMapData  { map, playerStart, ghostStarts, pelletsPerFact }
 */
export function resetGameData(serverMapData = null) {
    remotePlayers.clear();

    if (serverMapData) {
        // ── Multiplayer: use the server's authoritative map ──────────────────
        mapData = serverMapData;
        // Deep-copy so mutations (eating pellets) stay local
        map = serverMapData.map.map(row => [...row]);
        if (serverMapData.pelletsPerFact) pelletsPerFact = serverMapData.pelletsPerFact;
        gameStore.sectionsEatenThisLevel = 0;
        gameStore.smallPelletsEaten = 0;
    } else {
        // ── Solo: generate map locally ────────────────────────────────────────
        const generator = new MapGenerator(rows, cols);
        mapData = generator.generate();
        map = mapData.map;

        // Randomise big-pellet positions
        const sectionIds = Object.keys(portfolioData).map(Number);
        let validSpots = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (map[r][c] === 1) validSpots.push({ r, c });
            }
        }

        let placedSpots = [];
        sectionIds.forEach(id => {
            let bestSpot = null, bestIdx = -1;
            for (let i = 0; i < 50; i++) {
                let randIdx = Math.floor(Math.random() * validSpots.length);
                let candidate = validSpots[randIdx];
                let tooClose = placedSpots.some(p => Math.hypot(p.r - candidate.r, p.c - candidate.c) < 4);
                if (!tooClose) { bestSpot = candidate; bestIdx = randIdx; break; }
            }
            if (!bestSpot) { bestIdx = Math.floor(Math.random() * validSpots.length); bestSpot = validSpots[bestIdx]; }
            validSpots.splice(bestIdx, 1);
            placedSpots.push(bestSpot);
            map[bestSpot.r][bestSpot.c] = id;
        });

        const totalSmallPellets = validSpots.length;
        gameStore.totalSmallPellets = totalSmallPellets;
        pelletsPerFact = Math.max(1, Math.floor(totalSmallPellets / funFacts.length));
        gameStore.sectionsEatenThisLevel = 0;
        gameStore.smallPelletsEaten = 0;
    }

    player = new Pacman(mapData.playerStart.c, mapData.playerStart.r);
    ghosts = mapData.ghostStarts.map(g => new Ghost(g.c, g.r, g.color, g.delay));

    toastQueue = [];
    isToastVisible = false;
}

export function resetPositions() {
    if (!player || !mapData) return;
    player = new Pacman(mapData.playerStart.c, mapData.playerStart.r);
    ghosts = mapData.ghostStarts.map(g => new Ghost(g.c, g.r, g.color, g.delay));
}

// ─── Multiplayer engine API ───────────────────────────────────────────────────

/** Change the local pac-man colour (assigned by the server in multiplayer). */
export function setLocalPlayerColor(color) { localPlayerColor = color; }

/** Set the local player's display name (shown above their pac-man). */
export function setLocalPlayerName(name) { localPlayerName = name; }

/**
 * Register callbacks that fire when a pellet is eaten, instead of local handling.
 * Pass null to both to return to solo mode.
 */
export function setEatCallbacks(smallCb, bigCb) {
    onSmallPelletEaten = smallCb;
    onBigPelletEaten = bigCb;
}

/** Add or update a remote player's state. Position uses normalised coordinates (0–1). */
export function setRemotePlayer(id, data) {
    const existing = remotePlayers.get(id);
    if (existing) {
        // Store the target position for interpolation; keep current _x/_y
        remotePlayers.set(id, { ...existing, ...data });
    } else {
        // First time we see this player: initialise interpolated position to the target
        const px = (data.nx ?? 0) * cols * tileSize;
        const py = (data.ny ?? 0) * rows * tileSize;
        remotePlayers.set(id, { ...data, _x: px, _y: py });
    }
}

/** Remove a remote player (e.g. on disconnect). */
export function removeRemotePlayer(id) { remotePlayers.delete(id); }

/**
 * Returns the local player's state in normalised coordinates for position sync.
 * Returns null if the engine hasn't started yet.
 */
export function getLocalPlayerState() {
    if (!player || !tileSize) return null;
    return {
        nx: player.x / (cols * tileSize),
        ny: player.y / (rows * tileSize),
        vx: player.vx,
        vy: player.vy,
        mouthOpen: player.mouthOpen,
    };
}

/** Apply a pellet removal broadcast from the server. */
export function applyPelletRemoval(r, c) {
    if (map[r]) map[r][c] = 2;
}

/** Apply a pellet respawn broadcast from the server. */
export function applyPelletRespawn(r, c) {
    // Only respawn if the cell is currently empty (never overwrite a big pellet)
    if (map[r] && map[r][c] === 2) map[r][c] = 1;
}

/** Trigger a fun-fact toast from a server event (multiplayer private toasts). */
export function triggerFunFact() { queueFunFact(); }

/** Reset all multiplayer-specific engine state (called when returning to lobby). */
export function clearMultiplayerState() {
    remotePlayers.clear();
    onSmallPelletEaten = null;
    onBigPelletEaten = null;
    localPlayerColor = '#facc15';
    localPlayerName = '';
}

// ─── Canvas ───────────────────────────────────────────────────────────────────

function resizeCanvas() {
    if (!canvas) return;
    const isMobile = window.innerWidth < 768;
    const navSpace = isMobile ? 220 : 0;

    const containerWidth = window.innerWidth * 0.95;
    const containerHeight = (window.innerHeight - navSpace) * 0.85;

    const cellW = containerWidth / cols;
    const cellH = containerHeight / rows;

    tileSize = Math.floor(Math.min(cellW, cellH));

    canvas.width = tileSize * cols;
    canvas.height = tileSize * rows;

    if (player) {
        player.x = player.c * tileSize + tileSize / 2;
        player.y = player.r * tileSize + tileSize / 2;
        ghosts.forEach(g => {
            g.x = g.c * tileSize + tileSize / 2;
            g.y = g.r * tileSize + tileSize / 2;
        });
    }

    // Snap remote player interpolated positions to their latest known normalised coords
    remotePlayers.forEach((data, id) => {
        remotePlayers.set(id, {
            ...data,
            _x: (data.nx ?? 0) * cols * tileSize,
            _y: (data.ny ?? 0) * rows * tileSize,
        });
    });
}

// ─── Game loop ────────────────────────────────────────────────────────────────

function gameLoop() {
    if (gameStore.status === 'playing') {
        update();
        if (ctx) draw();
    } else if (
        gameStore.status === 'paused' ||
        gameStore.status === 'respawning' ||
        gameStore.status === 'start'
    ) {
        if (ctx) draw();
    }

    animationFrameId = requestAnimationFrame(gameLoop);
}

function update() {
    player.move();
    player.eat();

    ghosts.forEach(ghost => {
        ghost.move();

        const dist = Math.hypot(player.x - ghost.x, player.y - ghost.y);
        if (dist < tileSize * 0.8 && gameStore.status === 'playing') {
            gameStore.loseLife(() => resetPositions());
        }
    });

    // Lerp remote players toward their latest received position
    remotePlayers.forEach((data, id) => {
        const targetX = (data.nx ?? 0) * cols * tileSize;
        const targetY = (data.ny ?? 0) * rows * tileSize;
        data._x = data._x + (targetX - data._x) * 0.25;
        data._y = data._y + (targetY - data._y) * 0.25;
    });
}

function draw() {
    drawMap();

    // Remote players are drawn below the local player
    remotePlayers.forEach(data => drawRemotePacman(data));

    if (player) player.draw();
    ghosts.forEach(g => g.draw());
}

// ─── Map drawing ──────────────────────────────────────────────────────────────

function drawMap() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const currentPalette = palettes[(gameStore.level - 1) % palettes.length];
    const labelsToDraw = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = c * tileSize;
            const y = r * tileSize;

            if (map[r][c] === 0) {
                ctx.fillStyle = currentPalette.wallFill;
                ctx.fillRect(x, y, tileSize, tileSize);
                ctx.strokeStyle = currentPalette.wallBorder;
                ctx.lineWidth = 1.5;
                ctx.strokeRect(x, y, tileSize, tileSize);
            } else if (map[r][c] === 1) {
                ctx.fillStyle = currentPalette.pellet;
                ctx.beginPath();
                ctx.arc(x + tileSize / 2, y + tileSize / 2, tileSize * 0.15, 0, Math.PI * 2);
                ctx.fill();
            } else if (map[r][c] >= 3 && map[r][c] <= 9) {
                const section = portfolioData[map[r][c]];
                ctx.fillStyle = section.color;
                ctx.shadowBlur = 15;
                ctx.shadowColor = section.color;
                ctx.beginPath();
                const pulse = Math.sin(Date.now() / 200) * 2;
                ctx.arc(x + tileSize / 2, y + tileSize / 2, tileSize * 0.35 + pulse, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(x + tileSize / 2, y + tileSize / 2, tileSize * 0.15, 0, Math.PI * 2);
                ctx.fill();

                labelsToDraw.push({
                    text: section.title.toUpperCase(),
                    x: x + tileSize / 2,
                    y: y - 8,
                    color: section.color
                });
            }
        }
    }

    labelsToDraw.forEach(label => {
        const fontSize = Math.max(7, Math.min(11, tileSize * 0.45));
        ctx.font = `bold ${fontSize}px "Segoe UI"`;
        ctx.textAlign = 'center';

        const textWidth = ctx.measureText(label.text).width;
        const paddingX = 6, paddingY = 4;
        const boxWidth = textWidth + paddingX * 2;
        const labelX = Math.max(boxWidth / 2 + 2, Math.min(canvas.width - boxWidth / 2 - 2, label.x));
        const labelY = label.y;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.beginPath();
        ctx.roundRect(labelX - boxWidth / 2, labelY - fontSize - paddingY, boxWidth, fontSize + paddingY * 2, 4);
        ctx.fill();

        ctx.fillStyle = label.color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = label.color;
        ctx.fillText(label.text, labelX, labelY - paddingY / 2);
        ctx.shadowBlur = 0;
    });
}

// ─── Remote player drawing ────────────────────────────────────────────────────

function drawRemotePacman(data) {
    if (!tileSize || !ctx) return;

    const px = data._x ?? (data.nx * cols * tileSize);
    const py = data._y ?? (data.ny * rows * tileSize);
    const color = data.color || '#60a5fa';
    const name = data.name || '';
    const mouthOpen = data.mouthOpen ?? 0.3;

    // Draw name tag above
    if (name) {
        const fontSize = Math.max(8, Math.min(12, tileSize * 0.4));
        ctx.save();
        ctx.font = `bold ${fontSize}px "Segoe UI"`;
        ctx.textAlign = 'center';
        const nameWidth = ctx.measureText(name).width;
        const tagY = py - tileSize * 0.65;
        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.beginPath();
        ctx.roundRect(px - nameWidth / 2 - 4, tagY - fontSize - 2, nameWidth + 8, fontSize + 4, 3);
        ctx.fill();
        ctx.fillStyle = color;
        ctx.fillText(name, px, tagY);
        ctx.restore();
    }

    // Draw the pac-man body
    ctx.save();
    ctx.translate(px, py);

    let angle = 0;
    if (data.vx > 0) angle = 0;
    else if (data.vx < 0) angle = Math.PI;
    else if (data.vy > 0) angle = Math.PI / 2;
    else if (data.vy < 0) angle = -Math.PI / 2;
    ctx.rotate(angle);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, tileSize * 0.4, mouthOpen * Math.PI, (2 - mouthOpen) * Math.PI);
    ctx.lineTo(0, 0);
    ctx.fill();

    ctx.restore();
}

// ─── Entities ────────────────────────────────────────────────────────────────

class Entity {
    constructor(c, r, speedRatio) {
        this.c = c; this.r = r;
        this.x = c * tileSize + tileSize / 2;
        this.y = r * tileSize + tileSize / 2;
        this.vx = 0; this.vy = 0;
        this.nextVx = 0; this.nextVy = 0;
        this.speedRatio = speedRatio;
    }

    get speed() {
        const isMobile = window.innerWidth < 768;
        const mobileMultiplier = isMobile ? 1.2 : 1;
        return tileSize * this.speedRatio * mobileMultiplier;
    }

    move() {
        const centerX = this.c * tileSize + tileSize / 2;
        const centerY = this.r * tileSize + tileSize / 2;

        if (this.nextVx !== 0 || this.nextVy !== 0) {
            const isChangingAxis = (this.vx !== 0 && this.nextVy !== 0) || (this.vy !== 0 && this.nextVx !== 0) || (this.vx === 0 && this.vy === 0);
            const isUturn = (this.nextVx === -this.vx && this.nextVy === -this.vy) && (this.vx !== 0 || this.vy !== 0);

            if (isUturn) {
                let checkC = this.c + this.nextVx;
                let checkR = this.r + this.nextVy;
                if (checkC < 0) checkC = cols - 1;
                if (checkC >= cols) checkC = 0;
                if (map[checkR][checkC] !== 0) {
                    this.vx = this.nextVx;
                    this.vy = this.nextVy;
                }
            } else if (isChangingAxis) {
                if (Math.abs(this.x - centerX) <= this.speed && Math.abs(this.y - centerY) <= this.speed) {
                    let checkC = this.c + this.nextVx;
                    let checkR = this.r + this.nextVy;
                    if (checkC < 0) checkC = cols - 1;
                    if (checkC >= cols) checkC = 0;
                    if (map[checkR][checkC] !== 0) {
                        this.x = centerX;
                        this.y = centerY;
                        this.vx = this.nextVx;
                        this.vy = this.nextVy;
                    }
                }
            }
        }

        if (this.vx !== 0 || this.vy !== 0) {
            const nextX = this.x + this.vx * this.speed;
            const nextY = this.y + this.vy * this.speed;
            const aheadC = this.c + this.vx;
            const aheadR = this.r + this.vy;

            if (aheadC < 0 || aheadC >= cols) {
                this.x = nextX;
            } else if (map[aheadR][aheadC] === 0) {
                if (this.vx > 0 && nextX >= centerX) { this.x = centerX; this.vx = 0; }
                else if (this.vx < 0 && nextX <= centerX) { this.x = centerX; this.vx = 0; }
                else if (this.vy > 0 && nextY >= centerY) { this.y = centerY; this.vy = 0; }
                else if (this.vy < 0 && nextY <= centerY) { this.y = centerY; this.vy = 0; }
                else { this.x = nextX; this.y = nextY; }
            } else {
                this.x = nextX;
                this.y = nextY;
            }
        }

        if (this.x < 0) this.x = cols * tileSize - 1;
        if (this.x >= cols * tileSize) this.x = 0;

        this.c = Math.floor(this.x / tileSize);
        this.r = Math.floor(this.y / tileSize);
    }
}

class Pacman extends Entity {
    constructor(c, r) {
        super(c, r, 0.035);
        this.angle = 0;
        this.mouthOpen = 0;
        this.mouthDir = 1;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw the player's name above (multiplayer only)
        if (localPlayerName) {
            const fontSize = Math.max(8, Math.min(12, tileSize * 0.4));
            ctx.font = `bold ${fontSize}px "Segoe UI"`;
            ctx.textAlign = 'center';
            const nameWidth = ctx.measureText(localPlayerName).width;
            const tagY = -tileSize * 0.65;
            ctx.fillStyle = 'rgba(0,0,0,0.75)';
            ctx.beginPath();
            ctx.roundRect(-nameWidth / 2 - 4, tagY - fontSize - 2, nameWidth + 8, fontSize + 4, 3);
            ctx.fill();
            ctx.fillStyle = localPlayerColor;
            ctx.fillText(localPlayerName, 0, tagY);
        }

        if (this.vx > 0) this.angle = 0;
        else if (this.vx < 0) this.angle = Math.PI;
        else if (this.vy > 0) this.angle = Math.PI / 2;
        else if (this.vy < 0) this.angle = -Math.PI / 2;
        ctx.rotate(this.angle);

        if (this.vx !== 0 || this.vy !== 0) {
            this.mouthOpen += 0.08 * this.mouthDir;
            if (this.mouthOpen >= 0.6 || this.mouthOpen <= 0) this.mouthDir *= -1;
        } else {
            this.mouthOpen = 0.3;
        }

        ctx.fillStyle = localPlayerColor;
        ctx.beginPath();
        ctx.arc(0, 0, tileSize * 0.4, this.mouthOpen * Math.PI, (2 - this.mouthOpen) * Math.PI);
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.restore();
    }

    eat() {
        const cell = map[this.r]?.[this.c];
        if (cell === undefined) return;

        if (cell === 1) {
            map[this.r][this.c] = 2;

            if (onSmallPelletEaten) {
                // Multiplayer: delegate to socketService (handles score + server emit)
                onSmallPelletEaten(this.r, this.c);
            } else {
                // Solo: handle locally
                gameStore.addScore(10);
                gameStore.smallPelletsEaten++;
                if (gameStore.smallPelletsEaten % pelletsPerFact === 0) queueFunFact();
            }
        } else if (cell >= 3 && cell <= 9) {
            const sectionId = cell;
            map[this.r][this.c] = 2;
            this.mouthOpen = 0.3;

            if (onBigPelletEaten) {
                // Multiplayer: delegate to socketService (server broadcasts to all)
                onBigPelletEaten(sectionId, this.r, this.c);
            } else {
                // Solo: handle locally
                gameStore.addScore(100);
                gameStore.sectionsEatenThisLevel++;
                gameStore.unlockSection(sectionId, portfolioData[sectionId]);
                gameStore.checkWinCondition();
            }
        }
    }
}

class Ghost extends Entity {
    constructor(c, r, color, delay) {
        super(c, r, 0.025);
        this.color = color;
        this.active = false;
        this.angle = 0;
        setTimeout(() => this.active = true, delay);
    }

    get speed() {
        const base = super.speed;
        const multiplier = 1 + (gameStore.unlockedSections.length * 0.05);
        return base * multiplier;
    }

    decideDirection() {
        if (!this.active) return;

        const possible = [];
        const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        const backwardX = -this.vx;
        const backwardY = -this.vy;

        for (const d of dirs) {
            let nc = this.c + d[0];
            let nr = this.r + d[1];
            if (nc < 0) nc = cols - 1;
            if (nc >= cols) nc = 0;
            if (nr < 0 || nr >= rows) continue;
            if (map[nr][nc] !== 0) {
                if (d[0] !== backwardX || d[1] !== backwardY || (this.vx === 0 && this.vy === 0)) {
                    possible.push(d);
                }
            }
        }

        if (possible.length === 0) { this.nextVx = backwardX; this.nextVy = backwardY; return; }
        if (possible.length === 1) { this.nextVx = possible[0][0]; this.nextVy = possible[0][1]; return; }

        const chaseChance = gameStore.unlockedSections.length * 0.12;

        if (Math.random() < chaseChance) {
            let targetC = player.c;
            let targetR = player.r;

            if (this.color === '#f472b6') { targetC += player.vx * 4; targetR += player.vy * 4; }
            else if (this.color === '#06b6d4') { targetC += Math.floor(Math.random() * 5) - 2; targetR += Math.floor(Math.random() * 5) - 2; }

            targetC = Math.max(0, Math.min(cols - 1, targetC));
            targetR = Math.max(0, Math.min(rows - 1, targetR));
            if (map[targetR][targetC] === 0) { targetC = player.c; targetR = player.r; }

            const paths = [];
            for (const d of possible) {
                let nc = this.c + d[0];
                let nr = this.r + d[1];
                if (nc < 0) nc = cols - 1;
                if (nc >= cols) nc = 0;
                let pathLen = this.getBfsDistance(nc, nr, targetC, targetR);
                if (pathLen === Infinity) pathLen = Math.hypot(nc - targetC, nr - targetR) + 1000;
                if (d[0] === this.vx && d[1] === this.vy) pathLen -= 0.1;
                paths.push({ dir: d, len: pathLen });
            }
            paths.sort((a, b) => a.len - b.len);

            const occupiedDirs = [];
            const myIndex = ghosts.indexOf(this);
            for (let i = 0; i < myIndex; i++) {
                const other = ghosts[i];
                if (other.c === this.c && other.r === this.r) {
                    occupiedDirs.push(`${other.nextVx},${other.nextVy}`);
                }
            }

            let bestDir = paths[0].dir;
            for (const p of paths) {
                if (!occupiedDirs.includes(`${p.dir[0]},${p.dir[1]}`)) { bestDir = p.dir; break; }
            }
            this.nextVx = bestDir[0];
            this.nextVy = bestDir[1];
        } else {
            const rand = possible[Math.floor(Math.random() * possible.length)];
            this.nextVx = rand[0];
            this.nextVy = rand[1];
        }
    }

    getBfsDistance(sc, sr, tc, tr) {
        if (sc === tc && sr === tr) return 0;
        const queue = [{ c: sc, r: sr, dist: 0 }];
        const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
        visited[sr][sc] = true;

        while (queue.length > 0) {
            const curr = queue.shift();
            if (curr.dist > 400) return Infinity;
            for (const d of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
                let nc = curr.c + d[0];
                let nr = curr.r + d[1];
                if (nc < 0) nc = cols - 1;
                else if (nc >= cols) nc = 0;
                if (nr >= 0 && nr < rows && map[nr][nc] !== 0 && !visited[nr][nc]) {
                    if (nc === tc && nr === tr) return curr.dist + 1;
                    visited[nr][nc] = true;
                    queue.push({ c: nc, r: nr, dist: curr.dist + 1 });
                }
            }
        }
        return Infinity;
    }

    move() {
        if (!this.active) return;

        const targetX = this.c * tileSize + tileSize / 2;
        const targetY = this.r * tileSize + tileSize / 2;

        if (Math.abs(this.x - targetX) <= this.speed && Math.abs(this.y - targetY) <= this.speed) {
            if (!this.lastDecision || this.lastDecision.c !== this.c || this.lastDecision.r !== this.r) {
                this.x = targetX;
                this.y = targetY;
                if (!this.lastDecision) this.lastDecision = { c: -1, r: -1 };
                this.lastDecision.c = this.c;
                this.lastDecision.r = this.r;
                this.decideDirection();
                this.vx = this.nextVx;
                this.vy = this.nextVy;
                return;
            }
        }

        this.x += this.vx * this.speed;
        this.y += this.vy * this.speed;

        if (this.x < 0) this.x = cols * tileSize - 1;
        if (this.x >= cols * tileSize) this.x = 0;

        this.c = Math.floor(this.x / tileSize);
        this.r = Math.floor(this.y / tileSize);
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.vx > 0) this.angle = 0;
        else if (this.vx < 0) this.angle = Math.PI;
        else if (this.vy > 0) this.angle = Math.PI / 2;
        else if (this.vy < 0) this.angle = -Math.PI / 2;
        ctx.rotate(this.angle);

        const r = tileSize * 0.35;

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-r * 0.2, -r * 0.2); ctx.lineTo(-r * 0.6, -r * 0.8);
        ctx.moveTo(r * 0.1, -r * 0.3);  ctx.lineTo(r * 0.1, -r * 0.9);
        ctx.moveTo(r * 0.4, -r * 0.2);  ctx.lineTo(r * 0.7, -r * 0.7);
        ctx.moveTo(-r * 0.2, r * 0.2);  ctx.lineTo(-r * 0.6, r * 0.8);
        ctx.moveTo(r * 0.1, r * 0.3);   ctx.lineTo(r * 0.1, r * 0.9);
        ctx.moveTo(r * 0.4, r * 0.2);   ctx.lineTo(r * 0.7, r * 0.7);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(r * 0.6, -r * 0.1); ctx.lineTo(r * 1.1, -r * 0.5);
        ctx.moveTo(r * 0.6, r * 0.1);  ctx.lineTo(r * 1.1, r * 0.5);
        ctx.stroke();

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.7, r * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(r * 0.5, 0, r * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ff0000';
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#ff0000';
        ctx.beginPath();
        ctx.arc(r * 0.6, -r * 0.15, r * 0.08, 0, Math.PI * 2);
        ctx.arc(r * 0.6, r * 0.15, r * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
    }
}

// ─── Fun facts (solo + triggered by server in multiplayer) ────────────────────

function queueFunFact() {
    let factIndex;
    do {
        factIndex = Math.floor(Math.random() * funFacts.length);
    } while (factIndex === lastFactIndex);
    lastFactIndex = factIndex;
    toastQueue.push(funFacts[factIndex]);
    processToastQueue();
}

function processToastQueue() {
    if (isToastVisible || toastQueue.length === 0) return;
    isToastVisible = true;
    gameStore.setToast(toastQueue.shift());
    setTimeout(() => {
        gameStore.clearToast();
        setTimeout(() => {
            isToastVisible = false;
            if (toastQueue.length > 0) processToastQueue();
        }, 500);
    }, 3500);
}

// ─── Controller API ───────────────────────────────────────────────────────────

export function setPlayerDirection(dx, dy) {
    if (!player || gameStore.status !== 'playing') return;
    player.nextVx = dx;
    player.nextVy = dy;
}
