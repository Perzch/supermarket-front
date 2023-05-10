import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
      proxy: {
          "/api": {
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
  css: {
      preprocessorOptions: {
          scss: {
              additionalData: `@use "./src/assets/style/element-plus.scss" as *;`,
          },
      },
  },
  plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver({
            // 自动引入修改主题色添加这一行，使用预处理样式，不添加将会导致使用ElMessage，ElNotification等组件时默认的主题色会覆盖自定义的主题色
            importStyle: 'sass'
        })],
      }),
      Components({
        resolvers: [ElementPlusResolver({
            // 自动引入修改主题色添加这一行，使用预处理样式
            importStyle: 'sass'
        })],
      })
  ],
})
