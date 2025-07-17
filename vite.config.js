import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "./dist",
    rollupOptions: {
      input: {
        content: "./src/main.js",
      },
      output: {
        entryFileNames: "main.js",
      },
    },
  },
});
