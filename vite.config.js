import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
      proxy: {
          "/api": {
              // 8080为后端端口号，如果后端端口号为80，可省略
              target: "http://localhost:8080/api",
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ""),
          },
      },
      port: 8888
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'components': '/src/components',
      'views': '/src/views',
      'request': '/src/request',
      'store': '/src/store',
      'router': '/src/router',
      'assets': '/src/assets',
    }
  },
  plugins: [
      vue(),
  ],
})
