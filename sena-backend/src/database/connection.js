/**
 * Database connection module - SENA GA7 Evidence
 *
 * Este módulo es el equivalente funcional a una conexión JDBC en Java.
 * En el paradigma Java tradicional (AA2-EV01) se usaría:
 *
 *   DriverManager.getConnection("jdbc:sqlite:minus_garden.db");
 *
 * En Node.js usamos el módulo **`node:sqlite`** (built-in desde Node 22.5),
 * un driver síncrono que mantiene la misma semántica que JDBC: una
 * conexión persistente al motor SQLite y sentencias SQL preparadas
 * (`PreparedStatement` ≡ `DatabaseSync#prepare`).
 *
 * Se eligió el módulo built-in para evitar compilación nativa y mantener
 * cero dependencias en la capa de datos. Si en el futuro se requiere
 * `better-sqlite3` por rendimiento, la API es prácticamente idéntica.
 *
 * Las tablas creadas aquí cubren la capa de datos requerida para la evidencia
 * AA2-EV01 (CRUD con driver SQL) y AA2-EV02 (almacenamiento de usuarios para
 * autenticación tipo Servlet).
 *
 * @module database/connection
 */

const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

/**
 * Ruta absoluta al archivo de base de datos SQLite.
 * Puede sobreescribirse con la variable de entorno SENA_DB_PATH (útil para tests).
 *
 * @constant {string}
 */
const DB_PATH = process.env.SENA_DB_PATH || path.join(__dirname, "..", "..", "minus_garden.db");

/**
 * Instancia singleton de la conexión a SQLite.
 * Equivalente a una `java.sql.Connection` mantenida durante la vida del proceso.
 *
 * @type {import('node:sqlite').DatabaseSync}
 */
const db = new DatabaseSync(DB_PATH);

// Habilita claves foráneas y modo WAL para mejor concurrencia de lectura.
db.exec("PRAGMA foreign_keys = ON");
db.exec("PRAGMA journal_mode = WAL");

/**
 * Crea la tabla `plants` si no existe.
 * Representa el dominio principal del proyecto Minus Garden.
 *
 * @returns {void}
 */
function createPlantsTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS plants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      species TEXT,
      watering_frequency INTEGER,
      last_watered TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT
    )
  `);
}

/**
 * Crea la tabla `users` si no existe.
 * Sostiene la evidencia AA5-EV01 (API de autenticación).
 *
 * @returns {void}
 */
function createUsersTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

createPlantsTable();
createUsersTable();

module.exports = { db, DB_PATH };
