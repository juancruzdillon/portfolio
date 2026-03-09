import { gameStore } from '../store/gameStore';
import { portfolioData, funFacts } from '../data/portfolioData';
import { MapGenerator } from './mapGenerator';

// --- MAPA DEL JUEGO ---
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

const palettes = [
    { wallFill: 'rgba(29, 78, 216, 0.2)', wallBorder: '#3b82f6', pellet: '#fca5a5' }, // Lvl 1 Blue / Pink
    { wallFill: 'rgba(220, 38, 38, 0.2)', wallBorder: '#ef4444', pellet: '#fef08a' }, // Lvl 2 Red / Yellow
    { wallFill: 'rgba(5, 150, 105, 0.2)', wallBorder: '#10b981', pellet: '#fbcfe8' }, // Lvl 3 Green / Light Pink
    { wallFill: 'rgba(124, 58, 237, 0.2)', wallBorder: '#8b5cf6', pellet: '#93c5fd' }, // Lvl 4 Purple / Cyan
    { wallFill: 'rgba(217, 119, 6, 0.2)', wallBorder: '#f59e0b', pellet: '#a7f3d0' },  // Lvl 5 Orange / Mint
    { wallFill: 'rgba(219, 39, 119, 0.2)', wallBorder: '#ec4899', pellet: '#bfdbfe' }  // Lvl 6 Pink / Light Blue
];

export function initGameEngine(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    resetGameData();
    startGameLoop();
}

export function startGameLoop() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    gameLoop();
}

export function resetGameData() {
    const generator = new MapGenerator(rows, cols);
    mapData = generator.generate();
    map = mapData.map;
    
    // Randomize Big Pellets (Portfolio Sections 3 to 9)
    const sectionIds = Object.keys(portfolioData).map(Number);
    let validSpots = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (map[r][c] === 1) {
                validSpots.push({ r, c });
            }
        }
    }
    
    let placedSpots = [];
    sectionIds.forEach(id => {
        if (validSpots.length > 0) {
            let bestSpot = null;
            let bestIdx = -1;
            
            for (let i = 0; i < 50; i++) {
                let randIdx = Math.floor(Math.random() * validSpots.length);
                let candidate = validSpots[randIdx];
                let tooClose = false;
                
                for (let placed of placedSpots) {
                    let dist = Math.hypot(placed.r - candidate.r, placed.c - candidate.c);
                    if (dist < 4) {
                        tooClose = true;
                        break;
                    }
                }
                
                if (!tooClose) {
                    bestSpot = candidate;
                    bestIdx = randIdx;
                    break;
                }
            }
            
            if (!bestSpot) {
                bestIdx = Math.floor(Math.random() * validSpots.length);
                bestSpot = validSpots[bestIdx];
            }
            
            validSpots.splice(bestIdx, 1);
            placedSpots.push(bestSpot);
            map[bestSpot.r][bestSpot.c] = id;
        }
    });

    // Calculate toast frequency
    let totalSmallPellets = validSpots.length; // Remaining strictly small pellets
    gameStore.totalSmallPellets = totalSmallPellets;
    pelletsPerFact = Math.max(1, Math.floor(totalSmallPellets / funFacts.length));

    // FAIL-SAFE: Forcing state resets outside of Vue proxy methods to guarantee zeroed values
    gameStore.sectionsEatenThisLevel = 0;
    gameStore.smallPelletsEaten = 0;
    
    player = new Pacman(mapData.playerStart.c, mapData.playerStart.r);
    ghosts = mapData.ghostStarts.map(g => new Ghost(g.c, g.r, g.color, g.delay));

    toastQueue = [];
    isToastVisible = false;
}

export function resetPositions() {
    if(!player || !mapData) return;
    player = new Pacman(mapData.playerStart.c, mapData.playerStart.r);
    ghosts = mapData.ghostStarts.map(g => new Ghost(g.c, g.r, g.color, g.delay));
}

