import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

function copyLegacyPwaFiles() {
  const files = [
    "service-worker.js",
    "firebase-messaging-sw.js",
    "manifest.json",
    "legacy-pocket-cat.html",
    "style.css",
    "script.js"
  ];

  return {
    name: "copy-legacy-pwa-files",
    closeBundle() {
      const distDir = resolve("docs");
      if (!existsSync(distDir)) {
        mkdirSync(distDir, { recursive: true });
      }

      files.forEach((file) => {
        if (existsSync(file)) {
          copyFileSync(resolve(file), resolve(distDir, file));
        }
      });

      if (existsSync("icons")) {
        cpSync(resolve("icons"), resolve(distDir, "icons"), { recursive: true });
      }
    }
  };
}

export default defineConfig({
  base: "/mvp-pocket-cat-life-web-android/",
  plugins: [react(), copyLegacyPwaFiles()],
  build: {
    outDir: "docs",
    rollupOptions: {
      input: {
        app: "index.html"
      }
    }
  }
});
