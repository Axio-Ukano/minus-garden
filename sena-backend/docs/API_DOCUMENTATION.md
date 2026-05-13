# Documentación de la API — Minus Garden SENA GA7

> Documentación funcional y técnica del backend Node/Express creado para las
> evidencias del programa **SENA GA7-220501096**. Cubre los componentes
> formativos de API REST (AA5-EV01, AA5-EV02, AA5-EV03, AA5-EV04) y de
> validación (AA3-EV02).

- **Servidor:** Express 4
- **Driver SQL:** `node:sqlite` (built-in, Node ≥ 22.5)
- **Puerto por defecto:** `3001`
- **Formato de respuestas:** JSON con envoltorio `{ success, data?, message? }`

## Tabla de contenidos

1. [Cómo levantar el servidor](#1-cómo-levantar-el-servidor)
2. [Headers comunes](#2-headers-comunes)
3. [Endpoints](#3-endpoints)
4. [Ejemplos con curl](#4-ejemplos-con-curl)
5. [Códigos de estado](#5-códigos-de-estado)
6. [Modelo de datos](#6-modelo-de-datos)

---

## 1. Cómo levantar el servidor

```bash
cd sena-backend
npm install
npm start
# → [sena-backend] escuchando en http://localhost:3001
```

Para tests automatizados (sin alterar la DB de desarrollo):

```bash
npm test
```

## 2. Headers comunes

| Header         | Valor              | Cuándo                          |
| -------------- | ------------------ | ------------------------------- |
| `Content-Type` | `application/json` | Todas las peticiones con cuerpo |
| `Accept`       | `application/json` | Opcional, todas las peticiones  |

No se requieren tokens ni cabeceras de autenticación: el endpoint de login
devuelve los datos del usuario directamente (suficiente para la evidencia).

---

## 3. Endpoints

### 3.1 `GET /`

- **Descripción:** Página HTML de bienvenida (≈ JSP).
- **Body:** —
- **Response (200, `text/html`):** lista HTML de endpoints disponibles.

### 3.2 `GET /api/auth/status`

- **Descripción:** Health-check de la API de autenticación.
- **Body:** —
- **Response (200, `application/json`):**
  ```json
  { "status": "API de autenticación activa" }
  ```

### 3.3 `POST /api/auth/register`

- **Descripción:** Crea un nuevo usuario. La contraseña se hashea con SHA-256.

| Campo      | Tipo   | Requerido | Reglas                |
| ---------- | ------ | --------- | --------------------- |
| `username` | string | sí        | ≥ 3 caracteres, único |
| `password` | string | sí        | ≥ 6 caracteres        |
| `email`    | string | no        | formato email válido  |

- **Response (201):** `{ "success": true, "message": "Usuario registrado exitosamente" }`
- **Errores:** `400` (validación), `409` (usuario ya existe).

### 3.4 `POST /api/auth/login`

- **Descripción:** Verifica credenciales contra la tabla `users`.

| Campo      | Tipo   | Requerido |
| ---------- | ------ | --------- |
| `username` | string | sí        |
| `password` | string | sí        |

- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Autenticación satisfactoria",
    "user": { "id": 1, "username": "alice" }
  }
  ```
- **Errores:** `400` (faltan datos), `401` (credenciales inválidas).

### 3.5 `GET /api/plants`

- **Descripción:** Lista todas las plantas (`SELECT *`).
- **Response (200):**
  ```json
  {
    "success": true,
    "data": [
      /* SenaPlant[] */
    ]
  }
  ```

### 3.6 `GET /api/plants/:id`

- **Path param:** `id` (entero positivo).
- **Response (200):** `{ "success": true, "data": SenaPlant }`
- **Errores:** `400` (id inválido), `404` (no existe).

### 3.7 `POST /api/plants`

- **Descripción:** Crea una planta (`INSERT`).

| Campo                | Tipo   | Requerido | Reglas           |
| -------------------- | ------ | --------- | ---------------- |
| `name`               | string | sí        | no vacío         |
| `species`            | string | no        | —                |
| `watering_frequency` | number | no        | entero > 0       |
| `last_watered`       | string | no        | ISO date (texto) |
| `notes`              | string | no        | —                |

- **Response (201):** planta creada.
- **Errores:** `400`.

### 3.8 `PUT /api/plants/:id`

- **Descripción:** Actualiza campos parciales de una planta (`UPDATE`).
  Cualquier campo omitido conserva su valor anterior (`COALESCE`).
- **Response (200):** planta actualizada.
- **Errores:** `400`, `404`.

### 3.9 `DELETE /api/plants/:id`

- **Descripción:** Elimina una planta (`DELETE`).
- **Response (200):** `{ "success": true, "message": "Planta eliminada" }`
- **Errores:** `400`, `404`.

---

## 4. Ejemplos con curl

```bash
# Bienvenida
curl http://localhost:3001/

# Estado de auth
curl http://localhost:3001/api/auth/status

# Registrar usuario
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"secret123","email":"alice@example.com"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"secret123"}'

# Listar plantas
curl http://localhost:3001/api/plants

# Crear planta
curl -X POST http://localhost:3001/api/plants \
  -H "Content-Type: application/json" \
  -d '{"name":"Girasol","species":"sunflower","watering_frequency":3}'

# Obtener planta por id
curl http://localhost:3001/api/plants/1

# Actualizar planta
curl -X PUT http://localhost:3001/api/plants/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Girasol enano"}'

# Eliminar planta
curl -X DELETE http://localhost:3001/api/plants/1
```

---

## 5. Códigos de estado

| Código | Significado                                             |
| ------ | ------------------------------------------------------- |
| 200    | Operación exitosa (GET, PUT, DELETE)                    |
| 201    | Recurso creado (POST register, POST plants)             |
| 400    | Petición inválida (campos faltantes, tipos incorrectos) |
| 401    | No autenticado (login fallido)                          |
| 404    | Recurso no encontrado                                   |
| 409    | Conflicto (usuario ya existe)                           |
| 500    | Error interno (excepción SQL no controlada)             |

---

## 6. Modelo de datos

### Tabla `plants`

| Campo              | Tipo    | Restricciones             |
| ------------------ | ------- | ------------------------- |
| id                 | INTEGER | PK AUTOINCREMENT          |
| name               | TEXT    | NOT NULL                  |
| species            | TEXT    | —                         |
| watering_frequency | INTEGER | —                         |
| last_watered       | TEXT    | —                         |
| notes              | TEXT    | —                         |
| created_at         | TEXT    | DEFAULT CURRENT_TIMESTAMP |
| updated_at         | TEXT    | seteado en UPDATE         |

### Tabla `users`

| Campo         | Tipo    | Restricciones             |
| ------------- | ------- | ------------------------- |
| id            | INTEGER | PK AUTOINCREMENT          |
| username      | TEXT    | UNIQUE NOT NULL           |
| password_hash | TEXT    | NOT NULL (SHA-256 hex)    |
| email         | TEXT    | —                         |
| created_at    | TEXT    | DEFAULT CURRENT_TIMESTAMP |

---

## 7. Trazabilidad de evidencias

| Evidencia | Endpoints / artefactos relacionados                     |
| --------- | ------------------------------------------------------- |
| AA2-EV01  | `database/connection.js`, `routes/plants.js`            |
| AA2-EV02  | `server.js` + Express routers (≈ Servlets doGet/doPost) |
| AA5-EV01  | `routes/auth.js` (register, login, status)              |
| AA5-EV02  | `tests/api.test.js`, `tests/endpoints-collection.json`  |
| AA5-EV03  | `routes/plants.js` (API del dominio del proyecto)       |
| AA5-EV04  | `tests/api.test.js` (cubre también el API del proyecto) |
| AA3-EV02  | `docs/VALIDATION_TESTS.md`                              |
