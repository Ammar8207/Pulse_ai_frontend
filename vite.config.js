import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Raise the warning threshold — we've already split via lazy loading
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Manually split vendor chunks so browsers can cache them separately
        manualChunks: {
          // React core — almost never changes
          'vendor-react': ['react', 'react-dom'],
          // Router — changes rarely
          'vendor-router': ['react-router-dom'],
          // Charts — large, isolate for caching
          'vendor-recharts': ['recharts'],
          // Icons — tree-shaken but still sizeable
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
  // Pre-bundle common deps in dev for instant HMR
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'recharts', 'lucide-react'],
  },
});
