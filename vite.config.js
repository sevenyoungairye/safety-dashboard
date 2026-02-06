import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' },
    }
  },
  base: './',

  // (可选) 如果你想让打包后的文件都在 assets 文件夹下更整洁
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
