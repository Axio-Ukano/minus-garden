# ADR-0007: Reglas de juego en una única fuente de verdad (lado cliente, por ahora)

- **Estado:** Aceptada
- **Fecha:** 2026-06-09
- **Decisores:** @autor

## Contexto

Las reglas de economía del juego (corazones que da una sesión, etapa final de la planta) determinan la progresión. La fórmula de corazones `Math.floor(durationMinutes / 5)` estaba **duplicada** en `timerStore.finish()` y en `TimerFinishedView.tsx`: dos copias del mismo número que podían divergir y mostrar al usuario un valor distinto del que se persiste. `calculateFinalStage` ya vivía centralizado en `plantService`.

Surge además la pregunta de si estas reglas deberían moverse al proceso Rust como "fuente de verdad" anti-trampa. Hoy la app es **local-first, de un solo usuario y sin servidor**: el usuario ya tiene acceso total a su propio `.db`, así que no hay superficie de trampa que defender. Mover las reglas a Rust ahora acoplaría datos de render de plantas (umbrales por especie, ligados a claves i18n y a renderers TSX) a través del FFI sin ningún beneficio actual — y contradiría la decisión de no introducir backend antes de necesitarlo.

## Decisión

Consolidar las reglas de fin de sesión en `plantService` como única fuente de verdad del cliente:

- Añadir `calculateHeartsEarned(durationMinutes)` y `MINUTES_PER_HEART` junto a `calculateFinalStage`.
- `timerStore` y `TimerFinishedView` importan esa función; se elimina la fórmula inline duplicada.

**No** se portan las reglas a Rust en este momento. Se documenta que esta capa es la _autoritativa del cliente_ y queda lista para espejarse en el servidor el día que exista un backend de sincronización (ver ADR-0005 para la frontera de datos que habilitará ese salto).

## Consecuencias

### Positivas

- Una sola definición de la economía de corazones; imposible que UI y persistencia diverjan.
- Punto único a portar/espejar cuando haya autoridad de servidor.
- Sin acoplamiento prematuro cliente ⇄ Rust ni coste FFI sin beneficio.

### Negativas

- Sigue siendo lógica de cliente: en un futuro multijugador/competitivo NO sería confiable como autoridad. Aceptado conscientemente mientras no haya servidor.

### Neutras

- `calculateHeartsEarned` vive en el módulo `plants` por consistencia con `calculateFinalStage` (ambas son reglas de fin de sesión), aunque los corazones no sean estrictamente "de planta".

## Alternativas consideradas

### Portar las reglas a Rust ahora

Daría autoridad de servidor… contra un servidor inexistente. Acopla datos de planta al FFI sin beneficio y contradice "no backend antes de tiempo". Diferido hasta que haya sincronización remota.

### Un módulo `game-rules` nuevo y dedicado

Más limpio semánticamente, pero crear un módulo para dos funciones es sobreingeniería hoy. Se reconsiderará si la economía crece (niveles, rachas, multiplicadores).

## Notas / referencias

- Disparador para reabrir esta decisión: introducción de un backend remoto o de modos competitivos. En ese momento, mover la capa autoritativa a Rust/servidor y dejar el cliente como predictivo.
