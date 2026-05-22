import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    hmr: {
      host: '127.0.0.1',
      port: 5173,
      overlay: true
    },
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    }
  },
  preview: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    esbuild: {
      drop: ['console', 'debugger']
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true,
    target: 'es2020',
    cssCodeSplit: true
  }
});
