import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_BACKEND_URL

  return {
    plugins: [vue()],
    define: {
      __VUE_PROD_DEVTOOLS__: true
    },
    server: {
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true
        },
        '/media': {
          target: backendUrl,
          changeOrigin: true
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
