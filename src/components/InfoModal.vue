<template>
  <div id="infoModal" class="absolute inset-0 flex items-center justify-center bg-black/80 z-50 p-4 transition-opacity duration-300">
    <div id="modalContent" class="glass-panel w-full max-w-2xl rounded-2xl p-6 md:p-8 transform scale-100 transition-transform duration-300 border-t-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)]" :style="`border-top-color: ${gameStore.activeModalData?.color}`">
      <div class="flex items-center space-x-4 mb-6 border-b border-white/10 pb-4">
        <div id="modalIcon" class="text-4xl drop-shadow-[0_0_8px_currentColor]" :style="{ color: gameStore.activeModalData?.color }" v-html="gameStore.activeModalData?.icon"></div>
        <h2 id="modalTitle" class="text-3xl font-bold drop-shadow-md" :style="{ color: gameStore.activeModalData?.color }">
          {{ gameStore.activeModalData?.title }}
        </h2>
      </div>
      <div id="modalBody" class="text-gray-200 text-lg leading-relaxed h-72 md:h-80 overflow-y-auto pr-4 pb-6 custom-scrollbar mb-6" v-html="gameStore.activeModalData?.content">
      </div>
      <div class="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 pt-3 border-t border-white/5">
        <button id="resumeBtn" @click="resume" :class="isWinReady ? 'bg-yellow-500 hover:bg-yellow-600 outline-yellow-400' : 'bg-blue-600 hover:bg-blue-500 outline-blue-400'" class="px-5 py-3 w-full sm:w-auto text-sm md:text-base md:px-6 md:py-2.5 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
          <template v-if="isWinReady">
            Reclamar Premio <i class="fas fa-trophy"></i>
          </template>
          <template v-else>
            Continuar <i class="fas fa-arrow-right"></i>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { gameStore } from '../store/gameStore'

const isWinReady = computed(() => gameStore.unlockedSections.length >= 7)
const canClose = ref(false)
let timer = null

const resume = () => {
    if (canClose.value) {
        gameStore.resumeGame()
    }
}

const handleKeydown = (e) => {
    if (!canClose.value) return; // Prevent instant close from held keys
    
    const isMovementKey = ['ArrowUp', 'w', 'ArrowDown', 's', 'ArrowLeft', 'a', 'ArrowRight', 'd'].includes(e.key);
    if (isMovementKey && !isWinReady.value) {
        resume()
    }
}

onMounted(() => {
    // 600ms buffer prevents accidental closure from held-down movement keys
    timer = setTimeout(() => {
        canClose.value = true
    }, 600)
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    if (timer) clearTimeout(timer)
    window.removeEventListener('keydown', handleKeydown)
})

</script>
