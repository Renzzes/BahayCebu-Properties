import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  
  // Get API URL from environment variables or use default
  const apiUrl = env.VITE_API_URL || (isProduction ? 'https://bahaycebu-properties.com' : 'http://localhost:4000');
  
  return {
    base: '/',
    publicDir: 'public',
    server: {
      host: "::",
      port: 8081,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: isProduction,
          rewrite: (path) => path,
          configure: (proxy, options) => {
            // Add error handling for proxy
            proxy.on('error', (err, req, res) => {
              console.error('Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // Log proxy requests in development
              if (!isProduction) {
                console.log('Proxying:', req.method, req.url, 'to', apiUrl);
              }
            });
          }
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProduction,
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
      // Add minification options
      minify: isProduction ? 'esbuild' : false,
      target: 'esnext',
    },
    plugins: [
      react()
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Add environment variable handling
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.VITE_API_URL': JSON.stringify(apiUrl),
    },
  }
});
