// GameRoom — authoritative state for one pair of players.

const RESPAWN_DELAY_MS = 3000;
const TOTAL_SECTIONS = 7;

export class GameRoom {
    constructor(id, player1, player2, mapData) {
        this.id = id;
        this.players = [player1, player2];
        this.mapData = mapData;

        this.eatenPellets = new Set();
        this.respawnTimers = new Map();
        this.sectionsEaten = new Set();
        this.pelletCounters = new Map([
            [player1.id, 0],
            [player2.id, 0],
        ]);
        this.pelletsPerFact = mapData.pelletsPerFact;

        // Players that sent player_game_over before disconnecting (so we can
        // send the partner a clearer message instead of "disconnected")
        this._gameOverPlayers = new Set();
    }

    // ─── Pellet events ────────────────────────────────────────────────────────

    handleSmallPelletEaten(socketId, row, col) {
        const key = `${row},${col}`;
        if (this.eatenPellets.has(key)) return;
        this.eatenPellets.add(key);

        this.broadcast('pellet_removed', { row, col });

        const newCount = (this.pelletCounters.get(socketId) || 0) + 1;
        this.pelletCounters.set(socketId, newCount);

        if (newCount % this.pelletsPerFact === 0) {
            const player = this.players.find(p => p.id === socketId);
            if (player) player.socket.emit('trigger_fun_fact');
        }

        if (this.respawnTimers.has(key)) clearTimeout(this.respawnTimers.get(key));

        const timer = setTimeout(() => {
            this.eatenPellets.delete(key);
            this.respawnTimers.delete(key);
            this.broadcast('pellet_respawned', { row, col });
        }, RESPAWN_DELAY_MS);

        this.respawnTimers.set(key, timer);
    }

    handleBigPelletEaten(socketId, sectionId, row, col) {
        if (this.sectionsEaten.has(sectionId)) return;
        this.sectionsEaten.add(sectionId);

        const eater = this.players.find(p => p.id === socketId);
        const eaterName = eater?.name || 'Jugador';

        this.broadcast('section_unlocked', { sectionId, eaterName, row, col });

        if (this.sectionsEaten.size >= TOTAL_SECTIONS) {
            this.broadcast('game_won', {});
        }
    }

    // ─── Death / respawn sync ─────────────────────────────────────────────────

    /** Called when a player loses a life but still has lives remaining. */
    handlePlayerRespawning(socketId) {
        const partner = this.players.find(p => p.id !== socketId);
        if (partner) {
            partner.socket.emit('partner_respawning', { playerId: socketId });
        }
    }

    /**
     * Called just before the player disconnects after losing all lives.
     * Stores the reason so handleDisconnect can send the right message.
     */
    handlePlayerGameOver(socketId) {
        const player = this.players.find(p => p.id === socketId);
        const partner = this.players.find(p => p.id !== socketId);
        this._gameOverPlayers.add(socketId);
        if (partner) {
            partner.socket.emit('partner_left', {
                reason: 'gameover',
                playerName: player?.name || 'Tu compañero',
            });
        }
    }

    // ─── Position relay ───────────────────────────────────────────────────────

    handlePlayerMove(senderId, state) {
        const partner = this.players.find(p => p.id !== senderId);
        if (partner) {
            partner.socket.emit('player_update', { playerId: senderId, ...state });
        }
    }

    // ─── Disconnect ───────────────────────────────────────────────────────────

    handleDisconnect(socketId) {
        // If the player already sent player_game_over, the partner was already notified.
        if (!this._gameOverPlayers.has(socketId)) {
            const remaining = this.players.find(p => p.id !== socketId);
            if (remaining) {
                remaining.socket.emit('partner_left', { reason: 'disconnected', playerName: '' });
            }
        }
        this.cleanup();
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    broadcast(event, data) {
        this.players.forEach(p => p.socket.emit(event, data));
    }

    cleanup() {
        this.respawnTimers.forEach(timer => clearTimeout(timer));
        this.respawnTimers.clear();
    }
}
