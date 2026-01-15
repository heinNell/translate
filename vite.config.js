import { defineConfig } from 'vite';

export default defineConfig({
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },

  // Development server
  server: {
    port: 3000,
    open: true,
    cors: true
  },

  // Preview server
  preview: {
    port: 4173
  },

  // Resolve aliases
  resolve: {
    alias: {
      '@': '/src',
      '@config': '/src/config',
      '@utils': '/src/utils',
      '@providers': '/src/providers',
      '@ui': '/src/ui',
      '@features': '/src/features',
      '@core': '/src/core'
    }
  },

  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify('2.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
});
