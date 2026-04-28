# ADR-0002: Zustand con stores planos por feature

- **Estado:** Aceptada
- **Fecha:** 2026-04-27
- **Decisores:** @autor

## Contexto

La app necesita estado compartido entre vistas (timer corriendo, sesiones guardadas, ajustes de audio, lista de subjects, hearts totales) sin la complejidad de Redux. Cada feature vive en su propio `src/modules/<name>/` y debe exponer su estado de forma encapsulada.

## Decisión

Un store de Zustand por feature, declarado en `src/modules/<name>/<name>Store.ts` y reexportado por el barrel `src/modules/<name>/index.ts`. Sin combinar reducers, sin selectores complejos, sin middleware adicional salvo `persist` cuando la feature lo requiere (ej. settings).

Stores actuales:

- `timerStore` — estado del timer + transiciones idle/running/paused/finished + cálculo de hearts al `finish()`.
- `historyStore` — sesiones, hearts totales, hidratación desde Tauri.
- `audioStore` — música/ambient activos + estados de playlist.
- `settingsStore` — tema, idioma, volúmenes, sección activa (persistido).
- `subjectStore` — subjects de estudio del usuario.
- `lib/toast/toastStore` — notificaciones efímeras.

Las vistas leen con `useXxxStore(state => state.foo)` y mutan con `useXxxStore.getState().bar()` cuando se invoca fuera de React (servicios, otros stores).

## Consecuencias

### Positivas

- Cero boilerplate respecto a Redux.
- Cada feature owna su contrato; el barrel define la API pública.
- Tests unitarios triviales (`useXxxStore.setState({...})` y `useXxxStore.getState().method()`).
- Sin `Provider` wrapping para tests ni para `App.tsx`.

### Negativas

- Sin un único árbol de estado: depurar interacciones cross-store requiere conocer todos los stores involucrados.
- El acoplamiento se vuelve implícito: timer llama directamente a history y a audio. Documentado y testeado, pero no aislado por interfaces.

### Neutras

- Un futuro DevTools o time-travel implicaría añadir el middleware `devtools` por store.

## Alternativas consideradas

### Redux Toolkit

Más estructura, slices, DevTools out-of-the-box. Descartado: overkill para una app offline pequeña con menos de 10 stores y sin necesidad de tooling avanzado.

### React Context + useReducer

Suficiente para piezas pequeñas, pero re-renders y plumbing crecen rápido cuando hay 6+ stores con datos sin relación. Zustand evita el provider hell.

### Jotai / Recoil (atomic)

Ergonomía atractiva pero la app no tiene ese tipo de estado fragmentado; los stores son cohesivos por feature.

## Notas

- Cualquier nueva feature con estado compartido debe seguir el mismo patrón: archivo `<feature>Store.ts` + reexport en barrel.
- Si en el futuro un store crece > 250 líneas, evaluar split por sub-aspectos antes de introducir middleware más sofisticado.
