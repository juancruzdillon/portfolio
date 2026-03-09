<template>
  <div id="hud-top" class="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
    <div class="flex flex-col sm:flex-row sm:space-x-8">
      <div class="font-arcade text-lg md:text-2xl text-white">
        SCORE <span id="scoreDisplay" class="text-yellow-400">{{ gameStore.score }}</span>
      </div>
      <div class="font-arcade text-lg md:text-2xl text-white/60">
        RECORD <span class="text-white">{{ gameStore.highScore }}</span>
      </div>
    </div>
    <div class="flex items-center space-x-2">
      <span class="font-arcade text-xl mr-2 text-white">VIDAS</span>
      <div id="livesDisplay" class="flex space-x-2 text-yellow-400 text-xl">
        <i v-for="life in gameStore.lives" :key="life" class="fas fa-circle text-yellow-400"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gameStore } from '../store/gameStore'
</script>
