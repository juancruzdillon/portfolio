// socketService — all Socket.io client logic lives here.
//
// Responsibilities:
//   • Connect / disconnect to the server
//   • Emit player actions (move, eat pellet)
//   • Handle server events and bridge them into the engine & stores
//
// The engine and stores are NOT imported at module load time to avoid
// circular dependencies; they are resolved lazily on first use.

import { io } from 'socket.io-client';
import { multiplayerStore } from '../store/multiplayerStore.js';
import { gameStore } from '../store/gameStore.js';
import { portfolioData, funFacts } from '../data/portfolioData.js';

// In development Vite proxies /socket.io → localhost:3001.
// In production, set VITE_SOCKET_URL to your deployed server URL.
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '';

let socket = null;

// Position-sync interval handle
let syncInterval = null;

// ─── Engine accessors (lazy to avoid circular imports) ────────────────────────

function engine() {
    // Dynamic import resolved at call-time
    return import('../game/engine.js');
}

// ─── Connect ──────────────────────────────────────────────────────────────────

export function connect() {
    if (socket?.connected) return;

    socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: false, // Reconnection UX handled by the LobbyScreen
    });

    _registerHandlers();
}

export function joinLobby(name) {
    if (!socket?.connected) connect();
    socket.emit('join_lobby', { name });
    multiplayerStore.lobbyStatus = 'connecting';
}

export function disconnect() {
    stopPositionSync();
    socket?.disconnect();
    socket = null;
    multiplayerStore.lobbyStatus = 'idle';
}

// ─── Outgoing events ─────────────────────────────────────────────────────────

export function emitSmallPelletEaten(row, col) {
    socket?.emit('small_pellet_eaten', { row, col });
}

export function emitBigPelletEaten(sectionId, row, col) {
    socket?.emit('big_pellet_eaten', { sectionId, row, col });
}

// Sends the local player's normalised position to the server every 50ms.
export function startPositionSync() {
    stopPositionSync();
    syncInterval = setInterval(async () => {
        if (!socket?.connected) return;
        const eng = await engine();
        const state = eng.getLocalPlayerState();
        if (state) socket.emit('player_move', state);
    }, 50);
}

export function stopPositionSync() {
    if (syncInterval) { clearInterval(syncInterval); syncInterval = null; }
}

// ─── Incoming event handlers ─────────────────────────────────────────────────

function _registerHandlers() {
    // Server confirmed our identity
    socket.on('assigned', ({ playerId, color }) => {
        multiplayerStore.playerId = playerId;
        multiplayerStore.playerColor = color;
    });

    // Still waiting in the queue for a partner
    socket.on('waiting', () => {
        multiplayerStore.lobbyStatus = 'waiting';
    });

    // Matched! The server sends the authoritative map and both players' info.
    socket.on('game_start', async ({ roomId, players, yourPlayerId, map, playerStart, ghostStarts, pelletsPerFact }) => {
        const myInfo = players.find(p => p.id === yourPlayerId);
        const partnerInfo = players.find(p => p.id !== yourPlayerId);

        multiplayerStore.roomId = roomId;
        multiplayerStore.playerId = yourPlayerId;
        multiplayerStore.playerColor = myInfo?.color ?? '#facc15';
        multiplayerStore.partnerInfo = partnerInfo ?? null;
        multiplayerStore.lobbyStatus = 'ready';
        multiplayerStore.partnerDisconnected = false;

        // Initialise engine with the server's map
        const eng = await engine();
        const canvasEl = document.getElementById('gameCanvas');
        if (!canvasEl) return;

        eng.setLocalPlayerColor(multiplayerStore.playerColor);
        eng.setLocalPlayerName(multiplayerStore.playerName);

        // Register eat callbacks so the engine notifies us instead of handling locally
        eng.setEatCallbacks(
            (row, col) => {
                // Small pellet eaten by local player
                gameStore.addScore(10);
                emitSmallPelletEaten(row, col);
            },
            (sectionId, row, col) => {
                // Big pellet eaten by local player — score immediately, modal comes via server event
                gameStore.addScore(100);
                emitBigPelletEaten(sectionId, row, col);
            }
        );

        const serverMapData = { map, playerStart, ghostStarts, pelletsPerFact };
        gameStore.reset(); // Resets status to 'playing', score, lives, etc.
        eng.initGameEngine(canvasEl, serverMapData);
        startPositionSync();
    });

    // The partner moved — update their position in the engine
    socket.on('player_update', async ({ playerId, ...state }) => {
        const eng = await engine();
        eng.setRemotePlayer(playerId, {
            ...state,
            color: multiplayerStore.partnerInfo?.color ?? '#60a5fa',
            name: multiplayerStore.partnerInfo?.name ?? 'Jugador',
        });
    });

    // A small pellet was eaten by someone — remove it from the local map
    socket.on('pellet_removed', async ({ row, col }) => {
        const eng = await engine();
        eng.applyPelletRemoval(row, col);
    });

    // Pellet respawned after 3 seconds
    socket.on('pellet_respawned', async ({ row, col }) => {
        const eng = await engine();
        eng.applyPelletRespawn(row, col);
    });

    // Server tells this player to show a fun fact (private)
    socket.on('trigger_fun_fact', async () => {
        const eng = await engine();
        eng.triggerFunFact();
    });

    // A section was unlocked by any player — remove pellet from map + show modal to everyone
    socket.on('section_unlocked', async ({ sectionId, eaterName, row, col }) => {
        // Remove the big pellet cell so it stops rendering for both players
        if (row !== undefined && col !== undefined) {
            const eng = await engine();
            eng.applyPelletRemoval(row, col);
        }
        const data = portfolioData[sectionId];
        if (!data) return;
        gameStore.sectionsEatenThisLevel++;
        gameStore.unlockSection(sectionId, { ...data, eaterName });
        // Win is checked inside resumeGame() when the modal is closed
    });

    // Server declares the game won (all 7 sections collected cooperatively)
    socket.on('game_won', () => {
        gameStore.updateHighScore();
        gameStore.status = 'win';
    });

    // Partner disconnected mid-game
    socket.on('partner_disconnected', () => {
        multiplayerStore.partnerDisconnected = true;
        engine().then(eng => eng.removeRemotePlayer(multiplayerStore.partnerInfo?.id));
        // The game continues in solo-like mode; show a toast
        gameStore.setToast('Tu compañero se desconectó. ¡Continúa tú solo!');
    });

    socket.on('disconnect', () => {
        multiplayerStore.lobbyStatus = 'idle';
        stopPositionSync();
    });

    socket.on('connect_error', () => {
        multiplayerStore.lobbyStatus = 'idle';
        gameStore.setToast('No se pudo conectar al servidor.');
    });
}
