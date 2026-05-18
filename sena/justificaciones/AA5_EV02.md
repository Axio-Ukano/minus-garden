# Evidencia GA7-220501096-AA5-EV02

## API — Testing del caso con Postman

- **Aprendiz:** Carlos Pico
- **Programa:** Análisis y desarrollo de software
- **Código del programa de formación:** 228118
- **Número de ficha:** 3070224
- **Repositorio:** ver `REPO.txt`
- **Rama de trabajo:** `sena/evidencias`

## 1. Contenido de esta entrega

Esta evidencia contiene los cuatro productos que pide la guía:

| Producto                     | Archivo                                |
| ---------------------------- | -------------------------------------- |
| Archivos del proyecto        | (todo este ZIP)                        |
| Video con testing en Postman | `video.mp4` (adjuntar por el aprendiz) |
| Documento con pantallazos    | `documento-pruebas.docx` (adjuntar)    |
| Archivo END POINTS           | **`ENDPOINTS.json`** (incluido)        |
| Enlace al repositorio        | `REPO.txt`                             |

## 2. Endpoints del caso (autenticación)

| Método | URL                  | Descripción            |
| ------ | -------------------- | ---------------------- |
| GET    | `/api/auth/status`   | Health-check de la API |
| POST   | `/api/auth/register` | Registro de usuario    |
| POST   | `/api/auth/login`    | Inicio de sesión       |

Base URL: `http://localhost:3001`

## 3. Archivo END POINTS — `ENDPOINTS.json`

Archivo en formato **Postman Collection v2.1.0**. Para usarlo:

1. Abrir Postman → botón **Import** (parte superior izquierda).
2. Seleccionar `ENDPOINTS.json`.
3. Configurar la variable de colección `baseUrl` = `http://localhost:3001`.
4. Ejecutar cada request individualmente o usar el **Runner**.

La colección incluye:

- `Welcome HTML` — GET /
- `Auth - Status` — GET /api/auth/status
- `Auth - Register` — POST /api/auth/register
- `Auth - Login OK` — POST con credenciales válidas
- `Auth - Login FAIL` — POST con credenciales inválidas
- (también incluye los endpoints de plants para AA5-EV04)

## 4. Tests automatizados (valor agregado)

Además del testing manual con Postman, el ZIP incluye una suite automatizada
que ejecuta los mismos escenarios sin necesidad de Postman:

```bash
cd sena-backend
npm install
npm test
# Salida esperada: 10/10 tests pasaron
```

Archivo: `sena-backend/tests/api.test.js`.

## 5. Escenarios de testing probados

| #   | Escenario                                           | Resultado esperado  |
| --- | --------------------------------------------------- | ------------------- |
| 1   | GET / responde con HTML de bienvenida               | 200                 |
| 2   | POST /api/auth/register con datos válidos           | 201, success: true  |
| 3   | POST /api/auth/login con credenciales correctas     | 200, success: true  |
| 4   | POST /api/auth/login con credenciales incorrectas   | 401, success: false |
| 5   | POST /api/auth/register con username < 3 caracteres | 400                 |
| 6   | POST /api/auth/register con password < 6 caracteres | 400                 |
| 7   | POST /api/auth/register con email inválido          | 400                 |
| 8   | POST /api/auth/register con usuario duplicado       | 409                 |

## 6. Cómo levantar el servidor para las pruebas

```bash
cd sena-backend
npm install
npm start
# El servidor queda escuchando en http://localhost:3001
```

## 7. Archivos clave para la revisión

- `ENDPOINTS.json` — colección Postman (archivo END POINTS)
- `sena-backend/tests/api.test.js` — suite automatizada
- `sena-backend/src/routes/auth.js` — código del servicio probado
- `sena-backend/docs/API_DOCUMENTATION.md` — documentación de cada endpoint
- `video.mp4` — adjuntar por el aprendiz (demo Postman)
- `documento-pruebas.docx` — adjuntar por el aprendiz (capturas)
