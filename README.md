# Pac-Folio 🎮 (Vue 3 + Vite)

Una versión interactiva y gamificada de mi portfolio profesional, migrada desde Vanilla JS + HTML en un solo archivo hacia un proyecto moderno, escalable y modular con **Vue 3** y **Vite**.

## Características de la Arquitectura

1. **Separación de Responsabilidades (`src/game/engine.js`)**: 
   Toda la lógica dura del juego, como el loop rendering a 60 FPS en el canvas (`requestAnimationFrame`), las colisiones y la IA básica de los fantasmas (Bugs), ha sido extraída a un módulo en JavaScript puro. Esto evita cargar el sistema de reactividad de Vue con miles de actualizaciones por segundo que causarían problemas de rendimiento.

2. **Store Reactivo (`src/store/gameStore.js`)**:
   Se utiliza el sistema de reactividad nativo de Vue (`import { reactive } from 'vue'`) para crear un store ligero que comunica el state del juego (puntos, vidas, estado de victoria/derrota, modales activos) entre el Vanilla JS Engine y los diferentes componentes UI de Vue.

3. **Componentes Modulares (`src/components/`)**:
   Cada parte de la interfaz de usuario se separó en su propio Single File Component (SFC) de Vue. 
   - `GameCanvas.vue`: Se encarga de capturar los eventos de teclado y touch, pasándoselos al engine.
   - `InfoModal.vue`, `Toast.vue`, `WinScreen.vue`, etc.: Reactivos al estado del `gameStore`. Las transiciones de Vue (`<Transition>`) se encargan de animar la entrada y salida de estos componentes suavemente.

4. **Datos Centralizados (`src/data/portfolioData.js`)**:
   El contenido "duro" del portfolio (textos, colores, íconos) ahora vive aislado de la vista y de la lógica del juego.

5. **Tailwind CSS**:
   Los estilos globales y las utilidades personalizadas están configurados de forma estándar, proveyendo fácil edición temática a futuro.

## Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 16 o superior)

## Instalación y Uso

1. **Clonar este repositorio o navegar al directorio del proyecto.**
2. **Instalar dependencias:**
   ```bash
   npm install
   ```
3. **Levantar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
4. **Abrir en tu navegador:**
   La terminal te indicará la URL (generalmente `http://localhost:5173/`).

## Comandos Disponibles

- `npm run dev`: Inicia el servidor de desarrollo local de Vite garantizando tiempos de recarga "Hot Module Replacement" ultra-rápidos.
- `npm run build`: Compila el proyecto para producción y minifica los assets en la carpeta `dist/`.
- `npm run preview`: Sirve locamente la carpeta `dist/` para poder probar físicamente el bundle generado antes de hacer un eventual subida o deploy.

---
*Hecho por Juan Cruz Dillon - AI-Augmented Full-Stack Developer.*
