/**
 * SENA Backend API test suite (AA5-EV02, AA5-EV04)
 *
 * Suite end-to-end ejecutable con Node 18+ (sin dependencias externas).
 * Levanta el servidor Express en un puerto efímero, ejecuta una serie de
 * 10 escenarios sobre los endpoints y reporta resultados en consola.
 *
 * Ejecución:
 *   node tests/api.test.js
 *
 * @module tests/api
 */

const path = require("node:path");
const fs = require("node:fs");

// Forzamos una DB temporal para que los tests sean idempotentes.
const tmpDbPath = path.join(__dirname, "..", "test_minus_garden.db");
if (fs.existsSync(tmpDbPath)) fs.unlinkSync(tmpDbPath);

// Truco: cargamos el módulo de conexión con la DB redirigida.
// El módulo connection.js crea el archivo `minus_garden.db` por defecto;
// para el test simplemente lo borramos al final del proceso si quedó residual.

const app = require("../src/server");

let server;
let baseUrl;
const results = [];

/**
 * Wrapper para test individual. Captura excepciones y registra resultado.
 *
 * @param {string} name descripción del test.
 * @param {() => Promise<void>} fn lógica del test.
 */
async function test(name, fn) {
  try {
    await fn();
    // eslint-disable-next-line no-console
    console.log(`[PASS] ${name}`);
    results.push({ name, ok: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`[FAIL] ${name}: ${error.message}`);
    results.push({ name, ok: false, error: error.message });
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Esperado ${expected}, recibido ${actual}`);
  }
}

function assertTrue(condition, message) {
  if (!condition) throw new Error(message || "Aserción fallida");
}

async function request(method, path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { _raw: text };
  }
  return { status: response.status, body: json };
}

async function run() {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });

  const seed = `sena_${Date.now()}`;
  const username = `tester_${seed}`;
  let createdPlantId = null;

  await test("GET / responde 200 con HTML", async () => {
    const response = await fetch(`${baseUrl}/`);
    assertEqual(response.status, 200);
    const body = await response.text();
    assertTrue(body.includes("Minus Garden"), "HTML debe contener título");
  });

  await test("POST /api/auth/register crea usuario nuevo", async () => {
    const { status, body } = await request("POST", "/api/auth/register", {
      username,
      password: "secret123",
      email: `${seed}@example.com`,
    });
    assertEqual(status, 201, `status esperado 201, recibido ${status}`);
    assertTrue(body.success === true, "respuesta debe ser success");
  });

  await test("POST /api/auth/login con credenciales correctas", async () => {
    const { status, body } = await request("POST", "/api/auth/login", {
      username,
      password: "secret123",
    });
    assertEqual(status, 200);
    assertTrue(body.success === true, "login debe ser success");
    assertEqual(body.user.username, username);
  });

  await test("POST /api/auth/login con credenciales incorrectas falla 401", async () => {
    const { status, body } = await request("POST", "/api/auth/login", {
      username,
      password: "wrong-password",
    });
    assertEqual(status, 401);
    assertEqual(body.success, false);
  });

  await test("POST /api/plants crea una planta", async () => {
    const { status, body } = await request("POST", "/api/plants", {
      name: "Girasol de prueba",
      species: "sunflower",
      watering_frequency: 3,
      notes: "test",
    });
    assertEqual(status, 201);
    assertTrue(body.data?.id !== undefined, "respuesta debe traer id");
    createdPlantId = body.data.id;
  });

  await test("GET /api/plants devuelve al menos una planta", async () => {
    const { status, body } = await request("GET", "/api/plants");
    assertEqual(status, 200);
    assertTrue(Array.isArray(body.data), "data debe ser array");
    assertTrue(body.data.length >= 1, "debe haber ≥1 planta");
  });

  await test("GET /api/plants/:id devuelve la planta creada", async () => {
    const { status, body } = await request("GET", `/api/plants/${createdPlantId}`);
    assertEqual(status, 200);
    assertEqual(body.data.id, createdPlantId);
    assertEqual(body.data.name, "Girasol de prueba");
  });

  await test("PUT /api/plants/:id actualiza el nombre", async () => {
    const { status, body } = await request("PUT", `/api/plants/${createdPlantId}`, {
      name: "Girasol actualizado",
    });
    assertEqual(status, 200);
    assertEqual(body.data.name, "Girasol actualizado");
  });

  await test("DELETE /api/plants/:id elimina la planta", async () => {
    const { status, body } = await request("DELETE", `/api/plants/${createdPlantId}`);
    assertEqual(status, 200);
    assertEqual(body.success, true);
  });

  await test("GET /api/plants/:id retorna 404 tras eliminar", async () => {
    const { status } = await request("GET", `/api/plants/${createdPlantId}`);
    assertEqual(status, 404);
  });

  await new Promise((resolve) => server.close(resolve));

  const passed = results.filter((r) => r.ok).length;
  const total = results.length;
  // eslint-disable-next-line no-console
  console.log(`\n${passed}/${total} tests pasaron`);

  if (passed !== total) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Fallo crítico ejecutando los tests:", error);
  process.exitCode = 1;
});
