import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
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
          <span style={{ fontSize: "var(--text-pixel-lg)" }}>ERROR</span>
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
            REINTENTAR
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
