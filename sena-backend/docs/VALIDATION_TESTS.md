# Pruebas de Validación — SENA GA7 (AA3-EV02, AA5-EV03)

> Documento de "normas básicas y validaciones" requerido por la evidencia
> **AA3-EV02**. Cubre los escenarios negativos (datos inválidos) que ejercitan
> las reglas implementadas en el backend Node/Express y en los componentes
> React del módulo SENA.

Cada validación se documenta como una mini-prueba. Sigue la estructura:

- **Qué se valida**
- **Petición de prueba (entrada inválida)**
- **Respuesta esperada del servidor**

Todas las pruebas pueden ejecutarse manualmente desde la colección Postman
(`tests/endpoints-collection.json`) o automáticamente con
`node tests/api.test.js`.

---

## 1. Endpoint `POST /api/auth/register`

### 1.1 Username menor a 3 caracteres

- **Entrada:** `{ "username": "al", "password": "secret123" }`
- **Esperado:** `400 Bad Request`
- **Body:** `{ "success": false, "message": "username requerido (mínimo 3 caracteres)" }`

### 1.2 Password menor a 6 caracteres

- **Entrada:** `{ "username": "alice", "password": "abc" }`
- **Esperado:** `400 Bad Request`
- **Body:** `{ "success": false, "message": "password requerido (mínimo 6 caracteres)" }`

### 1.3 Email con formato inválido

- **Entrada:** `{ "username": "alice", "password": "secret123", "email": "no-email" }`
- **Esperado:** `400 Bad Request`
- **Body:** `{ "success": false, "message": "email con formato inválido" }`

### 1.4 Usuario duplicado

- **Entrada:** mismo `username` ya registrado.
- **Esperado:** `409 Conflict`
- **Body:** `{ "success": false, "message": "El usuario ya existe" }`

---

## 2. Endpoint `POST /api/auth/login`

### 2.1 Faltan credenciales

- **Entrada:** `{}`
- **Esperado:** `400 Bad Request`
- **Body:** `{ "success": false, "message": "username y password requeridos" }`

### 2.2 Credenciales incorrectas

- **Entrada:** `{ "username": "alice", "password": "wrong" }`
- **Esperado:** `401 Unauthorized`
- **Body:** `{ "success": false, "message": "Error en la autenticación" }`

---

## 3. Endpoint `POST /api/plants`

### 3.1 Falta el campo `name`

- **Entrada:** `{ "species": "sunflower" }`
- **Esperado:** `400 Bad Request`
- **Body:** `{ "success": false, "message": "El campo 'name' es requerido" }`

### 3.2 `name` vacío (sólo espacios)

- **Entrada:** `{ "name": "   " }`
- **Esperado:** `400 Bad Request`

### 3.3 `watering_frequency` no es número

- **Entrada:** `{ "name": "Girasol", "watering_frequency": "tres" }`
- **Esperado:** `400 Bad Request`
- **Body:** `{ "success": false, "message": "watering_frequency debe ser número > 0" }`

### 3.4 `watering_frequency` negativo o cero

- **Entrada:** `{ "name": "Girasol", "watering_frequency": -1 }`
- **Esperado:** `400 Bad Request`

---

## 4. Endpoint `PUT /api/plants/:id`

### 4.1 ID no numérico

- **URL:** `/api/plants/abc`
- **Esperado:** `400 Bad Request` con `{ message: "id inválido" }`

### 4.2 Planta inexistente

- **URL:** `/api/plants/9999999`
- **Body:** `{ "name": "X" }`
- **Esperado:** `404 Not Found` con `{ message: "Planta no encontrada" }`

### 4.3 `name` vacío al actualizar

- **Body:** `{ "name": "" }`
- **Esperado:** `400 Bad Request` con `{ message: "name no puede estar vacío" }`

---

## 5. Endpoint `DELETE /api/plants/:id`

### 5.1 Planta inexistente

- **URL:** `/api/plants/9999999`
- **Esperado:** `404 Not Found` con `{ message: "Planta no encontrada" }`

### 5.2 ID inválido (no entero positivo)

- **URL:** `/api/plants/0`
- **Esperado:** `400 Bad Request`

---

## 6. Endpoint `GET /api/plants/:id`

### 6.1 ID inválido

- **URL:** `/api/plants/abc`
- **Esperado:** `400 Bad Request`

### 6.2 ID inexistente

- **URL:** `/api/plants/9999999`
- **Esperado:** `404 Not Found`

---

## 7. Validaciones del cliente React (`src/features/sena`)

### 7.1 Formulario "Crear planta" (`PlantManager.tsx`)

| Regla                                  | Mensaje en la UI                                       |
| -------------------------------------- | ------------------------------------------------------ |
| `name` vacío                           | "El nombre es obligatorio."                            |
| `watering_frequency` no numérico o ≤ 0 | "La frecuencia de riego debe ser un número mayor a 0." |

### 7.2 Formulario "Registro" (`AuthDemo.tsx`)

| Regla                     | Mensaje en la UI                                  |
| ------------------------- | ------------------------------------------------- |
| `username` < 3 caracteres | "El usuario debe tener al menos 3 caracteres."    |
| `password` < 6 caracteres | "La contraseña debe tener al menos 6 caracteres." |
| `email` formato inválido  | "El email no tiene un formato válido."            |

### 7.3 Formulario "Login" (`AuthDemo.tsx`)

| Regla                     | Mensaje en la UI                                  |
| ------------------------- | ------------------------------------------------- |
| `username` < 3 caracteres | "El usuario debe tener al menos 3 caracteres."    |
| `password` < 6 caracteres | "La contraseña debe tener al menos 6 caracteres." |

---

## 8. Resumen

| Capa     | Cantidad de validaciones documentadas |
| -------- | ------------------------------------- |
| Backend  | 14 escenarios sobre 5 endpoints       |
| Frontend | 7 reglas sobre 3 formularios          |

Las validaciones se ejecutan tanto en **cliente** (UX inmediata) como en
**servidor** (defensa en profundidad), siguiendo la regla _"valida en los
bordes del sistema"_ del componente formativo de seguridad básica.
