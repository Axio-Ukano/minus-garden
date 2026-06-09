# ADR-0006: Migraciones SQLite versionadas con `PRAGMA user_version`

- **Estado:** Aceptada
- **Fecha:** 2026-06-09
- **Decisores:** @autor

## Contexto

`db.rs` creaba el esquema con `CREATE TABLE IF NOT EXISTS` más dos `ALTER TABLE … ADD COLUMN` idempotentes (con el error tragado por `let _ =`) para back-fill de instalaciones pre-Sprint 6. Ese patrón funciona pero no escala: cada cambio futuro de esquema obliga a más `IF NOT EXISTS`/ALTER tragados, sin forma de saber en qué versión está una base, sin orden garantizado y con riesgo de aplicar dos veces un cambio. ADR-0003 ya anticipaba "esquema versionable con migraciones imperativas"; este ADR define ese mecanismo antes de que el esquema crezca con la gamificación.

## Decisión

Implementar un runner de migraciones en `db.rs` basado en `PRAGMA user_version`:

- `MIGRATIONS: &[&str]` — lista ordenada; el índice + 1 es el número de versión de cada migración.
- `run_migrations` lee `user_version`, aplica en orden cada migración con versión mayor a la actual y, tras cada una, sube `user_version`.
- **Migración v1** = esquema baseline. Usa `IF NOT EXISTS` + los ALTER legacy (tragados) para absorber con seguridad cualquier base previa (pre-`user_version` con tablas ya creadas, con o sin columnas de planta). En una base nueva crea todo. En ambos casos termina en versión 1.
- **De v2 en adelante**: `ALTER`/`CREATE` planos, sin guardas — la versión garantiza que solo corren contra un esquema que aún no tiene el cambio.

Se añaden tests unitarios Rust (`#[cfg(test)]` en `db.rs`) que verifican: base nueva → última versión, idempotencia (segunda corrida no duplica seeds), y upgrade de una base legacy sin columnas de planta.

## Consecuencias

### Positivas

- El **próximo** cambio de esquema es una entrada nueva en `MIGRATIONS`, trivial y auditable.
- Estado de esquema explícito y consultable (`user_version`).
- Orden e idempotencia garantizados; sin riesgo de doble aplicación.
- Cubierto por tests Rust.

### Negativas

- Las migraciones nunca se editan ni reordenan una vez publicadas; solo se añaden. Requiere disciplina.
- Los tests Rust no corren en el CI de frontend (`validate.yml` es solo pnpm); se ejecutan con `cargo test`.

### Neutras

- La migración v1 conserva el patrón legacy `IF NOT EXISTS`/ALTER por compatibilidad hacia atrás; no es deuda, es el contrato de "absorber lo ya instalado".

## Alternativas consideradas

### `tauri-plugin-sql` con migraciones declarativas

Aporta un sistema de migraciones, pero añade una dependencia y mueve el esquema a JS/config. Para una capa Rust ya existente y mínima, es sobreingeniería. Diferido.

### Crate `refinery` / `rusqlite_migration`

Más completos, pero añaden dependencia para algo que `user_version` + un `&[&str]` resuelve con ~30 líneas. Descartado por peso innecesario.

## Notas / referencias

- Sustituye el mecanismo descrito en ADR-0003 sin invalidar su decisión de fondo (SQLite local).
- Actualizar el esquema y el flujo de migración en `docs/architecture.md`.
