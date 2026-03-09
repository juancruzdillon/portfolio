<template>
  <div id="introScreen" class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#09090b] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#09090b] to-[#09090b]">
    <div class="text-center space-y-6 max-w-2xl px-6">
      <h1 class="font-arcade text-6xl md:text-8xl text-yellow-400 neon-text-yellow mb-2">PAC-FOLIO</h1>
      <p class="text-xl text-blue-300 font-light tracking-wide mb-8">El portfolio interactivo</p>
      
      <div class="glass-panel p-6 rounded-2xl text-left space-y-4 mb-8">
        <p><i class="fas fa-circle text-yellow-400 text-xs mr-2"></i> Usa las <strong class="text-yellow-400">flechas</strong> o <strong class="text-yellow-400">desliza</strong> para moverte.</p>
        <p><i class="fas fa-cookie-bite text-blue-400 mr-2"></i> Come galletas grandes para desbloquear mi <strong class="text-blue-400">experiencia y habilidades</strong>.</p>
        <p><i class="fas fa-info-circle text-green-400 mr-2"></i> Cada 5 galletas pequeñas, descubrirás un <strong class="text-green-400">dato curioso</strong> sobre mí.</p>
        <p><i class="fas fa-bug text-red-400 mr-2"></i> Evita a los <strong class="text-red-400">Bugs</strong> (Errores, Deadlines, Estrés).</p>
        <p><i class="fas fa-trophy text-yellow-500 mr-2"></i> ¡Reúne las <strong class="text-yellow-500">7 secciones de mi CV</strong> para ganar el Premio Final!</p>
      </div>

      <button id="startBtn" @click="$emit('start')" class="px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto flex justify-center items-center bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-full text-lg md:text-xl transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(250,204,21,0.5)] mx-auto">
        <i class="fas fa-play mr-3"></i> INICIAR JUEGO
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['start'])
</script>
