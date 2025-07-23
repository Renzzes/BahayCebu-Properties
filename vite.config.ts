import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { componentTagger } from "lovable-tagger"; // Removed

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  publicDir: 'public', // Explicitly set public directory
  server: {
    host: "::",
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    copyPublicDir: true, // Ensure public directory is copied
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name) {
            const info = path.parse(assetInfo.name);
            let dir = path.dirname(assetInfo.name);
            if (dir === '.') {
              return 'assets/[name]-[hash][extname]';
            }
            // Remove leading slash and replace backslashes with forward slashes
            dir = dir.replace(/^[/\\]/, '').replace(/\\/g, '/');
            return `${dir}/[name]-[hash][extname]`;
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  plugins: [
    react()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
