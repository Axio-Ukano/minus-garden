# ADR-0008: Modo kiosko — la app es un juego, no una web

- **Estado:** Aceptada
- **Fecha:** 2026-06-09
- **Decisores:** @autor

## Contexto

Minu's Garden corre dentro de un webview de Tauri. Por defecto el webview filtra afordances de navegador que rompen la ilusión de juego: menú contextual con clic derecho ("Inspeccionar"), atajos de devtools (F12, Ctrl+Shift+I/J/C), "ver código fuente" (Ctrl+U), arrastre de imágenes y selección de texto en cualquier parte. El usuario pidió explícitamente que se comporte como un juego pese a su motor web.

## Decisión

Añadir `src/lib/kiosk.ts` con `initKiosk(document)`, instalado una vez en `main.tsx`, que:

- bloquea `contextmenu` (clic derecho),
- bloquea atajos de devtools / ver-fuente mediante un predicado puro `isBlockedKey` (F12, Ctrl/Cmd+Shift+I/J/C, Ctrl/Cmd+U),
- bloquea `dragstart` (arrastre de imágenes).

La selección de texto se suprime por CSS en `global.css` (`user-select: none` en `html/body` e `img`) y se reactiva solo en `input`, `textarea` y `[contenteditable]` para no romper la escritura. `isBlockedKey` se mantiene como función pura para poder testearla.

## Consecuencias

### Positivas

- La app se siente como juego: sin menú de navegador, sin inspección casual, sin selección/arrastre accidental.
- Lógica de bloqueo de teclas testeable de forma aislada; `initKiosk` devuelve teardown para los tests.

### Negativas

- No es una barrera de seguridad real: un usuario decidido aún puede inspeccionar (los bundles de producción de Tauri ya van sin devtools; estos guardas son sobre todo para `tauri dev`). Es UX, no hardening.
- Durante el desarrollo, abrir devtools dentro del webview requiere recordar que los atajos están interceptados (siguen disponibles desde fuera/menú del SO).

### Neutras

- La supresión de selección es por CSS; cualquier nuevo control que necesite selección debe optar de nuevo (como ya hacen los inputs).

## Alternativas consideradas

### Deshabilitar devtools solo en Rust/Tauri

Producción ya va sin devtools por defecto, así que no cubre el menú contextual ni el modo dev. Insuficiente por sí solo; los guardas JS son complementarios.

### No hacer nada (dejar afordances de navegador)

Rompe la experiencia de juego que el producto busca. Descartado por requisito explícito.

## Notas / referencias

- Implementación: `src/lib/kiosk.ts`, reglas CSS en `src/styles/global.css`, wiring en `src/main.tsx`.
