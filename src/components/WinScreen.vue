<template>
  <div id="winScreen" class="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-50 p-6 text-center transition-opacity duration-1000">
    <i class="fas fa-trophy text-6xl text-yellow-400 neon-text-yellow mb-6"></i>
    <h1 class="font-arcade text-5xl md:text-6xl text-white mb-4">¡HAS GANADO!</h1>
    <p class="text-xl text-gray-300 mb-4 max-w-lg">Has recopilado toda mi información profesional y has sobrevivido. ¡Demostraste tener grandes habilidades!</p>
    
    <div class="mb-8 font-arcade p-4 bg-white/5 rounded-xl border border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.5)] w-full max-w-sm">
      <div class="text-xl text-white/70 mb-1">SCORE: <span class="text-yellow-400">{{ gameStore.score }}</span></div>
      <div class="text-lg text-white/50">RECORD: <span class="text-white">{{ gameStore.highScore }}</span></div>
    </div>
    
    <div class="glass-panel p-8 rounded-2xl border-yellow-400/50 flex flex-col items-center space-y-6">
      <h3 class="text-2xl font-bold text-yellow-400">¡Aquí tienes tu Premio!</h3>
      <p class="text-sm text-gray-400">Acceso directo a mi currículum y contacto prioritario.</p>
      <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
        <a :href="cvPdf" download="CV-Dillon-Juan-Cruz.pdf" class="prize-btn px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto">
          <i class="fas fa-file-download"></i> Descargar CV
        </a>
        <a href="mailto:juancruzdillon1999@gmail.com" class="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors w-full sm:w-auto">
          <i class="fas fa-paper-plane"></i> Contratarme Ya
        </a>
      </div>
      
      <button @click="$emit('next-level')" class="mt-4 px-6 py-2 bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/50 font-arcade rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
        Siguiente Nivel <i class="fas fa-arrow-right ml-2"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import cvPdf from '../assets/CV-Dillon-Juan-Cruz.pdf'
import { gameStore } from '../store/gameStore'

const emit = defineEmits(['next-level'])
</script>
