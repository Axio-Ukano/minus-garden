# Evidencia GA7-220501096-AA2-EV02

## Módulos de software codificados y probados (Servlets + Formularios HTML + GET/POST + JSP)

- **Aprendiz:** Carlos Pico
- **Programa:** Análisis y desarrollo de software
- **Código del programa de formación:** 228118
- **Número de ficha:** 3070224
- **Repositorio:** ver `REPO.txt`
- **Rama de trabajo:** `sena/ga7-evidencias`

## 1. Tecnología seleccionada

La guía permite elegir el framework según el proyecto. Minus Garden usa
**Node.js + Express** como reemplazo funcional del paradigma Java EE
(Servlets + JSP).

## 2. Equivalencia Servlets / JSP → Express

| Concepto Java EE                 | Implementación en este proyecto                      |
| -------------------------------- | ---------------------------------------------------- |
| `HttpServlet`                    | `express.Router()`                                   |
| `doGet(req, res)`                | `router.get("/ruta", handler)`                       |
| `doPost(req, res)`               | `router.post("/ruta", handler)`                      |
| `request.getParameter(...)`      | `req.body.<campo>` (con `express.json()` middleware) |
| JSP con scriptlets HTML          | Template literal HTML en `server.js` (ruta `GET /`)  |
| `RequestDispatcher.forward(...)` | `res.json(...)` / `res.send(html)`                   |

## 3. Endpoints con métodos GET y POST

| Servlet equivalente           | Implementación            |
| ----------------------------- | ------------------------- |
| `RegisterServlet#doPost`      | `POST /api/auth/register` |
| `LoginServlet#doPost`         | `POST /api/auth/login`    |
| `StatusServlet#doGet`         | `GET  /api/auth/status`   |
| `ListPlantsServlet#doGet`     | `GET  /api/plants`        |
| `CreatePlantServlet#doPost`   | `POST /api/plants`        |
| `UpdatePlantServlet#doPut`    | `PUT  /api/plants/:id`    |
| `DeletePlantServlet#doDelete` | `DELETE /api/plants/:id`  |

Los comentarios JSDoc en `sena-backend/src/routes/auth.js` y `plants.js`
documentan explícitamente este mapping.

## 4. Formularios HTML reales (lado cliente)

- **`src/features/sena/components/PlantManager.tsx`** — formulario que envía
  POST a `/api/plants` y procesa la respuesta.
- **`src/features/sena/components/AuthDemo.tsx`** — formularios de registro y
  login que envían POST a `/api/auth/*`.

## 5. Página HTML servida desde el backend (≈ JSP)

**`sena-backend/src/server.js`** sirve una página HTML completa en `GET /`,
generada del lado servidor (equivalente funcional a JSP de bienvenida).

## 6. Validaciones implementadas

- 14 escenarios negativos en servidor (campos requeridos, tipos, longitudes,
  formato email, duplicados, recurso inexistente).
- 7 reglas en cliente (`PlantManager.tsx`, `AuthDemo.tsx`).
- Inventario completo: `sena-backend/docs/VALIDATION_TESTS.md`.

## 7. Cómo ejecutar

```bash
# Backend (servlets-equivalentes)
cd sena-backend && npm install && npm start

# Frontend (formularios HTML)
pnpm install && pnpm dev
# Abrir http://localhost:1420 → pestaña "SENA"
```

## 8. Archivos clave para la revisión

- `sena-backend/src/server.js` — Express + HTML de bienvenida (≈ JSP)
- `sena-backend/src/routes/plants.js` — Servlets-equivalentes con GET/POST/PUT/DELETE
- `sena-backend/src/routes/auth.js` — Servlets-equivalentes register/login/status
- `src/features/sena/components/PlantManager.tsx` — formulario HTML POST
- `src/features/sena/components/AuthDemo.tsx` — formularios HTML POST
