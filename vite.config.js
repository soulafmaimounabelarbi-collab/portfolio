import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Vite base must match how the app is served in production.
  // - If you deploy to the domain root: set BASE_URL=/ (or leave it unset)
  // - If you deploy under a sub-path: set BASE_URL to that sub-path (e.g. /my-repo/)
  const baseUrl = process.env.BASE_URL ?? '/';

  return {
    plugins: [react()],
    base: baseUrl,
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three'],
            framer: ['framer-motion'],
            react: ['react', 'react-dom'],
          },
        },
      },
    },
  };
})

