/**
 * Server entry point - SENA GA7 Evidence (AA2-EV01, AA2-EV02)
 *
 * Servidor Express que expone:
 *   - GET  /                  → HTML de bienvenida (≈ JSP de bienvenida)
 *   - /api/plants/*           → CRUD de plantas (Servlets equivalentes)
 *   - /api/auth/*             → Registro/Login (Servlets equivalentes)
 *
 * El puerto por defecto es 3001 para no colisionar con el dev server de Vite.
 *
 * @module server
 */

const express = require("express");
const cors = require("cors");

const plantsRouter = require("./routes/plants");
const authRouter = require("./routes/auth");

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = express();

// Middlewares globales: CORS abierto para que el frontend Vite (puerto 1420 o 5173)
// pueda consumir la API durante las pruebas. JSON parser para todas las rutas POST/PUT.
app.use(cors());
app.use(express.json());

/**
 * GET / — Página de bienvenida HTML.
 * Análogo a un JSP que renderiza HTML estático con datos del servidor.
 */
app.get("/", (_req, res) => {
  res.status(200).type("html").send(`<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Minus Garden — SENA GA7 Backend</title>
    <style>
      body { font-family: system-ui, sans-serif; padding: 2rem; background: #faf6f0; color: #333; }
      h1 { color: #b554d4; }
      code { background: #eee; padding: 2px 6px; border-radius: 3px; }
      ul { line-height: 1.8; }
    </style>
  </head>
  <body>
    <h1>Minus Garden — Backend SENA GA7</h1>
    <p>API REST de evidencias para la Guía de Aprendizaje 7.</p>
    <h2>Endpoints disponibles</h2>
    <ul>
      <li><code>GET /api/plants</code> — listar plantas</li>
      <li><code>GET /api/plants/:id</code> — obtener planta</li>
      <li><code>POST /api/plants</code> — crear planta</li>
      <li><code>PUT /api/plants/:id</code> — actualizar planta</li>
      <li><code>DELETE /api/plants/:id</code> — eliminar planta</li>
      <li><code>POST /api/auth/register</code> — registro</li>
      <li><code>POST /api/auth/login</code> — login</li>
      <li><code>GET /api/auth/status</code> — estado de auth</li>
    </ul>
  </body>
</html>`);
});

// Registro de routers — cada uno equivale a un grupo de Servlets bajo un prefijo.
app.use("/api/plants", plantsRouter);
app.use("/api/auth", authRouter);

// Handler 404 para rutas no registradas.
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: `Ruta no encontrada: ${req.method} ${req.path}` });
});

// Solo arrancamos el listener si este archivo se ejecuta directamente (no en tests).
if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[sena-backend] escuchando en http://localhost:${PORT}`);
  });
}

module.exports = app;
