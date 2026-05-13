# Evidencia GA7-220501096-AA3-EV02

## Módulos de software codificados y probados

- **Aprendiz:** Carlos Pico
- **Programa:** Análisis y desarrollo de software
- **Código del programa de formación:** 228118
- **Número de ficha:** 3070224
- **Repositorio:** ver `REPO.txt`
- **Rama de trabajo:** `sena/ga7-evidencias`

## 1. Contenido de esta entrega

Esta evidencia se compone de tres elementos según lo solicitado por la guía:

1. **Archivos del proyecto** — incluidos en este ZIP.
2. **Documento en Word/PDF** — `documento.docx` con capturas por cada
   historia de usuario o caso de uso (pendiente de adjuntar por el aprendiz).
3. **Video** — `video.mp4` mostrando la funcionalidad con sus validaciones
   (pendiente de adjuntar por el aprendiz).

## 2. Funcionalidad codificada

El módulo `src/features/sena/` integra el frontend React con el backend
REST y demuestra todas las operaciones del dominio:

| Historia de usuario | Endpoint                  | Componente UI                  |
| ------------------- | ------------------------- | ------------------------------ |
| Listar plantas      | `GET /api/plants`         | `PlantManager.tsx`             |
| Crear planta        | `POST /api/plants`        | `PlantManager.tsx` (form)      |
| Editar planta       | `PUT /api/plants/:id`     | `PlantManager.tsx` (form edit) |
| Eliminar planta     | `DELETE /api/plants/:id`  | `PlantManager.tsx` (botón)     |
| Registrar usuario   | `POST /api/auth/register` | `AuthDemo.tsx` (tab register)  |
| Iniciar sesión      | `POST /api/auth/login`    | `AuthDemo.tsx` (tab login)     |

## 3. Validaciones implementadas

Inventario completo en `sena-backend/docs/VALIDATION_TESTS.md`:

- **14 validaciones de servidor**: campos requeridos, tipos numéricos,
  longitudes mínimas (username ≥ 3, password ≥ 6), formato email,
  usuarios duplicados, recursos inexistentes.
- **7 validaciones de cliente**: visibles en `PlantManager.tsx` (nombre
  requerido, frecuencia numérica > 0) y `AuthDemo.tsx` (longitudes y email).

## 4. Pruebas automatizadas

`sena-backend/tests/api.test.js` ejecuta 10 escenarios end-to-end:

```bash
cd sena-backend && npm install && npm test
# Salida esperada: 10/10 tests pasaron
```

## 5. Versionamiento

Rama `sena/ga7-evidencias` en GitHub con 6 commits descriptivos.

## 6. Cómo ejecutar

```bash
# Terminal 1 — backend
cd sena-backend
npm install
npm start

# Terminal 2 — frontend
pnpm install
pnpm dev
# Abrir http://localhost:1420 → pestaña "SENA"
```

## 7. Archivos clave para la revisión

- `src/features/sena/` — módulo de demostración (componentes + clientes API)
- `sena-backend/` — backend Node/Express con CRUD + auth
- `sena-backend/docs/VALIDATION_TESTS.md` — inventario de validaciones
- `sena-backend/tests/api.test.js` — suite de tests automatizados
- `documento.docx` — adjuntar por el aprendiz (capturas por HU)
- `video.mp4` — adjuntar por el aprendiz (demo funcional + validaciones)
