// Entry point — Express HTTP server + Socket.io
//
// Start with:  node index.js           (production)
//              node --watch index.js   (development, auto-restart)
//
// The frontend Vite dev server proxies /socket.io requests to this port,
// so during development there are no CORS issues.

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { RoomManager } from './RoomManager.js';

const PORT = process.env.PORT || 3001;

// ─── HTTP + Socket.io setup ───────────────────────────────────────────────────

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        // In production, replace '*' with your actual frontend domain
        origin: process.env.FRONTEND_ORIGIN || '*',
        methods: ['GET', 'POST'],
    },
});

const roomManager = new RoomManager(io);

// ─── Socket.io event handlers ─────────────────────────────────────────────────

io.on('connection', (socket) => {
    console.log(`[+] Connected: ${socket.id}`);

    // Player submits their name and wants to join a game
    socket.on('join_lobby', ({ name }) => {
        const safeName = String(name || 'Anónimo').trim().slice(0, 20);
        console.log(`[>] join_lobby: ${socket.id} as "${safeName}"`);
        roomManager.addPlayer(socket, safeName);
    });

    // Player's local position update — relayed to their room partner
    socket.on('player_move', (state) => {
        const room = roomManager.getRoom(socket.id);
        if (room) room.handlePlayerMove(socket.id, state);
    });

    // Player ate a small pellet (value 1)
    socket.on('small_pellet_eaten', ({ row, col }) => {
        const room = roomManager.getRoom(socket.id);
        if (room) room.handleSmallPelletEaten(socket.id, row, col);
    });

    // Player ate a big pellet (portfolio section, values 3–9)
    socket.on('big_pellet_eaten', ({ sectionId, row, col }) => {
        const room = roomManager.getRoom(socket.id);
        if (room) room.handleBigPelletEaten(socket.id, sectionId, row, col);
    });

    // Player lost a life but is still in game — partner shows flicker animation
    socket.on('player_respawning', () => {
        const room = roomManager.getRoom(socket.id);
        if (room) room.handlePlayerRespawning(socket.id);
    });

    // Player lost all lives — sent right before the socket disconnects
    socket.on('player_game_over', () => {
        const room = roomManager.getRoom(socket.id);
        if (room) room.handlePlayerGameOver(socket.id);
    });

    socket.on('disconnect', () => {
        console.log(`[-] Disconnected: ${socket.id}`);
        roomManager.removePlayer(socket.id);
    });
});

// ─── Health check ─────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => res.json({ status: 'ok', rooms: roomManager.rooms.size }));

// ─── Start ────────────────────────────────────────────────────────────────────

httpServer.listen(PORT, () => {
    console.log(`\nPac-Folio server running on port ${PORT}`);
    console.log(`Health: http://localhost:${PORT}/health\n`);
});
