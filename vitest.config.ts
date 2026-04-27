import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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
