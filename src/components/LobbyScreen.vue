<template>
  <div class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
    <div class="text-center space-y-6 max-w-sm px-6">

      <!-- Waiting spinner -->
      <div class="relative flex items-center justify-center mb-2">
        <div class="w-20 h-20 rounded-full border-4 border-yellow-400/20 border-t-yellow-400 animate-spin"></div>
        <span class="absolute text-3xl">👻</span>
      </div>

      <h2 class="font-arcade text-2xl text-yellow-400">BUSCANDO OPONENTE...</h2>

      <!-- Local player info -->
      <div class="glass-panel rounded-xl p-4 flex items-center gap-3">
        <div class="w-5 h-5 rounded-full flex-shrink-0" :style="{ backgroundColor: multiplayerStore.playerColor }"></div>
        <div class="text-left">
          <p class="text-xs text-white/50 uppercase tracking-wider">Tú</p>
          <p class="font-bold text-white">{{ multiplayerStore.playerName }}</p>
        </div>
        <div class="ml-auto">
          <span class="text-xs text-green-400 animate-pulse">● conectado</span>
        </div>
      </div>

      <!-- Partner slot (empty while waiting) -->
      <div class="glass-panel rounded-xl p-4 flex items-center gap-3 opacity-40">
        <div class="w-5 h-5 rounded-full flex-shrink-0 border-2 border-dashed border-white/40"></div>
        <div class="text-left">
          <p class="text-xs text-white/50 uppercase tracking-wider">Oponente</p>
          <p class="font-bold text-white/40">Esperando...</p>
        </div>
      </div>

      <p class="text-sm text-white/40">
        Comparte el link para que un amigo se una
      </p>

      <button
        @click="$emit('cancel')"
        class="px-6 py-2 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm transition-all"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup>
import { multiplayerStore } from '../store/multiplayerStore.js'
defineEmits(['cancel'])
</script>
