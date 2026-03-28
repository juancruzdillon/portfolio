<template>
  <div id="introScreen" class="absolute inset-0 z-50 overflow-y-auto bg-[#09090b] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#09090b] to-[#09090b]">
    <div class="flex flex-col items-center justify-center min-h-full py-8 px-5">
      <div class="text-center w-full max-w-2xl space-y-4 md:space-y-6">

        <h1 class="font-arcade text-4xl sm:text-6xl md:text-8xl text-yellow-400 neon-text-yellow leading-tight">
          JUAN CRUZ<br class="sm:hidden" /> DILLON
        </h1>
        <p class="text-sm sm:text-lg md:text-xl text-blue-300 font-light tracking-wide">
          Explorá lo que hice en mi carrera profesional, de forma divertida
        </p>

        <div class="glass-panel p-4 md:p-6 rounded-2xl text-left space-y-3">
          <p class="text-sm md:text-base"><i class="fas fa-circle text-yellow-400 text-xs mr-2"></i> Usa las <strong class="text-yellow-400">flechas</strong> o <strong class="text-yellow-400">desliza</strong> para moverte.</p>
          <p class="text-sm md:text-base"><i class="fas fa-cookie-bite text-blue-400 mr-2"></i> Come galletas grandes para desbloquear mi <strong class="text-blue-400">experiencia y habilidades</strong>.</p>
          <p class="text-sm md:text-base"><i class="fas fa-info-circle text-green-400 mr-2"></i> Cada 5 galletas pequeñas, vas a encontrar un <strong class="text-green-400">dato curioso</strong> sobre mí.</p>
          <p class="text-sm md:text-base"><i class="fas fa-bug text-red-400 mr-2"></i> Evita a los <strong class="text-red-400">Bugs</strong> (Errores, Deadlines, Estrés).</p>
          <p class="text-sm md:text-base"><i class="fas fa-trophy text-yellow-500 mr-2"></i> ¡Reúne las <strong class="text-yellow-500">7 secciones de mi CV</strong> para ganar!</p>
        </div>

        <!-- Name input -->
        <div class="relative">
          <input
            v-model="playerName"
            type="text"
            maxlength="20"
            placeholder="Tu nombre..."
            @keydown.enter="startSolo"
            class="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-center text-base md:text-lg focus:outline-none focus:border-yellow-400/60 focus:bg-white/15 transition-all"
          />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-xs">{{ playerName.length }}/20</span>
        </div>

        <!-- Action buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="startSolo"
            :disabled="!playerName.trim()"
            class="flex-1 px-6 py-3 flex justify-center items-center bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold rounded-full text-base md:text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(250,204,21,0.5)]"
          >
            <i class="fas fa-play mr-2"></i> Solo
          </button>
          <button
            @click="startOnline"
            :disabled="!playerName.trim()"
            class="flex-1 px-6 py-3 flex justify-center items-center bg-blue-500 hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-full text-base md:text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(96,165,250,0.4)]"
          >
            <i class="fas fa-users mr-2"></i> Online (2 jugadores)
          </button>
        </div>

        <p class="text-xs text-white/30 pb-2">
          Modo Online: se emparejan 2 jugadores al azar. Las secciones se comparten, los puntos son individuales.
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const playerName = ref('')
const emit = defineEmits(['start-solo', 'start-online'])

const startSolo = () => {
  if (!playerName.value.trim()) return
  emit('start-solo', playerName.value.trim())
}

const startOnline = () => {
  if (!playerName.value.trim()) return
  emit('start-online', playerName.value.trim())
}
</script>
