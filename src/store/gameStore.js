import { reactive } from 'vue';

export const gameStore = reactive({
  status: 'start', // 'start', 'playing', 'paused', 'gameover', 'win', 'respawning'
  score: 0,
  highScore: parseInt(localStorage.getItem('portfolioPacmanHighScore') || '0', 10),
  lives: 3,
  level: 1,
  totalSmallPellets: 0,
  smallPelletsEaten: 0,
  sectionsEatenThisLevel: 0,
  unlockedSections: [],
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
    this.activeModalData = data;
    this.status = 'paused';
  },

  resumeGame() {
    this.activeModalData = null;
    this.status = 'playing';
    this.checkWinCondition();
  },

  checkWinCondition() {
    if (this.sectionsEatenThisLevel >= 7 && this.status !== 'paused') {
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