function resizeCanvas() {
    if(!canvas) return;
    const isMobile = window.innerWidth < 768;
    const navSpace = isMobile ? 220 : 0; // Space for D-Pad on mobile
    
    const containerWidth = window.innerWidth * 0.95;
    const containerHeight = (window.innerHeight - navSpace) * 0.85; // Use 85% of available space
    
    const cellW = containerWidth / cols;
    const cellH = containerHeight / rows;
    
    tileSize = Math.floor(Math.min(cellW, cellH));
    
    canvas.width = tileSize * cols;
    canvas.height = tileSize * rows;
    
    if (player) {
        player.x = player.c * tileSize + tileSize/2;
        player.y = player.r * tileSize + tileSize/2;
        ghosts.forEach(g => {
            g.x = g.c * tileSize + tileSize/2;
            g.y = g.r * tileSize + tileSize/2;
        });
    }
}

function gameLoop() {
    if (gameStore.status === 'playing') {
        update();
        if (ctx) draw();
    } else if (gameStore.status === 'paused' || gameStore.status === 'respawning' || gameStore.status === 'start') {
        if (ctx) draw();
    }
    
    animationFrameId = requestAnimationFrame(gameLoop);
}

function update() {
    player.move();
    player.eat();

    ghosts.forEach(ghost => {
        ghost.move();
        
        let dist = Math.hypot(player.x - ghost.x, player.y - ghost.y);
        if (dist < tileSize * 0.8 && gameStore.status === 'playing') {
            gameStore.loseLife(() => resetPositions());
        }
    });
}

function draw() {
    drawMap();
    if(player) player.draw();
    ghosts.forEach(g => g.draw());
}

function drawMap() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let currentPalette = palettes[(gameStore.level - 1) % palettes.length];
    let labelsToDraw = []; 

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let x = c * tileSize;
            let y = r * tileSize;
            
            if (map[r][c] === 0) {
                ctx.fillStyle = currentPalette.wallFill;
                ctx.fillRect(x, y, tileSize, tileSize);
                ctx.strokeStyle = currentPalette.wallBorder;
                ctx.lineWidth = 1.5;
                ctx.strokeRect(x, y, tileSize, tileSize);
            } else if (map[r][c] === 1) {
                ctx.fillStyle = currentPalette.pellet;
                ctx.beginPath();
                ctx.arc(x + tileSize/2, y + tileSize/2, tileSize * 0.15, 0, Math.PI*2);
                ctx.fill();
            } else if (map[r][c] >= 3 && map[r][c] <= 9) {
                let section = portfolioData[map[r][c]];
                ctx.fillStyle = section.color;
                
                ctx.shadowBlur = 15;
                ctx.shadowColor = section.color;
                ctx.beginPath();
                let pulse = Math.sin(Date.now() / 200) * 2;
                ctx.arc(x + tileSize/2, y + tileSize/2, tileSize * 0.35 + pulse, 0, Math.PI*2);
                ctx.fill();
                ctx.shadowBlur = 0; 
                
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(x + tileSize/2, y + tileSize/2, tileSize * 0.15, 0, Math.PI*2);
                ctx.fill();

                labelsToDraw.push({
                    text: section.title.toUpperCase(),
                    x: x + tileSize/2,
                    y: y - 8,
                    color: section.color
                });
            }
        }
    }

    labelsToDraw.forEach(label => {
        let fontSize = Math.max(7, Math.min(11, tileSize * 0.45));
        ctx.font = `bold ${fontSize}px "Segoe UI"`;
        ctx.textAlign = 'center';
        
        let textWidth = ctx.measureText(label.text).width;
        let paddingX = 6;
        let paddingY = 4;
        let boxWidth = textWidth + paddingX * 2;
        
        // Clamp label X coordinate to stay strictly inside the canvas edges
        let labelX = Math.max(boxWidth/2 + 2, Math.min(canvas.width - boxWidth/2 - 2, label.x));
        let labelY = label.y;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.beginPath();
        ctx.roundRect(labelX - boxWidth/2, labelY - fontSize - paddingY, boxWidth, fontSize + paddingY * 2, 4);
        ctx.fill();
        
        ctx.fillStyle = label.color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = label.color;
        // Text is drawn relative to the baseline
        ctx.fillText(label.text, labelX, labelY - paddingY/2);
        ctx.shadowBlur = 0;
    });
}

// --- ENTITIES ---
class Entity {
    constructor(c, r, speedRatio) {
        this.c = c; this.r = r;
        this.x = c * tileSize + tileSize/2;
        this.y = r * tileSize + tileSize/2;
        this.vx = 0; this.vy = 0;
        this.nextVx = 0; this.nextVy = 0;
        this.speedRatio = speedRatio;
    }

