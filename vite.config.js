import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [vue()],

      
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },

    build: {
      outDir: 'dist',
      assetsDir: '.',
      rollupOptions: {
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]'
        }
      }
    }
  }
})