import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        mentions: resolve(__dirname, "mentions-legales.html"),
        politique: resolve(__dirname, "politique-confidentialite.html"),
      },
    },
  },
  plugins: [
    ViteImageOptimizer({
      jpg: { quality: 82 },
      jpeg: { quality: 82 },
      png: { quality: 82 },
      webp: { lossless: false, quality: 82 },
      includePublic: true,
    }),
  ],
});
