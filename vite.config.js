import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // 🛠️ Import Node's path utility

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 🛠️ Maps @ to your src directory
    },
  },
});