# Evidencia GA7-220501096-AA5-EV01

## Diseño y desarrollo de servicios web — caso (registro + login)

- **Aprendiz:** Carlos Pico
- **Programa:** Análisis y desarrollo de software
- **Código del programa de formación:** 228118
- **Número de ficha:** 3070224
- **Repositorio:** ver `REPO.txt`
- **Rama de trabajo:** `sena/ga7-evidencias`

## 1. Cumplimiento literal del caso de uso

La guía pide:

> "Se requiere realizar un servicio web para un registro y un inicio de sesión.
> El servicio recibirá un usuario y una contraseña, si la autenticación es
> correcta saldrá un mensaje de **autenticación satisfactoria** en caso
> contrario debe devolver **error en la autenticación**."

## 2. Implementación

**Archivo:** `sena-backend/src/routes/auth.js`

### 2.1 Endpoint de registro

`POST /api/auth/register`

- **Recibe:** `{ username, password, email? }`
- **Respuesta éxito (201):** `{ success: true, message: "Usuario registrado exitosamente" }`
- **Respuesta error (409):** `{ success: false, message: "El usuario ya existe" }`
- **Respuesta error (400):** validaciones de longitud y formato.

### 2.2 Endpoint de login

`POST /api/auth/login`

- **Recibe:** `{ username, password }`
- **Respuesta éxito (200):**
  ```json
  {
    "success": true,
    "message": "Autenticación satisfactoria",
    "user": { "id": 1, "username": "alice" }
  }
  ```
- **Respuesta error (401):**
  ```json
  {
    "success": false,
    "message": "Error en la autenticación"
  }
  ```

Los mensajes exactos solicitados por la guía ("Autenticación satisfactoria"
y "Error en la autenticación") están **literalmente** en el código fuente.

### 2.3 Endpoint de salud

`GET /api/auth/status` → `{ "status": "API de autenticación activa" }`

## 3. Seguridad básica

Las contraseñas se hashean con **SHA-256** (módulo `node:crypto`) antes de
persistirse en la tabla `users`. No se almacena la contraseña en texto plano.

## 4. Comentarios en el código

El archivo `auth.js` comienza con un comentario JSDoc que mapea cada ruta
a su equivalente como Servlet Java:

```
- POST /api/auth/register  ≡  RegisterServlet#doPost
- POST /api/auth/login     ≡  LoginServlet#doPost
- GET  /api/auth/status    ≡  StatusServlet#doGet
```

## 5. Versionamiento

Rama `sena/ga7-evidencias` con commits descriptivos.

## 6. Cómo ejecutar y probar

```bash
cd sena-backend
npm install
npm start
# Servidor en http://localhost:3001

# Registrar usuario:
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"secret123"}'

# Login OK:
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"secret123"}'

# Login FAIL:
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"wrong"}'
```

## 7. Archivos clave para la revisión

- `sena-backend/src/routes/auth.js` — código del servicio web
- `sena-backend/src/database/connection.js` — tabla `users`
- `sena-backend/src/server.js` — punto de entrada
- `sena-backend/docs/API_DOCUMENTATION.md` — secciones 3.3 y 3.4
