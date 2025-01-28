import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   historyApiFallback: true, Чтобы Vite не давал 404 на маршруты
  // },
})
