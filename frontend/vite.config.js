import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Gzip compression for production
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // Only compress files > 10KB
      deleteOriginFile: false,
    }),
    // Brotli compression (better than gzip)
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false,
    }),
    // Bundle analyzer - generates stats.html
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['import', 'legacy-js-api', 'color-functions', 'global-builtin'],
      },
    },
  },

  build: {
    // Target modern browsers for smaller bundle
    target: 'es2015',

    // Output directory
    outDir: 'dist',

    // Generate sourcemaps for production debugging
    sourcemap: false, // Set to true if needed for production debugging

    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 1000,

    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },

    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // UI frameworks
          'ui-vendor': ['react-bootstrap', 'bootstrap'],

          // Icons - separate chunk since they're large
          'icons': ['react-icons'],

          // Animation libraries
          'animation': ['framer-motion'],

          // Charts (heavy library, only used in admin)
          'charts': ['recharts'],

          // API & utilities
          'utils': ['axios'],
        },

        // Naming pattern for chunks
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').slice(-1)[0] : 'chunk';
          return `assets/js/[name]-[hash].js`;
        },

        // Asset file naming
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').pop();
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },

        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },

    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'], // Remove specific console methods
      },
      format: {
        comments: false, // Remove comments
      },
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'framer-motion',
      'react-bootstrap',
      'bootstrap',
    ],
  },

  // Server configuration
  server: {
    port: 5173,
    strictPort: false,
    open: false,
  },

  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: false,
  },
})
