<template>
  <main class="relative select-none text-gray-100 min-h-screen">

    <!-- Intro screen -->
    <Transition name="fade">
      <IntroScreen
        v-if="gameStore.status === 'start'"
        @start-solo="handleStartSolo"
        @start-online="handleStartOnline"
      />
    </Transition>

    <!-- Multiplayer lobby: waiting for a partner -->
    <Transition name="fade">
      <LobbyScreen
        v-if="multiplayerStore.lobbyStatus === 'waiting' || multiplayerStore.lobbyStatus === 'connecting'"
        @cancel="handleCancelLobby"
      />
    </Transition>

    <!-- HUD (score, lives, partner info) -->
    <Transition name="fade">
      <HUD v-if="gameStore.status !== 'start' && gameStore.status !== 'win'" />
    </Transition>

    <!-- Game canvas — always in DOM so initGameEngine can find it by id -->
    <GameCanvas :style="{ filter: gameStore.status === 'win' ? 'blur(10px)' : 'none' }" />

    <MobileControls />

    <!-- Toast notifications (fun facts, partner disconnect, etc.) -->
    <Toast />

    <!-- Portfolio section modal -->
    <Transition name="fade">
      <InfoModal v-if="gameStore.status === 'paused' && gameStore.activeModalData" />
    </Transition>

    <!-- Win screen -->
    <Transition name="fade-slow">
      <WinScreen v-if="gameStore.status === 'win'" @next-level="handleNextLevel" />
    </Transition>

    <!-- Game over screen -->
    <Transition name="fade-fast">
      <GameOverScreen v-if="gameStore.status === 'gameover'" @restart="restartGame" />
    </Transition>

  </main>
</template>

<script setup>
import { watch } from 'vue'
import { gameStore } from './store/gameStore'
import { multiplayerStore } from './store/multiplayerStore'
import { resetGameData, initGameEngine, startGameLoop, clearMultiplayerState } from './game/engine'
import { joinLobby, disconnect, stopPositionSync, emitPlayerRespawning, emitPlayerGameOver } from './services/socketService'

import IntroScreen from './components/IntroScreen.vue'
import LobbyScreen from './components/LobbyScreen.vue'
import HUD from './components/HUD.vue'
import GameCanvas from './components/GameCanvas.vue'
import MobileControls from './components/MobileControls.vue'
import Toast from './components/Toast.vue'
import InfoModal from './components/InfoModal.vue'
import WinScreen from './components/WinScreen.vue'
import GameOverScreen from './components/GameOverScreen.vue'

// Sync death events to the partner so their screen reflects what happened.
watch(() => gameStore.status, (newStatus) => {
    if (multiplayerStore.mode !== 'multiplayer') return

    if (newStatus === 'respawning') {
        // Lost a life but still in game — partner sees our pac-man flicker
        emitPlayerRespawning()
    } else if (newStatus === 'gameover') {
        // Lost all lives — notify partner with a proper message, then disconnect
        emitPlayerGameOver()
        stopPositionSync()
        disconnect()
    }
})

// ─── Solo flow ────────────────────────────────────────────────────────────────

const handleStartSolo = (name) => {
    multiplayerStore.reset()
    multiplayerStore.playerName = name

    gameStore.reset()
    const canvasEl = document.getElementById('gameCanvas')
    if (canvasEl) initGameEngine(canvasEl)
}

// ─── Multiplayer flow ─────────────────────────────────────────────────────────

const handleStartOnline = (name) => {
    multiplayerStore.reset()
    multiplayerStore.mode = 'multiplayer'
    multiplayerStore.playerName = name
    // socketService handles game_start: calls initGameEngine with server map and gameStore.reset()
    joinLobby(name)
}

const handleCancelLobby = () => {
    disconnect()
    multiplayerStore.reset()
    // Stay on intro screen (gameStore.status is still 'start')
}

// ─── Shared restart / next-level ─────────────────────────────────────────────

const restartGame = () => {
    if (multiplayerStore.mode === 'multiplayer') {
        // Return to intro so the player can re-queue
        stopPositionSync()
        disconnect() // Ensures clean server-side cleanup (idempotent if already disconnected)
        clearMultiplayerState()
        multiplayerStore.reset()
        gameStore.status = 'start'
    } else {
        gameStore.reset()
        resetGameData()
        startGameLoop()
    }
}

const handleNextLevel = () => {
    if (multiplayerStore.mode === 'multiplayer') {
        // Multiplayer doesn't support level progression — go back to intro
        stopPositionSync()
        clearMultiplayerState()
        multiplayerStore.reset()
        gameStore.status = 'start'
    } else {
        gameStore.nextLevel()
        resetGameData()
        startGameLoop()
    }
}
</script>

<style>
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
