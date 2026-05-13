/**
 * Plants router - SENA GA7 Evidence (AA2-EV01, AA2-EV02, AA5-EV03)
 *
 * Conjunto de rutas Express que ofrecen un CRUD completo sobre la tabla
 * `plants`. Cada handler es el equivalente funcional a un método `doGet` o
 * `doPost` de un Servlet Java: recibe la petición HTTP, valida la entrada,
 * ejecuta una sentencia SQL preparada (equivalente a `PreparedStatement` con
 * JDBC) y devuelve una respuesta JSON con el status code adecuado.
 *
 * @module routes/plants
 */

const express = require("express");
const { db } = require("../database/connection");

const router = express.Router();

/**
 * GET /api/plants — lista todas las plantas (SELECT).
 *
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 * @returns {void} JSON con array de plantas.
 */
router.get("/", (_req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM plants ORDER BY id DESC").all();
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/plants/:id — obtiene una planta por id (SELECT … WHERE id = ?).
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {void} JSON con la planta o 404 si no existe.
 */
router.get("/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "id inválido" });
  }
  const plant = db.prepare("SELECT * FROM plants WHERE id = ?").get(id);
  if (!plant) {
    return res.status(404).json({ success: false, message: "Planta no encontrada" });
  }
  return res.status(200).json({ success: true, data: plant });
});

/**
 * POST /api/plants — crea una planta (INSERT).
 * Equivalente a un Servlet con método doPost que procesa un formulario.
 *
 * @param {import('express').Request} req body: { name, species?, watering_frequency?, last_watered?, notes? }
 * @param {import('express').Response} res
 * @returns {void} 201 con la planta creada, 400 si faltan datos.
 */
router.post("/", (req, res) => {
  const { name, species, watering_frequency, last_watered, notes } = req.body || {};

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ success: false, message: "El campo 'name' es requerido" });
  }
  if (
    watering_frequency !== undefined &&
    (typeof watering_frequency !== "number" || watering_frequency <= 0)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "watering_frequency debe ser número > 0" });
  }

  const stmt = db.prepare(
    `INSERT INTO plants (name, species, watering_frequency, last_watered, notes, updated_at)
     VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
  );
  const info = stmt.run(
    name.trim(),
    species ?? null,
    watering_frequency ?? null,
    last_watered ?? null,
    notes ?? null
  );
  const created = db.prepare("SELECT * FROM plants WHERE id = ?").get(info.lastInsertRowid);
  return res.status(201).json({ success: true, data: created });
});

/**
 * PUT /api/plants/:id — actualiza una planta (UPDATE).
 *
 * @param {import('express').Request} req params.id, body con campos a actualizar
 * @param {import('express').Response} res
 * @returns {void} 200 con la planta actualizada, 404 si no existe.
 */
router.put("/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "id inválido" });
  }

  const existing = db.prepare("SELECT * FROM plants WHERE id = ?").get(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: "Planta no encontrada" });
  }

  const { name, species, watering_frequency, last_watered, notes } = req.body || {};

  if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
    return res.status(400).json({ success: false, message: "name no puede estar vacío" });
  }
  if (
    watering_frequency !== undefined &&
    watering_frequency !== null &&
    (typeof watering_frequency !== "number" || watering_frequency <= 0)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "watering_frequency debe ser número > 0" });
  }

  db.prepare(
    `UPDATE plants
     SET name = COALESCE(?, name),
         species = COALESCE(?, species),
         watering_frequency = COALESCE(?, watering_frequency),
         last_watered = COALESCE(?, last_watered),
         notes = COALESCE(?, notes),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).run(
    name?.trim() ?? null,
    species ?? null,
    watering_frequency ?? null,
    last_watered ?? null,
    notes ?? null,
    id
  );

  const updated = db.prepare("SELECT * FROM plants WHERE id = ?").get(id);
  return res.status(200).json({ success: true, data: updated });
});

/**
 * DELETE /api/plants/:id — elimina una planta (DELETE).
 *
 * @param {import('express').Request} req params.id
 * @param {import('express').Response} res
 * @returns {void} 200 si se elimina, 404 si no existe.
 */
router.delete("/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "id inválido" });
  }
  const info = db.prepare("DELETE FROM plants WHERE id = ?").run(id);
  if (info.changes === 0) {
    return res.status(404).json({ success: false, message: "Planta no encontrada" });
  }
  return res.status(200).json({ success: true, message: "Planta eliminada" });
});

module.exports = router;
