import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // define: {
  //   global: {},
  // },
  plugins: [react()],
  resolve: {
    alias: {
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },  
  server: {
    host: '0.0.0.0',
    // historyApiFallback: true, Чтобы Vite не давал 404 на маршруты
  },
})
