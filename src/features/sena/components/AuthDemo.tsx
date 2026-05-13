/**
 * AuthDemo component (AA5-EV01)
 *
 * Demuestra el flujo de **registro** y **login** contra el backend SENA.
 * Incluye validaciones en cliente (longitudes mínimas y formato de email)
 * además de las del servidor, para evidencia AA3-EV02.
 *
 * @module features/sena/components/AuthDemo
 */

import { useState } from "react";
import { loginUser, registerUser, type AuthResponse } from "../api/authApi";

type Tab = "register" | "login";

interface RegisterForm {
  username: string;
  password: string;
  email: string;
}

interface LoginForm {
  username: string;
  password: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Componente de doble formulario (register / login) con feedback contextual.
 */
export function AuthDemo() {
  const [tab, setTab] = useState<Tab>("register");
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    username: "",
    password: "",
    email: "",
  });
  const [loginForm, setLoginForm] = useState<LoginForm>({ username: "", password: "" });
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  /** Submit del formulario de registro con validación en cliente. */
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (registerForm.username.trim().length < 3) {
      setFeedback({ kind: "err", text: "El usuario debe tener al menos 3 caracteres." });
      return;
    }
    if (registerForm.password.length < 6) {
      setFeedback({ kind: "err", text: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }
    if (registerForm.email.trim() !== "" && !EMAIL_REGEX.test(registerForm.email.trim())) {
      setFeedback({ kind: "err", text: "El email no tiene un formato válido." });
      return;
    }

    try {
      const response: AuthResponse = await registerUser(
        registerForm.username.trim(),
        registerForm.password,
        registerForm.email.trim() || undefined
      );
      setFeedback({
        kind: response.success ? "ok" : "err",
        text: response.message,
      });
      if (response.success) {
        setRegisterForm({ username: "", password: "", email: "" });
      }
    } catch (error) {
      setFeedback({
        kind: "err",
        text: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  /** Submit del formulario de login con validación en cliente. */
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (loginForm.username.trim().length < 3) {
      setFeedback({ kind: "err", text: "El usuario debe tener al menos 3 caracteres." });
      return;
    }
    if (loginForm.password.length < 6) {
      setFeedback({ kind: "err", text: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }

    try {
      const response = await loginUser(loginForm.username.trim(), loginForm.password);
      setFeedback({
        kind: response.success ? "ok" : "err",
        text: response.success
          ? `${response.message} — bienvenido, ${response.user?.username ?? ""}`
          : response.message,
      });
    } catch (error) {
      setFeedback({
        kind: "err",
        text: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  return (
    <section style={{ padding: 16, color: "var(--color-text, #222)" }}>
      <h2 style={{ marginTop: 0 }}>Autenticación (Registro y Login)</h2>
      <p style={{ marginTop: 0, fontSize: 14 }}>
        Componente que consume <code>/api/auth/register</code> y <code>/api/auth/login</code> del
        backend SENA. Demuestra validaciones en cliente y manejo de errores.
      </p>

      <div role="tablist" style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "register"}
          onClick={() => {
            setTab("register");
            setFeedback(null);
          }}
        >
          Registro
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "login"}
          onClick={() => {
            setTab("login");
            setFeedback(null);
          }}
        >
          Login
        </button>
      </div>

      {tab === "register" && (
        <form
          onSubmit={(event) => {
            void handleRegister(event);
          }}
          style={{ display: "grid", gap: 8, maxWidth: 360 }}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span>Usuario</span>
            <input
              type="text"
              value={registerForm.username}
              onChange={(event) =>
                setRegisterForm({ ...registerForm, username: event.target.value })
              }
              minLength={3}
              required
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span>Contraseña</span>
            <input
              type="password"
              value={registerForm.password}
              onChange={(event) =>
                setRegisterForm({ ...registerForm, password: event.target.value })
              }
              minLength={6}
              required
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span>Email (opcional)</span>
            <input
              type="email"
              value={registerForm.email}
              onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
            />
          </label>
          <button type="submit">Registrar</button>
        </form>
      )}

      {tab === "login" && (
        <form
          onSubmit={(event) => {
            void handleLogin(event);
          }}
          style={{ display: "grid", gap: 8, maxWidth: 360 }}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span>Usuario</span>
            <input
              type="text"
              value={loginForm.username}
              onChange={(event) => setLoginForm({ ...loginForm, username: event.target.value })}
              minLength={3}
              required
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span>Contraseña</span>
            <input
              type="password"
              value={loginForm.password}
              onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
              minLength={6}
              required
            />
          </label>
          <button type="submit">Entrar</button>
        </form>
      )}

      {feedback && (
        <p
          role="status"
          style={{
            marginTop: 12,
            padding: "8px 12px",
            background: feedback.kind === "ok" ? "#dcfce7" : "#fee2e2",
            color: feedback.kind === "ok" ? "#166534" : "#991b1b",
            borderRadius: 4,
            maxWidth: 360,
          }}
        >
          {feedback.text}
        </p>
      )}
    </section>
  );
}
