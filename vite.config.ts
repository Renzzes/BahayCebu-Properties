import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  
  return {
    base: '/',
    publicDir: 'public',
    server: {
      host: "::",
      port: 8081,
      proxy: {
        '/api': {
          target: isProduction ? env.VITE_API_URL : 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      copyPublicDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: [
              '@radix-ui/react-dialog',
              '@radix-ui/react-popover',
              '@radix-ui/react-slot',
              'class-variance-authority'
            ]
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name) {
              const info = path.parse(assetInfo.name);
              let dir = path.dirname(assetInfo.name);
              if (dir === '.') {
                return 'assets/[name]-[hash][extname]';
              }
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
  }
});
