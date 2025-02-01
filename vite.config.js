import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3003'  // Match your backend port (default: 3003)
    }
  },
  test: {
    environment: 'jsdom',         // Use jsdom for simulating the browser environment
    globals: true,                // Enable global variables like describe, test, and expect
    setupFiles: './testSetup.js', // Path to the setup file for cleanup
  }
});
