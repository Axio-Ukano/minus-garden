// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";
import { createRequire } from "node:module";
import react from "@vitejs/plugin-react";

// Mirror the app version define so components that read __APP_VERSION__
// (e.g. the Settings credits) render under test without a ReferenceError.
const pkg = createRequire(import.meta.url)("./package.json") as { version: string };

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // Tier S baseline: cover the units this PR adds tests for. Future
      // sprints expand coverage to UI components/hooks and broaden this list.
      include: [
        "src/modules/timer/timerStore.ts",
        "src/modules/plants/plantService.ts",
        "src/modules/plants/usePlantGrowth.ts",
        "src/modules/history/historyStore.ts",
        "src/modules/audio/audioService.ts",
        "src/lib/tauri.ts",
        "src/lib/data/index.ts",
        "src/lib/kiosk.ts",
        "src/modules/timer/components/DurationSelector.tsx",
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
    },
  },
});
