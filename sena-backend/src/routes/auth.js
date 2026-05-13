/**
 * Auth router - SENA GA7 Evidence (AA2-EV02, AA5-EV01)
 *
 * Rutas de autenticación equivalentes a Servlets Java con métodos
 * `doPost` (register/login) y `doGet` (status). El hashing se hace con el
 * módulo `crypto` nativo (SHA-256) para no añadir dependencias externas.
 *
 * Mapeo conceptual:
 *  - POST /api/auth/register  ≡  RegisterServlet#doPost
 *  - POST /api/auth/login     ≡  LoginServlet#doPost
 *  - GET  /api/auth/status    ≡  StatusServlet#doGet
 *
 * @module routes/auth
 */

const express = require("express");
const crypto = require("node:crypto");
const { db } = require("../database/connection");

const router = express.Router();

/**
 * Calcula el hash SHA-256 de una contraseña.
 *
 * @param {string} password contraseña en texto plano.
 * @returns {string} hash hexadecimal SHA-256.
 */
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

/**
 * Valida que un email tenga formato razonable.
 *
 * @param {string} value email candidato.
 * @returns {boolean} true si es válido.
 */
function isValidEmail(value) {
  if (typeof value !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * POST /api/auth/register — registra un nuevo usuario.
 * Servlet equivalente: RegisterServlet#doPost
 *
 * @param {import('express').Request} req body: { username, password, email }
 * @param {import('express').Response} res
 * @returns {void}
 */
router.post("/register", (req, res) => {
  const { username, password, email } = req.body || {};

  if (!username || typeof username !== "string" || username.trim().length < 3) {
    return res
      .status(400)
      .json({ success: false, message: "username requerido (mínimo 3 caracteres)" });
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return res
      .status(400)
      .json({ success: false, message: "password requerido (mínimo 6 caracteres)" });
  }
  if (email !== undefined && email !== null && email !== "" && !isValidEmail(email)) {
    return res.status(400).json({ success: false, message: "email con formato inválido" });
  }

  const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(username.trim());
  if (existing) {
    return res.status(409).json({ success: false, message: "El usuario ya existe" });
  }

  db.prepare("INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)").run(
    username.trim(),
    hashPassword(password),
    email ?? null
  );

  return res.status(201).json({ success: true, message: "Usuario registrado exitosamente" });
});

/**
 * POST /api/auth/login — autentica un usuario.
 * Servlet equivalente: LoginServlet#doPost
 *
 * @param {import('express').Request} req body: { username, password }
 * @param {import('express').Response} res
 * @returns {void}
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "username y password requeridos" });
  }

  const user = db
    .prepare("SELECT id, username, password_hash FROM users WHERE username = ?")
    .get(username);

  if (!user || user.password_hash !== hashPassword(password)) {
    return res.status(401).json({ success: false, message: "Error en la autenticación" });
  }

  return res.status(200).json({
    success: true,
    message: "Autenticación satisfactoria",
    user: { id: user.id, username: user.username },
  });
});

/**
 * GET /api/auth/status — verifica que la API de auth está activa.
 * Servlet equivalente: StatusServlet#doGet
 *
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 * @returns {void}
 */
router.get("/status", (_req, res) => {
  res.status(200).json({ status: "API de autenticación activa" });
});

module.exports = router;
