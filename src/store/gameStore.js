import { reactive } from 'vue';

export const gameStore = reactive({
    status: 'start', // 'start' | 'playing' | 'paused' | 'gameover' | 'win' | 'respawning'
    score: 0,
    highScore: parseInt(localStorage.getItem('portfolioPacmanHighScore') || '0', 10),
    lives: 3,
    level: 1,
    totalSmallPellets: 0,
    smallPelletsEaten: 0,
    sectionsEatenThisLevel: 0,
    unlockedSections: [],

    // Modal queue — supports multiple simultaneous section unlocks (e.g. in multiplayer
    // when the partner eats a section while the local player already has a modal open).
    _modalQueue: [],
    activeModalData: null,

    activeToastText: null,

    reset() {
        this.status = 'playing';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.smallPelletsEaten = 0;
        this.sectionsEatenThisLevel = 0;
        this.unlockedSections = [];
        this._modalQueue = [];
        this.activeModalData = null;
        this.activeToastText = null;
    },

    nextLevel() {
        this.level++;
        this.status = 'playing';
        this.smallPelletsEaten = 0;
        this.sectionsEatenThisLevel = 0;
    },

    loseLife(resetCallback) {
        if (this.status !== 'playing') return;
        this.updateHighScore();
        this.lives--;
        if (this.lives <= 0) {
            this.status = 'gameover';
        } else {
            this.status = 'respawning';
            setTimeout(() => {
                if (this.status === 'respawning') {
                    if (resetCallback) resetCallback();
                    this.status = 'playing';
                }
            }, 1000);
        }
    },

    addScore(points) {
        this.score += points;
    },

    updateHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('portfolioPacmanHighScore', this.highScore.toString());
        }
    },

    unlockSection(id, data) {
        if (!this.unlockedSections.includes(id)) {
            this.unlockedSections.push(id);
        }
        if (this.activeModalData) {
            // A modal is already open — queue this one so it isn't lost
            this._modalQueue.push(data);
        } else {
            this.activeModalData = data;
            this.status = 'paused';
        }
    },

    resumeGame() {
        if (this._modalQueue.length > 0) {
            // Show next queued modal instead of resuming immediately
            this.activeModalData = this._modalQueue.shift();
            // status stays 'paused'
        } else {
            this.activeModalData = null;
            this.status = 'playing';
            this.checkWinCondition();
        }
    },

    checkWinCondition() {
        // Use unlockedSections.length so cooperative multiplayer counts both players' sections.
        // Guard against triggering while a modal is still open.
        if (this.unlockedSections.length >= 7 && this.status !== 'paused') {
            this.updateHighScore();
            this.status = 'win';
        }
    },

    setToast(text) {
        this.activeToastText = text;
    },

    clearToast() {
        this.activeToastText = null;
    }
});
