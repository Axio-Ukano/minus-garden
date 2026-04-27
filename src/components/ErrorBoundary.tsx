import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { useSettingsStore } from "@/modules/settings/settingsStore";
import { en } from "@/i18n/en";
import { es } from "@/i18n/es";
import type { Translations } from "@/i18n";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

function getErrorTable(): Translations["error"] {
  const language = useSettingsStore.getState().language;
  const t = (language === "es" ? es : en) as Translations;
  return t.error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      const t = getErrorTable();
      return (
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 32,
            fontFamily: "var(--font-pixel)",
            backgroundColor: "var(--color-bg)",
            color: "var(--color-text)",
          }}
        >
          <span style={{ fontSize: "var(--text-pixel-lg)" }}>{t.title}</span>
          <span
            style={{
              fontSize: "var(--text-pixel-xs)",
              color: "var(--color-text-muted)",
              textAlign: "center",
            }}
          >
            {this.state.message}
          </span>
          <button
            className="pixel-btn"
            onClick={() => this.setState({ hasError: false, message: "" })}
          >
            {t.retry}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
