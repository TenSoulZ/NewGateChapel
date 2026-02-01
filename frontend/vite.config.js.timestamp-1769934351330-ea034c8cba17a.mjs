// vite.config.js
import { defineConfig } from "file:///D:/My%20Web%20Projects/new-gate-chapel/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///D:/My%20Web%20Projects/new-gate-chapel/frontend/node_modules/@vitejs/plugin-react/dist/index.js";
import { visualizer } from "file:///D:/My%20Web%20Projects/new-gate-chapel/frontend/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import viteCompression from "file:///D:/My%20Web%20Projects/new-gate-chapel/frontend/node_modules/vite-plugin-compression/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    // Gzip compression for production
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 10240,
      // Only compress files > 10KB
      deleteOriginFile: false
    }),
    // Brotli compression (better than gzip)
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 10240,
      deleteOriginFile: false
    }),
    // Bundle analyzer - generates stats.html
    visualizer({
      filename: "./dist/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        silenceDeprecations: ["import", "legacy-js-api", "color-functions", "global-builtin"]
      }
    }
  },
  build: {
    // Target modern browsers for smaller bundle
    target: "es2015",
    // Output directory
    outDir: "dist",
    // Generate sourcemaps for production debugging
    sourcemap: false,
    // Set to true if needed for production debugging
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 1e3,
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // React core
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // UI frameworks
          "ui-vendor": ["react-bootstrap", "bootstrap"],
          // Icons - separate chunk since they're large
          "icons": ["react-icons"],
          // Animation libraries
          "animation": ["framer-motion"],
          // Charts (heavy library, only used in admin)
          "charts": ["recharts"],
          // API & utilities
          "utils": ["axios"]
        },
        // Naming pattern for chunks
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split("/").slice(-1)[0] : "chunk";
          return `assets/js/[name]-[hash].js`;
        },
        // Asset file naming
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split(".").pop();
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        entryFileNames: "assets/js/[name]-[hash].js"
      }
    },
    // Minification options
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info"]
        // Remove specific console methods
      },
      format: {
        comments: false
        // Remove comments
      }
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "axios",
      "framer-motion",
      "react-bootstrap",
      "bootstrap"
    ]
  },
  // Server configuration
  server: {
    port: 5173,
    strictPort: false,
    open: false
  },
  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: false
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxNeSBXZWIgUHJvamVjdHNcXFxcbmV3LWdhdGUtY2hhcGVsXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxNeSBXZWIgUHJvamVjdHNcXFxcbmV3LWdhdGUtY2hhcGVsXFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9NeSUyMFdlYiUyMFByb2plY3RzL25ldy1nYXRlLWNoYXBlbC9mcm9udGVuZC92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJ1xuaW1wb3J0IHZpdGVDb21wcmVzc2lvbiBmcm9tICd2aXRlLXBsdWdpbi1jb21wcmVzc2lvbidcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIC8vIEd6aXAgY29tcHJlc3Npb24gZm9yIHByb2R1Y3Rpb25cbiAgICB2aXRlQ29tcHJlc3Npb24oe1xuICAgICAgYWxnb3JpdGhtOiAnZ3ppcCcsXG4gICAgICBleHQ6ICcuZ3onLFxuICAgICAgdGhyZXNob2xkOiAxMDI0MCwgLy8gT25seSBjb21wcmVzcyBmaWxlcyA+IDEwS0JcbiAgICAgIGRlbGV0ZU9yaWdpbkZpbGU6IGZhbHNlLFxuICAgIH0pLFxuICAgIC8vIEJyb3RsaSBjb21wcmVzc2lvbiAoYmV0dGVyIHRoYW4gZ3ppcClcbiAgICB2aXRlQ29tcHJlc3Npb24oe1xuICAgICAgYWxnb3JpdGhtOiAnYnJvdGxpQ29tcHJlc3MnLFxuICAgICAgZXh0OiAnLmJyJyxcbiAgICAgIHRocmVzaG9sZDogMTAyNDAsXG4gICAgICBkZWxldGVPcmlnaW5GaWxlOiBmYWxzZSxcbiAgICB9KSxcbiAgICAvLyBCdW5kbGUgYW5hbHl6ZXIgLSBnZW5lcmF0ZXMgc3RhdHMuaHRtbFxuICAgIHZpc3VhbGl6ZXIoe1xuICAgICAgZmlsZW5hbWU6ICcuL2Rpc3Qvc3RhdHMuaHRtbCcsXG4gICAgICBvcGVuOiBmYWxzZSxcbiAgICAgIGd6aXBTaXplOiB0cnVlLFxuICAgICAgYnJvdGxpU2l6ZTogdHJ1ZSxcbiAgICB9KSxcbiAgXSxcblxuICBjc3M6IHtcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICBzY3NzOiB7XG4gICAgICAgIGFwaTogJ21vZGVybi1jb21waWxlcicsXG4gICAgICAgIHNpbGVuY2VEZXByZWNhdGlvbnM6IFsnaW1wb3J0JywgJ2xlZ2FjeS1qcy1hcGknLCAnY29sb3ItZnVuY3Rpb25zJywgJ2dsb2JhbC1idWlsdGluJ10sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG5cbiAgYnVpbGQ6IHtcbiAgICAvLyBUYXJnZXQgbW9kZXJuIGJyb3dzZXJzIGZvciBzbWFsbGVyIGJ1bmRsZVxuICAgIHRhcmdldDogJ2VzMjAxNScsXG5cbiAgICAvLyBPdXRwdXQgZGlyZWN0b3J5XG4gICAgb3V0RGlyOiAnZGlzdCcsXG5cbiAgICAvLyBHZW5lcmF0ZSBzb3VyY2VtYXBzIGZvciBwcm9kdWN0aW9uIGRlYnVnZ2luZ1xuICAgIHNvdXJjZW1hcDogZmFsc2UsIC8vIFNldCB0byB0cnVlIGlmIG5lZWRlZCBmb3IgcHJvZHVjdGlvbiBkZWJ1Z2dpbmdcblxuICAgIC8vIFJlZHVjZSBjaHVuayBzaXplIHdhcm5pbmdzIHRocmVzaG9sZFxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMCxcblxuICAgIC8vIE9wdGltaXplIGRlcGVuZGVuY2llc1xuICAgIGNvbW1vbmpzT3B0aW9uczoge1xuICAgICAgaW5jbHVkZTogWy9ub2RlX21vZHVsZXMvXSxcbiAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlLFxuICAgIH0sXG5cbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLy8gTWFudWFsIGNodW5rIHNwbGl0dGluZyBmb3IgYmV0dGVyIGNhY2hpbmdcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgLy8gUmVhY3QgY29yZVxuICAgICAgICAgICdyZWFjdC12ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXG5cbiAgICAgICAgICAvLyBVSSBmcmFtZXdvcmtzXG4gICAgICAgICAgJ3VpLXZlbmRvcic6IFsncmVhY3QtYm9vdHN0cmFwJywgJ2Jvb3RzdHJhcCddLFxuXG4gICAgICAgICAgLy8gSWNvbnMgLSBzZXBhcmF0ZSBjaHVuayBzaW5jZSB0aGV5J3JlIGxhcmdlXG4gICAgICAgICAgJ2ljb25zJzogWydyZWFjdC1pY29ucyddLFxuXG4gICAgICAgICAgLy8gQW5pbWF0aW9uIGxpYnJhcmllc1xuICAgICAgICAgICdhbmltYXRpb24nOiBbJ2ZyYW1lci1tb3Rpb24nXSxcblxuICAgICAgICAgIC8vIENoYXJ0cyAoaGVhdnkgbGlicmFyeSwgb25seSB1c2VkIGluIGFkbWluKVxuICAgICAgICAgICdjaGFydHMnOiBbJ3JlY2hhcnRzJ10sXG5cbiAgICAgICAgICAvLyBBUEkgJiB1dGlsaXRpZXNcbiAgICAgICAgICAndXRpbHMnOiBbJ2F4aW9zJ10sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gTmFtaW5nIHBhdHRlcm4gZm9yIGNodW5rc1xuICAgICAgICBjaHVua0ZpbGVOYW1lczogKGNodW5rSW5mbykgPT4ge1xuICAgICAgICAgIGNvbnN0IGZhY2FkZU1vZHVsZUlkID0gY2h1bmtJbmZvLmZhY2FkZU1vZHVsZUlkID8gY2h1bmtJbmZvLmZhY2FkZU1vZHVsZUlkLnNwbGl0KCcvJykuc2xpY2UoLTEpWzBdIDogJ2NodW5rJztcbiAgICAgICAgICByZXR1cm4gYGFzc2V0cy9qcy9bbmFtZV0tW2hhc2hdLmpzYDtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBBc3NldCBmaWxlIG5hbWluZ1xuICAgICAgICBhc3NldEZpbGVOYW1lczogKGFzc2V0SW5mbykgPT4ge1xuICAgICAgICAgIGxldCBleHRUeXBlID0gYXNzZXRJbmZvLm5hbWUuc3BsaXQoJy4nKS5wb3AoKTtcbiAgICAgICAgICBpZiAoL3BuZ3xqcGU/Z3xzdmd8Z2lmfHRpZmZ8Ym1wfGljby9pLnRlc3QoZXh0VHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBgYXNzZXRzL2ltYWdlcy9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdYDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKC93b2ZmfHdvZmYyfGVvdHx0dGZ8b3RmL2kudGVzdChleHRUeXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGBhc3NldHMvZm9udHMvW25hbWVdLVtoYXNoXVtleHRuYW1lXWA7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBgYXNzZXRzL1tuYW1lXS1baGFzaF1bZXh0bmFtZV1gO1xuICAgICAgICB9LFxuXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnYXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgLy8gTWluaWZpY2F0aW9uIG9wdGlvbnNcbiAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSwgLy8gUmVtb3ZlIGNvbnNvbGUubG9ncyBpbiBwcm9kdWN0aW9uXG4gICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXG4gICAgICAgIHB1cmVfZnVuY3M6IFsnY29uc29sZS5sb2cnLCAnY29uc29sZS5pbmZvJ10sIC8vIFJlbW92ZSBzcGVjaWZpYyBjb25zb2xlIG1ldGhvZHNcbiAgICAgIH0sXG4gICAgICBmb3JtYXQ6IHtcbiAgICAgICAgY29tbWVudHM6IGZhbHNlLCAvLyBSZW1vdmUgY29tbWVudHNcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcblxuICAvLyBPcHRpbWl6ZSBkZXBlbmRlbmNpZXNcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogW1xuICAgICAgJ3JlYWN0JyxcbiAgICAgICdyZWFjdC1kb20nLFxuICAgICAgJ3JlYWN0LXJvdXRlci1kb20nLFxuICAgICAgJ2F4aW9zJyxcbiAgICAgICdmcmFtZXItbW90aW9uJyxcbiAgICAgICdyZWFjdC1ib290c3RyYXAnLFxuICAgICAgJ2Jvb3RzdHJhcCcsXG4gICAgXSxcbiAgfSxcblxuICAvLyBTZXJ2ZXIgY29uZmlndXJhdGlvblxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA1MTczLFxuICAgIHN0cmljdFBvcnQ6IGZhbHNlLFxuICAgIG9wZW46IGZhbHNlLFxuICB9LFxuXG4gIC8vIFByZXZpZXcgc2VydmVyIGNvbmZpZ3VyYXRpb25cbiAgcHJldmlldzoge1xuICAgIHBvcnQ6IDQxNzMsXG4gICAgc3RyaWN0UG9ydDogZmFsc2UsXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErVCxTQUFTLG9CQUFvQjtBQUM1VixPQUFPLFdBQVc7QUFDbEIsU0FBUyxrQkFBa0I7QUFDM0IsT0FBTyxxQkFBcUI7QUFHNUIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBO0FBQUEsSUFFTixnQkFBZ0I7QUFBQSxNQUNkLFdBQVc7QUFBQSxNQUNYLEtBQUs7QUFBQSxNQUNMLFdBQVc7QUFBQTtBQUFBLE1BQ1gsa0JBQWtCO0FBQUEsSUFDcEIsQ0FBQztBQUFBO0FBQUEsSUFFRCxnQkFBZ0I7QUFBQSxN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
