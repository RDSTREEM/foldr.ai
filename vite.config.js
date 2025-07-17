import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "./dist",
    rollupOptions: {
      input: {
        content: "./src/content.js",
      },
      output: {
        entryFileNames: "content.js",
      },
    },
  },
});
