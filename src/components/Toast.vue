<template>
  <transition name="slide-fade">
    <div v-if="gameStore.activeToastText" id="toast" class="fixed top-6 right-6 z-[60] max-w-sm pointer-events-none">
      <div class="glass-panel px-5 py-4 rounded-xl border-2 border-yellow-400/60 shadow-[0_0_15px_rgba(250,204,21,0.3)] bg-gray-900/95 flex items-start space-x-4 relative overflow-hidden">
        
        <!-- Icon -->
        <div class="mt-0.5">
          <i class="fas fa-lightbulb text-yellow-400 text-xl drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]"></i>
        </div>
        
        <!-- Text -->
        <div class="flex-1">
          <h4 class="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">Dato Curioso</h4>
          <span id="toastText" class="text-sm text-gray-100 font-medium leading-snug drop-shadow-md block">
            {{ gameStore.activeToastText }}
          </span>
        </div>

        <!-- Progress Bar Element -->
        <div class="absolute bottom-0 left-0 h-1 bg-yellow-400/80 animate-shrink-bar" style="width: 100%;"></div>

      </div>
    </div>
  </transition>
</template>

<script setup>
import { gameStore } from '../store/gameStore'
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100px) scale(0.9);
  opacity: 0;
}

@keyframes shrink {
  from { width: 100%; }
  to { width: 0%; }
}
.animate-shrink-bar {
  animation: shrink 3.5s linear forwards;
}
</style>
