<template>
  <div id="hud-top" class="absolute top-0 left-0 w-full p-3 md:p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">

    <!-- Left: Local player score + lives -->
    <div class="flex flex-col gap-0.5">
      <!-- Player colour dot + name in multiplayer -->
      <div v-if="isMultiplayer" class="flex items-center gap-1.5 mb-1">
        <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ backgroundColor: multiplayerStore.playerColor }"></span>
        <span class="font-arcade text-xs text-white/70 truncate max-w-[100px]">{{ multiplayerStore.playerName }}</span>
      </div>

      <div class="flex flex-col sm:flex-row sm:space-x-6">
        <div class="font-arcade text-lg md:text-2xl text-white">
          SCORE <span class="text-yellow-400">{{ gameStore.score }}</span>
        </div>
        <div class="font-arcade text-lg md:text-2xl text-white/60">
          RECORD <span class="text-white">{{ gameStore.highScore }}</span>
        </div>
      </div>
    </div>

    <!-- Right: Lives + optional partner info -->
    <div class="flex flex-col items-end gap-1">
      <!-- Partner info (multiplayer only) -->
      <div v-if="isMultiplayer && multiplayerStore.partnerInfo" class="flex items-center gap-1.5">
        <span
          class="w-2.5 h-2.5 rounded-full flex-shrink-0"
          :style="{ backgroundColor: multiplayerStore.partnerInfo.color }"
          :class="multiplayerStore.partnerDisconnected ? 'opacity-30' : ''"
        ></span>
        <span
          class="font-arcade text-xs truncate max-w-[100px]"
          :class="multiplayerStore.partnerDisconnected ? 'text-white/30 line-through' : 'text-white/70'"
        >
          {{ multiplayerStore.partnerInfo.name }}
        </span>
        <span v-if="multiplayerStore.partnerDisconnected" class="text-red-400 text-xs">✕</span>
      </div>

      <!-- Lives -->
      <div class="flex items-center space-x-2">
        <span class="font-arcade text-xl mr-2 text-white">VIDAS</span>
        <div class="flex space-x-2 text-yellow-400 text-xl">
          <i v-for="life in gameStore.lives" :key="life" class="fas fa-circle text-yellow-400"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { gameStore } from '../store/gameStore'
import { multiplayerStore } from '../store/multiplayerStore'

const isMultiplayer = computed(() => multiplayerStore.mode === 'multiplayer')
</script>