    get speed() {
        // En mobile el tilesize es menor. Usar ratio puro para que la 
        // velocidad escale impecablemente sin importar la resolución.
        return tileSize * this.speedRatio;
    }

    move() {
        let centerX = this.c * tileSize + tileSize / 2;
        let centerY = this.r * tileSize + tileSize / 2;
        
        // 1. Check if we want to turn
        if (this.nextVx !== 0 || this.nextVy !== 0) {
            let isChangingAxis = (this.vx !== 0 && this.nextVy !== 0) || (this.vy !== 0 && this.nextVx !== 0) || (this.vx === 0 && this.vy === 0);
            let isUturn = (this.nextVx === -this.vx && this.nextVy === -this.vy) && (this.vx !== 0 || this.vy !== 0);

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
                // Must be securely aligned with topological center to make a 90-degree turn
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

        // 2. Move along current vector
        if (this.vx !== 0 || this.vy !== 0) {
            let nextX = this.x + this.vx * this.speed;
            let nextY = this.y + this.vy * this.speed;
            
            let aheadC = this.c + this.vx;
            let aheadR = this.r + this.vy;
            
            if (aheadC < 0 || aheadC >= cols) {
                this.x = nextX;
            } else if (map[aheadR][aheadC] === 0) {
                if (this.vx > 0 && nextX >= centerX) { this.x = centerX; this.vx = 0; }
                else if (this.vx < 0 && nextX <= centerX) { this.x = centerX; this.vx = 0; }
                else if (this.vy > 0 && nextY >= centerY) { this.y = centerY; this.vy = 0; }
                else if (this.vy < 0 && nextY <= centerY) { this.y = centerY; this.vy = 0; }
                else {
                    this.x = nextX;
                    this.y = nextY;
                }
            } else {
                this.x = nextX;
                this.y = nextY;
            }
        }

        // 3. Wrap limits
        if (this.x < 0) this.x = cols * tileSize - 1;
        if (this.x >= cols * tileSize) this.x = 0;

        this.c = Math.floor(this.x / tileSize);
        this.r = Math.floor(this.y / tileSize);
    }
}

class Pacman extends Entity {
    constructor(c, r) {
        // En desktop (size~40), ratio 0.035 => speed ~1.4
        super(c, r, 0.035);
        this.angle = 0;
        this.mouthOpen = 0;
        this.mouthDir = 1;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        if (this.vx > 0) this.angle = 0;
        else if (this.vx < 0) this.angle = Math.PI;
        else if (this.vy > 0) this.angle = Math.PI / 2;
        else if (this.vy < 0) this.angle = -Math.PI / 2;
        ctx.rotate(this.angle);

        if (this.vx !== 0 || this.vy !== 0) {
            this.mouthOpen += 0.08 * this.mouthDir;
            if (this.mouthOpen >= 0.6 || this.mouthOpen <= 0) this.mouthDir *= -1;
        } else {
            // Cuando impacta contra una pared o se detiene, 
            // la boca queda semi-abierta como solicitó el usuario.
            this.mouthOpen = 0.3;
        }

        ctx.fillStyle = '#facc15'; 
        ctx.beginPath();
        ctx.arc(0, 0, tileSize * 0.4, this.mouthOpen * Math.PI, (2 - this.mouthOpen) * Math.PI);
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.restore();
    }

    eat() {
        let cell = map[this.r][this.c];
        if (cell === 1) {
            map[this.r][this.c] = 2; // Vaciar
            gameStore.addScore(10);
            gameStore.smallPelletsEaten++;
            
            if (gameStore.smallPelletsEaten % pelletsPerFact === 0) {
                queueFunFact();
            }
        } else if (cell >= 3 && cell <= 9) {
            let sectionId = cell;
            map[this.r][this.c] = 2; // Vaciar
            gameStore.addScore(100);
            this.mouthOpen = 0.3; // Freeze mouth semi-open for modal
            
            gameStore.sectionsEatenThisLevel++;
            gameStore.unlockSection(sectionId, portfolioData[sectionId]);
        }
        
        gameStore.checkWinCondition();
    }
}

class Ghost extends Entity {
    constructor(c, r, color, delay) {
        // En desktop (size~40), base ratio 0.025
        super(c, r, 0.025);
        this.color = color;
        this.active = false;
        this.angle = 0; 
        setTimeout(() => this.active = true, delay);
    }

