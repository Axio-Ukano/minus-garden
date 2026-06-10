// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import { createRequire } from "node:module";
import react from "@vitejs/plugin-react";

const host = process.env.TAURI_DEV_HOST;

// Single source of truth for the app version: package.json (bumped by
// release-please). Exposed to the app as the global __APP_VERSION__.
const pkg = createRequire(import.meta.url)("./package.json") as { version: string };

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],

  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
