// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { initKiosk } from "./lib/kiosk";
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/cursors.css";
import "./App.css";

// Apply saved theme before first paint to prevent flash of wrong theme
try {
  const saved = localStorage.getItem("minus-garden-settings");
  if (saved) {
    const parsed = JSON.parse(saved) as { state?: { theme?: string } };
    const theme = parsed?.state?.theme;
    if (theme === "dark" || theme === "light") {
      document.documentElement.setAttribute("data-theme", theme);
      document.body.setAttribute("data-theme", theme);
    }
  }
} catch {
  // ignore parse errors
}

// Make the webview behave like a game, not a browser: no context menu,
// devtools shortcuts or image dragging. Installed once for the app's lifetime.
initKiosk();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
