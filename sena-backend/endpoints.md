# Minus Garden — SENA GA7 Backend Endpoints

> Documento de referencia rápida de los endpoints expuestos por el backend Node/Express.
> Cubre las evidencias **AA2-EV01**, **AA2-EV02**, **AA5-EV01**, **AA5-EV02**, **AA5-EV03**, **AA5-EV04**.

Base URL: `http://localhost:3001`

---

## 1. Bienvenida

### `GET /`

- **Descripción:** Página HTML de bienvenida (equivalente a un JSP).
- **Body:** —
- **Respuesta (200):** `text/html` con listado de endpoints.

---

## 2. Plantas — CRUD

### `GET /api/plants`

- **Descripción:** Lista todas las plantas (SELECT).
- **Body:** —
- **Respuesta (200):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Girasol",
        "species": "sunflower",
        "watering_frequency": 3,
        "last_watered": null,
        "notes": null,
        "created_at": "2026-05-13 10:00:00",
        "updated_at": "2026-05-13 10:00:00"
      }
    ]
  }
  ```

### `GET /api/plants/:id`

- **Descripción:** Obtiene una planta por su ID.
- **Body:** —
- **Respuesta (200):** objeto planta envuelto en `{ success, data }`.
- **Respuesta (404):** `{ "success": false, "message": "Planta no encontrada" }`.

### `POST /api/plants`

- **Descripción:** Crea una nueva planta (INSERT).
- **Body:**
  ```json
  {
    "name": "Girasol",
    "species": "sunflower",
    "watering_frequency": 3,
    "last_watered": "2026-05-12",
    "notes": "Maceta del balcón"
  }
  ```
- **Respuesta (201):** objeto planta creada.
- **Respuesta (400):** falta `name` o `watering_frequency` no es número > 0.

### `PUT /api/plants/:id`

- **Descripción:** Actualiza una planta (UPDATE). Acepta cualquiera de los campos opcionales.
- **Body:**
  ```json
  { "name": "Girasol enano", "watering_frequency": 2 }
  ```
- **Respuesta (200):** objeto planta actualizada.
- **Respuesta (404):** planta no existe.

### `DELETE /api/plants/:id`

- **Descripción:** Elimina una planta (DELETE).
- **Body:** —
- **Respuesta (200):** `{ "success": true, "message": "Planta eliminada" }`.
- **Respuesta (404):** planta no existe.

---

## 3. Autenticación

### `POST /api/auth/register`

- **Descripción:** Registra un nuevo usuario. Hashea la contraseña con SHA-256.
- **Body:**
  ```json
  { "username": "alice", "password": "secret123", "email": "alice@example.com" }
  ```
- **Respuesta (201):** `{ "success": true, "message": "Usuario registrado exitosamente" }`.
- **Respuesta (400):** valida `username` (≥3), `password` (≥6) y formato de email.
- **Respuesta (409):** usuario ya existente.

### `POST /api/auth/login`

- **Descripción:** Autentica un usuario contra la tabla `users`.
- **Body:** `{ "username": "alice", "password": "secret123" }`
- **Respuesta (200):**
  ```json
  {
    "success": true,
    "message": "Autenticación satisfactoria",
    "user": { "id": 1, "username": "alice" }
  }
  ```
- **Respuesta (401):** `{ "success": false, "message": "Error en la autenticación" }`.

### `GET /api/auth/status`

- **Descripción:** Verifica que la API de auth está activa.
- **Respuesta (200):** `{ "status": "API de autenticación activa" }`.

---

## 4. Códigos de estado utilizados

| Código | Significado                                             |
| ------ | ------------------------------------------------------- |
| 200    | Operación exitosa (GET, PUT, DELETE)                    |
| 201    | Recurso creado (POST register, POST plants)             |
| 400    | Petición inválida (campos faltantes, tipos incorrectos) |
| 401    | No autenticado (login fallido)                          |
| 404    | Recurso no encontrado                                   |
| 409    | Conflicto (usuario ya existe)                           |
| 500    | Error interno (excepciones SQL no controladas)          |
