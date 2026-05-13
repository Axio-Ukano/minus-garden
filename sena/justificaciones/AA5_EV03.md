# Evidencia GA7-220501096-AA5-EV03

## Diseño y desarrollo de servicios web — proyecto formativo

- **Aprendiz:** Carlos Pico
- **Programa:** Análisis y desarrollo de software (228118)
- **Repositorio:** ver `REPO.txt`
- **Rama de trabajo:** `sena/ga7-evidencias`

## 1. Proyecto formativo

**Minus Garden** — aplicación de productividad con temporizador Pomodoro
gamificado por plantas virtuales que crecen según las sesiones de estudio
completadas.

El recurso central del dominio es **`plant`**. La API REST construida en
`sena-backend/src/routes/plants.js` expone el CRUD completo de este recurso.

## 2. API del proyecto

Base URL: `http://localhost:3001`

| Método | URL               | Descripción                     |
| ------ | ----------------- | ------------------------------- |
| GET    | `/api/plants`     | Listar todas las plantas        |
| GET    | `/api/plants/:id` | Obtener una planta por id       |
| POST   | `/api/plants`     | Crear una nueva planta          |
| PUT    | `/api/plants/:id` | Actualizar una planta existente |
| DELETE | `/api/plants/:id` | Eliminar una planta             |

## 3. Modelo de datos

Tabla `plants` (definida en `sena-backend/src/database/connection.js`):

| Campo                | Tipo    | Restricciones             |
| -------------------- | ------- | ------------------------- |
| `id`                 | INTEGER | PK AUTOINCREMENT          |
| `name`               | TEXT    | NOT NULL                  |
| `species`            | TEXT    | —                         |
| `watering_frequency` | INTEGER | número > 0                |
| `last_watered`       | TEXT    | ISO date                  |
| `notes`              | TEXT    | —                         |
| `created_at`         | TEXT    | DEFAULT CURRENT_TIMESTAMP |
| `updated_at`         | TEXT    | seteado en cada UPDATE    |

## 4. Documentación de cada servicio

**Archivo principal:** `sena-backend/docs/API_DOCUMENTATION.md`

Incluye:

- Sección 3 — Descripción de cada endpoint (path params, body, respuestas).
- Sección 4 — Ejemplos con `curl` para cada operación.
- Sección 5 — Códigos de estado utilizados.
- Sección 6 — Modelo de datos (tablas `plants` y `users`).
- Sección 7 — Trazabilidad de evidencias.

**Archivo de referencia rápida:** `sena-backend/endpoints.md`.

**Comentarios JSDoc** en cada función handler de `plants.js`.

## 5. Validaciones del servicio

Documentadas en `sena-backend/docs/VALIDATION_TESTS.md`:

- `POST /api/plants` valida `name` no vacío y `watering_frequency` > 0.
- `PUT /api/plants/:id` valida id positivo, existencia del recurso, y campos
  parciales con `COALESCE` para no sobreescribir con NULL.
- `DELETE /api/plants/:id` valida id positivo y existencia del recurso.

## 6. Versionamiento

Rama `sena/ga7-evidencias` con commits descriptivos.

## 7. Cómo ejecutar

```bash
cd sena-backend
npm install
npm start
# Servidor en http://localhost:3001

# Crear una planta:
curl -X POST http://localhost:3001/api/plants \
  -H "Content-Type: application/json" \
  -d '{"name":"Girasol","species":"sunflower","watering_frequency":3}'

# Listar plantas:
curl http://localhost:3001/api/plants
```

## 8. Archivos clave para la revisión

- `sena-backend/src/routes/plants.js` — código del servicio
- `sena-backend/src/database/connection.js` — esquema
- `sena-backend/docs/API_DOCUMENTATION.md` — documentación
- `sena-backend/endpoints.md` — referencia rápida
- `sena-backend/docs/VALIDATION_TESTS.md` — validaciones
