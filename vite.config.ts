import path from "path"
import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"

import tailwind from "tailwindcss"
import autoprefixer from "autoprefixer"

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  server: {
    proxy: {
      // This will proxy requests from /api to your HTTPS endpoint
      '/api': {
        target: 'https://twoapi-ui.qiangtu.com', // Replace with your HTTPS endpoint
        changeOrigin: true,
        secure: false, // Set to true if your target endpoint has a valid SSL certificate
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: rewrite the path if needed
      },
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

