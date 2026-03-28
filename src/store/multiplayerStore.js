// Reactive state for the multiplayer session.
// Kept separate from gameStore so the game loop never has to care about networking.

import { reactive } from 'vue';

export const multiplayerStore = reactive({
    // 'solo' | 'multiplayer'
    mode: 'solo',

    // Entered on the intro screen; used as display name in-game
    playerName: '',

    // Assigned by the server when a room is created
    playerId: null,
    playerColor: '#facc15', // default yellow (overwritten on game_start)

    // Set when matched with a partner
    roomId: null,
    partnerInfo: null, // { id, name, color }

    // 'idle' | 'connecting' | 'waiting' | 'ready'
    lobbyStatus: 'idle',

    // True when the partner has disconnected mid-game
    partnerDisconnected: false,

    reset() {
        this.mode = 'solo';
        this.playerId = null;
        this.playerColor = '#facc15';
        this.roomId = null;
        this.partnerInfo = null;
        this.lobbyStatus = 'idle';
        this.partnerDisconnected = false;
    },
});
