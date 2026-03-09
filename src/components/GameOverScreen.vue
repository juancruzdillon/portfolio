<template>
  <div id="gameOverScreen" class="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-50 p-6 text-center transition-opacity duration-500">
    <h1 class="font-arcade text-6xl text-red-500 mb-4">GAME OVER</h1>
    <p class="text-xl text-gray-300 mb-2">Los bugs te atraparon...</p>
    <div class="mb-8 font-arcade p-4 bg-white/5 rounded-xl border border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
      <div class="text-xl text-white/70 mb-1">SCORE: <span class="text-yellow-400">{{ gameStore.score }}</span></div>
      <div class="text-lg text-white/50">RECORD: <span class="text-white">{{ gameStore.highScore }}</span></div>
    </div>
    <button @click="$emit('restart')" class="px-6 py-3 w-full sm:w-auto max-w-xs bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors">
      <i class="fas fa-redo mr-2"></i> Intentarlo de nuevo
    </button>
  </div>
</template>

<script setup>
import { gameStore } from '../store/gameStore'

defineEmits(['restart'])
</script>
