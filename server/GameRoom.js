// GameRoom — authoritative state for one pair of players.
//
// Responsibilities:
//   • Shared pellet state (which cells have been eaten)
//   • Small-pellet respawn timers (3 seconds)
//   • Per-player fun-fact counter (private toasts)
//   • Section-eaten tracking (cooperative win)
//   • Relaying position updates between the two players

const RESPAWN_DELAY_MS = 3000;
const TOTAL_SECTIONS = 7; // Sections 3–9

export class GameRoom {
    /**
     * @param {string}   id       Unique room identifier
     * @param {object}   player1  { id: socketId, socket, name, color }
     * @param {object}   player2  { id: socketId, socket, name, color }
     * @param {object}   mapData  Result of generateGameMap()
     */
    constructor(id, player1, player2, mapData) {
        this.id = id;
        this.players = [player1, player2];
        this.mapData = mapData;

        // "row,col" strings for pellets currently absent from the map
        this.eatenPellets = new Set();

        // Pending respawn timers keyed by "row,col"
        this.respawnTimers = new Map();

        // Sections already collected this level (section IDs 3–9)
        this.sectionsEaten = new Set();

        // How many small pellets each player has eaten (for fun-fact pacing)
        this.pelletCounters = new Map([
            [player1.id, 0],
            [player2.id, 0],
        ]);

        this.pelletsPerFact = mapData.pelletsPerFact;
    }

    // ─── Pellet events ────────────────────────────────────────────────────────

    handleSmallPelletEaten(socketId, row, col) {
        const key = `${row},${col}`;

        // Deduplicate: ignore if already eaten (race condition between clients)
        if (this.eatenPellets.has(key)) return;
        this.eatenPellets.add(key);

        // Tell both players to remove this pellet from their local maps
        this.broadcast('pellet_removed', { row, col });

        // Track per-player count and potentially trigger a private fun-fact
        const newCount = (this.pelletCounters.get(socketId) || 0) + 1;
        this.pelletCounters.set(socketId, newCount);

        if (newCount % this.pelletsPerFact === 0) {
            const player = this.players.find(p => p.id === socketId);
            if (player) player.socket.emit('trigger_fun_fact');
        }

        // Schedule the respawn — cancel any previous timer for this cell first
        if (this.respawnTimers.has(key)) clearTimeout(this.respawnTimers.get(key));

        const timer = setTimeout(() => {
            this.eatenPellets.delete(key);
            this.respawnTimers.delete(key);
            this.broadcast('pellet_respawned', { row, col });
        }, RESPAWN_DELAY_MS);

        this.respawnTimers.set(key, timer);
    }

    handleBigPelletEaten(socketId, sectionId, row, col) {
        // Deduplicate: a section can only be unlocked once per level
        if (this.sectionsEaten.has(sectionId)) return;
        this.sectionsEaten.add(sectionId);

        const eater = this.players.find(p => p.id === socketId);
        const eaterName = eater?.name || 'Jugador';

        // Notify all players so everyone shows the portfolio modal and removes the pellet
        this.broadcast('section_unlocked', { sectionId, eaterName, row, col });

        // Cooperative win: all 7 sections collected
        if (this.sectionsEaten.size >= TOTAL_SECTIONS) {
            this.broadcast('game_won', {});
        }
    }

    // ─── Position relay ───────────────────────────────────────────────────────

    handlePlayerMove(senderId, state) {
        // Forward the sender's position to the other player only
        const partner = this.players.find(p => p.id !== senderId);
        if (partner) {
            partner.socket.emit('player_update', { playerId: senderId, ...state });
        }
    }

    // ─── Disconnect ───────────────────────────────────────────────────────────

    handleDisconnect(socketId) {
        const remaining = this.players.find(p => p.id !== socketId);
        if (remaining) {
            remaining.socket.emit('partner_disconnected', {});
        }
        this.cleanup();
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    broadcast(event, data) {
        this.players.forEach(p => p.socket.emit(event, data));
    }

    /** Cancel all pending respawn timers when the room is destroyed. */
    cleanup() {
        this.respawnTimers.forEach(timer => clearTimeout(timer));
        this.respawnTimers.clear();
    }
}
