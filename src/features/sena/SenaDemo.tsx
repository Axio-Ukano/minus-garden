/**
 * SenaDemo page (AA3-EV01, AA4-EV03)
 *
 * Página contenedora de la demostración SENA GA7. Agrupa los componentes
 * `PlantManager` y `AuthDemo` y los presenta como secciones independientes
 * con un header explicativo.
 *
 * Se monta como un tab adicional en `App.tsx` (nav "SENA Demo") para que
 * el instructor pueda revisar la evidencia sin necesidad de añadir un
 * router externo.
 *
 * @module features/sena/SenaDemo
 */

import { useState } from "react";
import { AuthDemo } from "./components/AuthDemo";
import { PlantManager } from "./components/PlantManager";

type Section = "plants" | "auth";

/** Página principal del módulo de evidencias SENA. */
function SenaDemo() {
  const [section, setSection] = useState<Section>("plants");

  return (
    <div
      style={{
        padding: "24px 32px",
        maxWidth: 1200,
        margin: "0 auto",
        color: "var(--color-text, #222)",
      }}
    >
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Módulo de Demostración SENA GA7</h1>
        <p style={{ marginTop: 8, fontSize: 14, color: "var(--color-text-muted, #666)" }}>
          Evidencias <strong>GA7-220501096</strong>. Este módulo consume el backend Node/Express en{" "}
          <code>http://localhost:3001</code> y demuestra componentes React, eventos, estado, ciclo
          de vida, consumo de API REST y validaciones.
        </p>
        <p style={{ fontSize: 13, color: "var(--color-text-muted, #888)" }}>
          Asegúrate de tener corriendo el backend: <code>cd sena-backend &amp;&amp; npm start</code>
          .
        </p>
      </header>

      <nav style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          type="button"
          aria-pressed={section === "plants"}
          onClick={() => setSection("plants")}
        >
          Gestor de plantas
        </button>
        <button type="button" aria-pressed={section === "auth"} onClick={() => setSection("auth")}>
          Autenticación
        </button>
      </nav>

      {section === "plants" && <PlantManager />}
      {section === "auth" && <AuthDemo />}
    </div>
  );
}

export default SenaDemo;
