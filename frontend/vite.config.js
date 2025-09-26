import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react()],

    // Production optimizations
    build: {
      minify: isProduction ? 'esbuild' : false,
      sourcemap: !isProduction,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            utils: ['./src/utils.js']
          }
        }
      },
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000
    },

    // Development server configuration
    server: {
      port: 5173,
      host: true, // Needed for VPS deployment
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          // Keep /api prefix since development backend expects it
          rewrite: undefined
        }
      }
    },

    // Preview server configuration (for production preview)
    preview: {
      port: 4173,
      host: true
    },

    // Define environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    }
  }
})