    get speed() {
        let base = tileSize * this.speedRatio;
        // Difficulty multiplier: +5% speed for each unlocked section
        let multiplier = 1 + (gameStore.unlockedSections.length * 0.05);
        return base * multiplier;
    }

    decideDirection() {
        if (!this.active) return;
        
        let possible = [];
        const dirs = [[0,-1], [1,0], [0,1], [-1,0]]; 
        
        const backwardX = -this.vx;
        const backwardY = -this.vy;

        for (let d of dirs) {
            let nc = this.c + d[0];
            let nr = this.r + d[1];
            
            // Tunnel wrap support
            if (nc < 0) nc = cols - 1;
            if (nc >= cols) nc = 0;
            if (nr < 0 || nr >= rows) continue;
            
            if (map[nr][nc] !== 0) {
                // Prevent 180 degree turns unless explicitly trapped
                if (d[0] !== backwardX || d[1] !== backwardY || (this.vx===0 && this.vy===0)) {
                    possible.push(d);
                }
            }
        }

        if (possible.length === 0) {
            this.nextVx = backwardX;
            this.nextVy = backwardY;
            return;
        }

        // If only one way forward (hallway), just take it.
        if (possible.length === 1) {
            this.nextVx = possible[0][0];
            this.nextVy = possible[0][1];
            return;
        }
        


        // Intersection: decide whether to use AI pathfinding or roam randomly
        let chaseChance = gameStore.unlockedSections.length * 0.12; // Increases as game progresses
        
        if (Math.random() < chaseChance) {
            let targetC = player.c;
            let targetR = player.r;
            
            // Unique Ghost Behaviors to prevent clumping
            if (this.color === '#f472b6') { // Pinky: Tries to ambush 4 tiles ahead of player
                targetC += player.vx * 4;
                targetR += player.vy * 4;
            } else if (this.color === '#06b6d4') { // Inky: Erratic pursuit slightly off target
                targetC += (Math.floor(Math.random() * 5) - 2);
                targetR += (Math.floor(Math.random() * 5) - 2);
            }
            
            // Clamp target to map coordinates
            if (targetC < 0) targetC = 0;
            if (targetC >= cols) targetC = cols - 1;
            if (targetR < 0) targetR = 0;
            if (targetR >= rows) targetR = rows - 1;

            // If target is inside a wall, just fall back to direct player targeting
            if (map[targetR][targetC] === 0) {
                targetC = player.c;
                targetR = player.r;
            }

            // Prevent AI from calculating a path going backward if we are just crossing an intersection
            let paths = [];

            for (let d of possible) {
                let nc = this.c + d[0];
                let nr = this.r + d[1];
                if (nc < 0) nc = cols - 1;
                if (nc >= cols) nc = 0;

                let pathLen = this.getBfsDistance(nc, nr, targetC, targetR);
                if (pathLen === Infinity) {
                    // Fallback Euclidean distance if BFS gave up (very rare on 400 depth)
                    pathLen = Math.hypot(nc - targetC, nr - targetR) + 1000;
                }
                // Bias slightly towards keeping the current direction
                if (d[0] === this.vx && d[1] === this.vy) {
                    pathLen -= 0.1; 
                }
                paths.push({ dir: d, len: pathLen });
            }
            
            paths.sort((a, b) => a.len - b.len);
            
            // Cooperative Tie-Breaker: Avoid taking the exact same optimal path if another ghost is here
            let occupiedDirs = [];
            let myIndex = ghosts.indexOf(this);
            for (let i = 0; i < myIndex; i++) {
                let other = ghosts[i];
                if (other.c === this.c && other.r === this.r) {
                    // This other ghost has already decided its next vector from this cell
                    occupiedDirs.push(`${other.nextVx},${other.nextVy}`);
                }
            }

            let bestDir = paths[0].dir;
            for (let p of paths) {
                if (!occupiedDirs.includes(`${p.dir[0]},${p.dir[1]}`)) {
                    bestDir = p.dir;
                    break; // Pick the best unoccupied path
                }
            }

            this.nextVx = bestDir[0];
            this.nextVy = bestDir[1];
        } else {
            // Random scatter
            let rand = possible[Math.floor(Math.random() * possible.length)];
            this.nextVx = rand[0];
            this.nextVy = rand[1];
        }
    }

