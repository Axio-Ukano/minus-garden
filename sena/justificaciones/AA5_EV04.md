# Evidencia GA7-220501096-AA5-EV04

## API del proyecto — Testing con Postman

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

## 2. Endpoints del proyecto (testing)

| Método | URL               | Descripción                     |
| ------ | ----------------- | ------------------------------- |
| GET    | `/api/plants`     | Listar todas las plantas        |
| GET    | `/api/plants/:id` | Obtener una planta por id       |
| POST   | `/api/plants`     | Crear una nueva planta          |
| PUT    | `/api/plants/:id` | Actualizar una planta existente |
| DELETE | `/api/plants/:id` | Eliminar una planta             |

Base URL: `http://localhost:3001`

## 3. Archivo END POINTS — `ENDPOINTS.json`

Archivo en formato **Postman Collection v2.1.0**. Para usarlo:

1. Abrir Postman → botón **Import**.
2. Seleccionar `ENDPOINTS.json`.
3. Configurar la variable de colección `baseUrl` = `http://localhost:3001`.
4. Ejecutar las requests `Plants - *` individualmente o usar el **Runner**.

Requests específicas del proyecto en la colección:

- `Plants - List` — GET /api/plants
- `Plants - Create` — POST /api/plants
- `Plants - Get by id` — GET /api/plants/:id
- `Plants - Update` — PUT /api/plants/:id
- `Plants - Delete` — DELETE /api/plants/:id

## 4. Tests automatizados (valor agregado)

`sena-backend/tests/api.test.js` ejecuta los mismos escenarios end-to-end sin
necesidad de Postman:

```bash
cd sena-backend
npm install
npm test
# Salida esperada: 10/10 tests pasaron
```

## 5. Escenarios de testing probados

| #   | Escenario                                              | Resultado esperado |
| --- | ------------------------------------------------------ | ------------------ |
| 1   | POST /api/plants con datos válidos                     | 201                |
| 2   | GET /api/plants devuelve array con al menos 1 elemento | 200                |
| 3   | GET /api/plants/:id devuelve datos de la planta creada | 200                |
| 4   | PUT /api/plants/:id actualiza el nombre                | 200                |
| 5   | DELETE /api/plants/:id elimina la planta               | 200                |
| 6   | GET /api/plants/:id retorna 404 tras eliminar          | 404                |
| 7   | POST /api/plants sin name → 400                        | 400                |
| 8   | POST /api/plants con watering_frequency negativo → 400 | 400                |
| 9   | GET /api/plants/abc (id no numérico) → 400             | 400                |

## 6. Cómo levantar el servidor para las pruebas

```bash
cd sena-backend
npm install
npm start
# Servidor en http://localhost:3001
```

## 7. Archivos clave para la revisión

- `ENDPOINTS.json` — colección Postman (archivo END POINTS)
- `sena-backend/tests/api.test.js` — suite automatizada
- `sena-backend/src/routes/plants.js` — código del servicio probado
- `sena-backend/docs/API_DOCUMENTATION.md` — documentación completa
- `video.mp4` — adjuntar por el aprendiz (demo Postman)
- `documento-pruebas.docx` — adjuntar por el aprendiz (capturas)
