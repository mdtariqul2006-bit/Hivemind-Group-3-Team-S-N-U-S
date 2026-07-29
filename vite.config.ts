import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5182, strictPort: true },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      'react': path.resolve(import.meta.dirname, './node_modules/react'),
      'react-dom': path.resolve(import.meta.dirname, './node_modules/react-dom'),
    },
  },
  build: {
    // Keep the animation libraries in their own chunk so the landing screen's
    // first paint is not blocked by GSAP/Framer Motion parsing.
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['framer-motion'],
          scroll: ['gsap', 'lenis'],
        },
      },
    },
  },
});
