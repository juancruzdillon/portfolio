<template>
  <div id="game-container">
    <canvas id="gameCanvas" ref="gameCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { initGameEngine, setPlayerDirection } from '../game/engine'
import { gameStore } from '../store/gameStore'

const gameCanvas = ref(null)

// Swipe Logic variables
let touchStartX = 0
let touchStartY = 0

const handleKeydown = (e) => {
    switch(e.key) {
        case 'ArrowUp': case 'w': setPlayerDirection(0, -1); break;
        case 'ArrowDown': case 's': setPlayerDirection(0, 1); break;
        case 'ArrowLeft': case 'a': setPlayerDirection(-1, 0); break;
        case 'ArrowRight': case 'd': setPlayerDirection(1, 0); break;
    }
}

const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}

const handleTouchMove = (e) => {
    // Only block scroll while actively playing — allow scroll on intro, modals, win screen, etc.
    const activeStatuses = ['playing', 'respawning']
    if (activeStatuses.includes(gameStore.status)) {
        e.preventDefault()
    }
}

const handleTouchEnd = (e) => {
    let touchEndX = e.changedTouches[0].screenX;
    let touchEndY = e.changedTouches[0].screenY;
    
    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal
        if (Math.abs(dx) > 30) {
            if (dx > 0) { setPlayerDirection(1, 0); } // Right
            else { setPlayerDirection(-1, 0); } // Left
        }
    } else {
        // Vertical
        if (Math.abs(dy) > 30) {
            if (dy > 0) { setPlayerDirection(0, 1); } // Down
            else { setPlayerDirection(0, -1); } // Up
        }
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
    document.addEventListener('touchstart', handleTouchStart, {passive: false})
    document.addEventListener('touchmove', handleTouchMove, {passive: false})
    document.addEventListener('touchend', handleTouchEnd)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('touchstart', handleTouchStart)
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
})

</script>
