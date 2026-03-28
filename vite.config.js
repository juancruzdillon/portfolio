import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            // In development, proxy Socket.io requests to the local server.
            // In production, set VITE_SOCKET_URL to the deployed server URL instead.
            '/socket.io': {
                target: 'http://localhost:3001',
                ws: true,
                changeOrigin: true,
            },
        },
    },
})
