import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  mode,
  build: {
    minify: mode === 'production' ? 'esbuild' : false, // Minify only in production
  },
}));
