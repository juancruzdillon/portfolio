// RoomManager — matchmaking queue and room lifecycle.
//
// Design:
//   • Players queue up one at a time.
//   • When 2 players are queued, a GameRoom is created and both are notified.
//   • Rooms are destroyed on disconnect; the remaining player is notified.
//   • Colors are room-scoped: player 1 always gets COLORS[0], player 2 gets COLORS[1].
//     Different rooms can (and will) reuse the same colors independently.

import { GameRoom } from './GameRoom.js';
import { generateGameMap } from './mapSetup.js';

// Two visually distinct colors for the two players in a room.
// These intentionally differ from ghost colors (#ef4444, #f472b6, #06b6d4, #f97316).
const PLAYER_COLORS = ['#facc15', '#60a5fa']; // yellow, blue

let roomCounter = 0;
function newRoomId() { return `room_${++roomCounter}_${Date.now()}`; }

export class RoomManager {
    constructor(io) {
        this.io = io;

        /** @type {Array<{id:string, socket:object, name:string, color:string}>} */
        this.queue = [];

        /** @type {Map<string, GameRoom>} roomId → GameRoom */
        this.rooms = new Map();

        /** @type {Map<string, string>} socketId → roomId */
        this.playerRooms = new Map();
    }

    // ─── Public API (called from index.js) ───────────────────────────────────

    /** Called when a socket connects and sends join_lobby. */
    addPlayer(socket, name) {
        // Assign color based on position in the upcoming pair (first gets [0], second gets [1])
        const color = PLAYER_COLORS[this.queue.length % PLAYER_COLORS.length];
        const player = { id: socket.id, socket, name, color };

        // Acknowledge assignment so the client can show the correct color immediately
        socket.emit('assigned', { playerId: socket.id, color, name });

        if (this.queue.length >= 1) {
            // A partner is already waiting — start a game
            const partner = this.queue.shift();
            this._createRoom(partner, player);
        } else {
            // No partner yet — wait in queue
            this.queue.push(player);
            socket.emit('waiting', {});
        }
    }

    /** Called on socket disconnect. Cleans up queue entry or destroys the room. */
    removePlayer(socketId) {
        // Case 1: Player was still in the queue (never matched)
        const queueIndex = this.queue.findIndex(p => p.id === socketId);
        if (queueIndex !== -1) {
            this.queue.splice(queueIndex, 1);
            return;
        }

        // Case 2: Player was in an active room
        const roomId = this.playerRooms.get(socketId);
        if (!roomId) return;

        const room = this.rooms.get(roomId);
        if (room) {
            room.handleDisconnect(socketId);
            this.rooms.delete(roomId);
            room.players.forEach(p => this.playerRooms.delete(p.id));
        }
    }

    /** Route an event from a player to their current room. */
    getRoom(socketId) {
        const roomId = this.playerRooms.get(socketId);
        return roomId ? this.rooms.get(roomId) : null;
    }

    // ─── Private ──────────────────────────────────────────────────────────────

    _createRoom(player1, player2) {
        const roomId = newRoomId();
        const mapData = generateGameMap();

        const room = new GameRoom(roomId, player1, player2, mapData);
        this.rooms.set(roomId, room);
        this.playerRooms.set(player1.id, roomId);
        this.playerRooms.set(player2.id, roomId);

        const playersInfo = [
            { id: player1.id, name: player1.name, color: player1.color },
            { id: player2.id, name: player2.name, color: player2.color },
        ];

        const basePayload = {
            roomId,
            players: playersInfo,
            map: mapData.map,
            playerStart: mapData.playerStart,
            ghostStarts: mapData.ghostStarts,
            pelletsPerFact: mapData.pelletsPerFact,
        };

        player1.socket.emit('game_start', { ...basePayload, yourPlayerId: player1.id });
        player2.socket.emit('game_start', { ...basePayload, yourPlayerId: player2.id });
    }
}
