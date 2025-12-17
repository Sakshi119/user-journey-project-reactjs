import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    react(),
    
    // Bundle analyzer - see what's taking space
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    
    // Image optimization
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 80,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
    }),
  ],
  
  // Build optimizations
  build: {
    // Manual chunking for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'icons-vendor': ['lucide-react'],
          
          // Route-based chunks
          'auth-pages': [
            './src/components/auth/MobileInput.jsx',
            './src/components/auth/OTPInput.jsx',
          ],
          'forms': [
            './src/components/registration/PersonalDetailsForm.jsx',
            './src/components/registration/NomineeDetailsForm.jsx',
            './src/components/registration/BankDetailsForm.jsx',
          ],
        },
      },
    },
    
    // Compression and minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    
    // Source maps only for debugging
    sourcemap: false,
    
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
  },
  
  // Development optimizations
  server: {
    port: 5173,
  },
});