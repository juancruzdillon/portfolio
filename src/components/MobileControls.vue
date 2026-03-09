<template>
  <div v-if="gameStore.status === 'playing'" class="mobile-controls-wrapper fixed bottom-0 left-0 w-full p-4 flex justify-center items-end pointer-events-none z-40 pb-6">
    <!-- D-Pad Container -->
    <div class="glass-panel p-2 rounded-full grid grid-cols-3 gap-2 w-48 h-48 pointer-events-auto bg-black/60 shadow-[0_0_20px_rgba(250,204,21,0.2)] border border-yellow-400/20 backdrop-blur-md">
      
      <!-- Top Row -->
      <div></div>
      <button @touchstart.prevent="move(0, -1)" class="control-btn bg-gray-800/80 hover:bg-yellow-500/80 active:bg-yellow-400 rounded-t-2xl shadow-[inset_0_-4px_0_rgba(0,0,0,0.5)] transition-all flex items-center justify-center text-yellow-500 active:text-black">
        <i class="fas fa-caret-up text-3xl"></i>
      </button>
      <div></div>
      
      <!-- Middle Row -->
      <button @touchstart.prevent="move(-1, 0)" class="control-btn bg-gray-800/80 hover:bg-yellow-500/80 active:bg-yellow-400 rounded-l-2xl shadow-[inset_-4px_0_0_rgba(0,0,0,0.5)] transition-all flex items-center justify-center text-yellow-500 active:text-black">
        <i class="fas fa-caret-left text-3xl"></i>
      </button>
      <div class="flex items-center justify-center">
        <div class="w-6 h-6 rounded-full bg-gray-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-yellow-500/30"></div>
      </div>
      <button @touchstart.prevent="move(1, 0)" class="control-btn bg-gray-800/80 hover:bg-yellow-500/80 active:bg-yellow-400 rounded-r-2xl shadow-[inset_4px_0_0_rgba(0,0,0,0.5)] transition-all flex items-center justify-center text-yellow-500 active:text-black">
        <i class="fas fa-caret-right text-3xl"></i>
      </button>
      
      <!-- Bottom Row -->
      <div></div>
      <button @touchstart.prevent="move(0, 1)" class="control-btn bg-gray-800/80 hover:bg-yellow-500/80 active:bg-yellow-400 rounded-b-2xl shadow-[inset_0_4px_0_rgba(0,0,0,0.5)] transition-all flex items-center justify-center text-yellow-500 active:text-black">
        <i class="fas fa-caret-down text-3xl"></i>
      </button>
      <div></div>

    </div>
  </div>
</template>

<script setup>
import { gameStore } from '../store/gameStore'
import { setPlayerDirection } from '../game/engine'

const move = (dx, dy) => {
    setPlayerDirection(dx, dy)
}
</script>

<style scoped>
@media (min-width: 768px) {
    .mobile-controls-wrapper {
        display: none !important;
    }
}

.control-btn {
    width: 100%;
    height: 100%;
    touch-action: none; /* Prevent browser scrolling when tapping */
}
.control-btn:active {
    transform: scale(0.92);
    box-shadow: none !important;
}
</style>
