# ADR-0005: Capa de repositorio como única frontera de datos

- **Estado:** Aceptada
- **Fecha:** 2026-06-09
- **Decisores:** @autor

## Contexto

Hasta ahora cada store de feature (`historyStore`, `subjectStore`) llamaba directamente a `tauriInvoke("<comando>", …)`. Eso esparce por toda la app el conocimiento del transporte: nombres de comandos Tauri, shapes snake_case del wire y el mapeo a camelCase del dominio. El proyecto crecerá en dispositivos (móvil vía Tauri) y, eventualmente, en sincronización entre dispositivos — lo que exigirá un backend remoto. Con el acoplamiento actual, ese día tocaría reescribir todos los stores.

`src/lib/tauri.ts` ya centraliza el _transporte_ (invoke + toast + error tipado), pero no el _contrato_ de datos.

## Decisión

Introducir `src/lib/data/` como única frontera entre los módulos de feature y la persistencia:

- `src/lib/data/types.ts` — tipos de dominio (`Session`, `Subject`, `UserState`).
- `src/lib/data/index.ts` — objeto `repository` con métodos tipados (`repository.sessions.list()`, `repository.userState.setHearts()`, etc.) que envuelven `tauriInvoke` y hacen el mapeo wire ⇄ dominio.

Regla de boundary (a reforzar con ESLint cuando convenga): ningún store o componente importa `@tauri-apps/api` ni llama `tauriInvoke` directamente; todo pasa por `repository`. Los stores quedan como orquestadores de estado de UI, sin conocer el transporte.

## Consecuencias

### Positivas

- Cambiar SQLite-sobre-IPC por una API HTTP/sync toca **un solo archivo** (`src/lib/data/index.ts`), no los stores.
- Caching, escrituras optimistas o colas offline se añaden en un único sitio.
- El mapeo snake_case ⇄ camelCase deja de filtrarse a la UI.
- Los tipos de dominio dejan de vivir dentro de un store (evita dependencias circulares entre módulos).

### Negativas

- Una capa de indirección más entre store y `tauriInvoke`.
- Los tipos `Session`/`Subject` se re-exportan desde los stores por compatibilidad; hay que recordar que su hogar canónico es `src/lib/data/types.ts`.

### Neutras

- Los tests de store siguen mockeando `@/lib/tauri` (el repo es transparente); se añadió `repository.test.ts` para cubrir el mapeo.

## Alternativas consideradas

### Seguir llamando `tauriInvoke` desde cada store

Cero indirección, pero replica el contrato en cada feature y hace caro el salto a red. Descartado: es exactamente el acoplamiento que el crecimiento previsto va a penalizar.

### Un repositorio por módulo dentro de cada feature

Más "DDD", pero dispersa otra vez el conocimiento del transporte y complica el swap a HTTP. Descartado por sobreingeniería para el tamaño actual.

## Notas / referencias

- Relacionado con ADR-0003 (SQLite local) y ADR-0004 (boundaries de módulo).
- Documentar la capa en `docs/architecture.md`.
