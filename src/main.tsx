import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
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

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
