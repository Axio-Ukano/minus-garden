/**
 * Database connection module - SENA GA7 Evidence
 *
 * Este módulo es el equivalente funcional a una conexión JDBC en Java.
 * En el paradigma Java tradicional (AA2-EV01) se usaría:
 *
 *   DriverManager.getConnection("jdbc:sqlite:minus_garden.db");
 *
 * En Node.js usamos `better-sqlite3`, un driver síncrono y de alto rendimiento
 * que mantiene la misma semántica: una conexión persistente al motor SQLite y
 * la posibilidad de ejecutar sentencias SQL preparadas (PreparedStatement).
 *
 * Las tablas creadas aquí cubren la capa de datos requerida para la evidencia
 * AA2-EV01 (CRUD con driver SQL) y AA2-EV02 (almacenamiento de usuarios para
 * autenticación tipo Servlet).
 *
 * @module database/connection
 */

const path = require("node:path");
const Database = require("better-sqlite3");

/**
 * Ruta absoluta al archivo de base de datos SQLite.
 * El archivo se crea automáticamente si no existe.
 *
 * @constant {string}
 */
const DB_PATH = path.join(__dirname, "..", "..", "minus_garden.db");

/**
 * Instancia singleton de la conexión a SQLite.
 * Equivalente a una `java.sql.Connection` mantenida durante la vida del proceso.
 *
 * @type {Database.Database}
 */
const db = new Database(DB_PATH);

// Habilita claves foráneas y modo WAL para mejor concurrencia de lectura.
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

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
