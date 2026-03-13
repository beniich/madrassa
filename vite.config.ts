import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 3006,
    proxy: {
      // Forward /api calls to the backend during development
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // NEVER split react/react-dom/react-router — causes white pages
          if (id.includes('node_modules/recharts') || id.includes('node_modules/chart.js') || id.includes('node_modules/react-chartjs-2')) {
            return 'vendor-charts';
          }
          if (id.includes('node_modules/@stripe')) {
            return 'vendor-stripe';
          }
          if (id.includes('node_modules/firebase')) {
            return 'vendor-firebase';
          }
          if (id.includes('node_modules/ag-grid')) {
            return 'vendor-aggrid';
          }
          if (id.includes('node_modules/lottie') || id.includes('node_modules/lottie-react')) {
            return 'vendor-lottie';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
}));
