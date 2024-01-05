import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import { returnProxy, parseEnv } from './build/proxy'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root, '')
  const { proxyConfig } = parseEnv(env)

  return {
    plugins: [vue(), vueJsx()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";@import "@/styles/mixin.scss";`
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#': fileURLToPath(new URL('./types', import.meta.url))
      }
    },
    base: '/acc',
    server: {
      proxy: returnProxy(proxyConfig)
    }
  }
})
