<template>
  <main class="relative select-none text-gray-100 min-h-screen">
    <!-- Intro Screen -->
    <Transition name="fade">
      <IntroScreen v-if="gameStore.status === 'start'" @start="startGame" />
    </Transition>

    <!-- HUD -->
    <Transition name="fade">
      <HUD v-if="gameStore.status !== 'start' && gameStore.status !== 'win'" />
    </Transition>

    <!-- Game Canvas -->
    <GameCanvas :style="{ filter: gameStore.status === 'win' ? 'blur(10px)' : 'none' }" />

    <MobileControls />

    <!-- Popups, Toasts & Modals -->
    <Toast />
    
    <Transition name="fade">
      <InfoModal v-if="gameStore.status === 'paused' && gameStore.activeModalData" />
    </Transition>

    <Transition name="fade-slow">
      <WinScreen v-if="gameStore.status === 'win'" @next-level="handleNextLevel" />
    </Transition>

    <!-- Game Over Screen -->
    <Transition name="fade-fast">
      <GameOverScreen v-if="gameStore.status === 'gameover'" @restart="restartGame" />
    </Transition>
  </main>
</template>

<script setup>
import { gameStore } from './store/gameStore'
import { resetGameData, initGameEngine, startGameLoop } from './game/engine'

import IntroScreen from './components/IntroScreen.vue'
import HUD from './components/HUD.vue'
import GameCanvas from './components/GameCanvas.vue'
import MobileControls from './components/MobileControls.vue'
import Toast from './components/Toast.vue'
import InfoModal from './components/InfoModal.vue'
import WinScreen from './components/WinScreen.vue'
import GameOverScreen from './components/GameOverScreen.vue'

const startGame = () => {
  gameStore.reset()
  const canvasEl = document.getElementById('gameCanvas')
  if (canvasEl) {
    initGameEngine(canvasEl)
  }
}

const restartGame = () => {
  gameStore.reset()
  resetGameData()
  gameStore.status = 'playing'
  startGameLoop()
}

const handleNextLevel = () => {
  gameStore.nextLevel()
  resetGameData()
  startGameLoop()
}
</script>

<style>
/* Vue Transitions for pure CSS animations between states */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slow-enter-active,
.fade-slow-leave-active {
  transition: opacity 1s ease;
}
.fade-slow-enter-from,
.fade-slow-leave-to {
  opacity: 0;
}

.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.5s ease;
}
.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
}
</style>
