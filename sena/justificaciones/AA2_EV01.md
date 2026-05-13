# Evidencia GA7-220501096-AA2-EV01

## Codificación de módulos del software con driver SQL y CRUD

- **Aprendiz:** Carlos Pico
- **Programa:** Análisis y desarrollo de software (228118)
- **Repositorio:** ver `REPO.txt`
- **Rama de trabajo:** `sena/ga7-evidencias`

## 1. Tecnología seleccionada

La guía en su sección 3.1 indica que el aprendiz "podrá escoger la que más se
adapte a las características del proyecto a realizar" entre Spring Boot,
React, Android, Swift y Node. Para el proyecto formativo **Minus Garden**
(aplicación de escritorio Tauri + React + Node) se utiliza **Node.js** del
lado del servidor.

## 2. Conexión a BD con driver SQL (equivalente JDBC)

**Archivo:** `sena-backend/src/database/connection.js`

Se usa el driver `node:sqlite` (built-in de Node 22+), que cumple la misma
función que JDBC: abre y mantiene una conexión persistente al motor de
base de datos, expone sentencias preparadas y permite ejecutar SQL.

### Mapeo conceptual JDBC → driver Node

| Java / JDBC                        | Implementación Node                |
| ---------------------------------- | ---------------------------------- |
| `DriverManager.getConnection(...)` | `new DatabaseSync(DB_PATH)`        |
| `PreparedStatement`                | `db.prepare(sql)`                  |
| `ResultSet` + `.next()`            | `stmt.all()` / `stmt.get()`        |
| `executeUpdate()`                  | `stmt.run()`                       |
| `Connection.close()`               | singleton mantenido por el proceso |

El comentario inicial del archivo `connection.js` documenta este mapping
explícitamente.

## 3. CRUD completo

**Archivo:** `sena-backend/src/routes/plants.js`

| Operación       | Endpoint                 | SQL                                |
| --------------- | ------------------------ | ---------------------------------- |
| Inserción       | `POST /api/plants`       | `INSERT INTO plants ...`           |
| Consulta        | `GET /api/plants`        | `SELECT * FROM plants ORDER BY id` |
| Consulta por id | `GET /api/plants/:id`    | `SELECT * FROM plants WHERE id=?`  |
| Actualizar      | `PUT /api/plants/:id`    | `UPDATE plants SET ... WHERE id=?` |
| Eliminar        | `DELETE /api/plants/:id` | `DELETE FROM plants WHERE id=?`    |

## 4. Estándares de codificación cumplidos

- **Variables y funciones:** camelCase
- **Componentes y clases:** PascalCase
- **Archivos:** kebab-case
- **Comentarios JSDoc/TSDoc** en cada función del backend
- **ESLint** (`eslint.config.js`) en `error` para `no-explicit-any`,
  `no-floating-promises`, `import/no-cycle`
- **Prettier** obligatorio en pre-commit (`simple-git-hooks` + `lint-staged`)

## 5. Versionamiento

Repositorio público en GitHub con rama dedicada `sena/ga7-evidencias` y
6 commits descriptivos en formato Conventional Commits.

## 6. Cómo ejecutar el módulo

```bash
cd sena-backend
npm install
npm start
# Servidor en http://localhost:3001
# Verificación rápida:
curl http://localhost:3001/api/plants
```

## 7. Archivos clave para la revisión

- `sena-backend/src/database/connection.js` — conexión SQL
- `sena-backend/src/routes/plants.js` — CRUD completo
- `sena-backend/src/server.js` — punto de entrada
- `sena-backend/docs/API_DOCUMENTATION.md` — documentación completa
- `sena-backend/endpoints.md` — referencia rápida