    getBfsDistance(sc, sr, tc, tr) {
        if (sc === tc && sr === tr) return 0;
        let queue = [{c: sc, r: sr, dist: 0}];
        // Matrix of visited cells to prevent infinite loops
        let visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
        visited[sr][sc] = true;
        
        while(queue.length > 0) {
            let curr = queue.shift();
            
            if (curr.dist > 400) return Infinity; // Prevent massive CPU spikes, give up if path is too insane
            
            const dirs = [[0,-1], [1,0], [0,1], [-1,0]];
            for (let d of dirs) {
                let nc = curr.c + d[0];
                let nr = curr.r + d[1];
                
                if (nc < 0) nc = cols - 1;
                else if (nc >= cols) nc = 0;
                
                if (nr >= 0 && nr < rows && map[nr][nc] !== 0 && !visited[nr][nc]) {
                    if (nc === tc && nr === tr) return curr.dist + 1;
                    visited[nr][nc] = true;
                    queue.push({c: nc, r: nr, dist: curr.dist + 1});
                }
            }
        }
        return Infinity; // No valid path found
    }

    move() {
        if (!this.active) return;
        
        let targetX = this.c * tileSize + tileSize/2;
        let targetY = this.r * tileSize + tileSize/2;
        
        if (Math.abs(this.x - targetX) <= this.speed && Math.abs(this.y - targetY) <= this.speed) {
            if (!this.lastDecision || this.lastDecision.c !== this.c || this.lastDecision.r !== this.r) {
                // SNAP AL CENTRO EXACTO DE LA CELDA
                this.x = targetX;
                this.y = targetY;
                
                if (!this.lastDecision) this.lastDecision = { c: -1, r: -1 };
                this.lastDecision.c = this.c;
                this.lastDecision.r = this.r;

                this.decideDirection();

                this.vx = this.nextVx;
                this.vy = this.nextVy;
                return; // Evita el sobresalto "jolt" de 2x speed en el fotograma del giro
            }
        }

        this.x += this.vx * this.speed;
        this.y += this.vy * this.speed;
        
        // Wrap around logic for tunnel borders
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

        let r = tileSize * 0.35;

        // Patas
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Lado izq
        ctx.moveTo(-r*0.2, -r*0.2); ctx.lineTo(-r*0.6, -r*0.8);
        ctx.moveTo(r*0.1, -r*0.3); ctx.lineTo(r*0.1, -r*0.9);
        ctx.moveTo(r*0.4, -r*0.2); ctx.lineTo(r*0.7, -r*0.7);
        // Lado der
        ctx.moveTo(-r*0.2, r*0.2); ctx.lineTo(-r*0.6, r*0.8);
        ctx.moveTo(r*0.1, r*0.3); ctx.lineTo(r*0.1, r*0.9);
        ctx.moveTo(r*0.4, r*0.2); ctx.lineTo(r*0.7, r*0.7);
        ctx.stroke();

        // Antenas
        ctx.beginPath();
        ctx.moveTo(r*0.6, -r*0.1); ctx.lineTo(r*1.1, -r*0.5);
        ctx.moveTo(r*0.6, r*0.1); ctx.lineTo(r*1.1, r*0.5);
        ctx.stroke();

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, r*0.7, r*0.4, 0, 0, Math.PI*2); 
        ctx.fill();

        ctx.fillStyle = '#222'; 
        ctx.beginPath();
        ctx.arc(r*0.5, 0, r*0.3, 0, Math.PI*2);
        ctx.fill();

        ctx.fillStyle = '#ff0000';
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#ff0000';
        ctx.beginPath();
        ctx.arc(r*0.6, -r*0.15, r*0.08, 0, Math.PI*2);
        ctx.arc(r*0.6, r*0.15, r*0.08, 0, Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
    }
}

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
        // Give the Vue transition time to fade out before processing the next one
        setTimeout(() => {
            isToastVisible = false;
            if (toastQueue.length > 0) {
                processToastQueue(); 
            }
        }, 500); 
    }, 3500); 
}

// Controller API
export function setPlayerDirection(dx, dy) {
    if(!player || gameStore.status !== 'playing') return;
    player.nextVx = dx;
    player.nextVy = dy;
}
