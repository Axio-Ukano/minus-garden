# ADR-0001: Política CSP explícita en Tauri

- **Estado:** Aceptada
- **Fecha:** 2026-04-27
- **Decisores:** @autor

## Contexto

`src-tauri/tauri.conf.json` traía `"csp": null`, aceptable para una app offline pero sin documentar como decisión consciente. El frontend usa:

- Fuente externa "Press Start 2P" desde `fonts.googleapis.com` (vía `@import` en `src/styles/global.css`).
- Estilos inline generados por React/Vite y por algunos componentes (`Panel.tsx`, etc.).
- Activos locales servidos por Tauri vía el esquema `asset:` y `https://asset.localhost`.
- IPC vía `ipc:` y `http://ipc.localhost`.

Sin CSP explícita, una futura inclusión de contenido remoto o dinámico sería vulnerable a XSS sin red de seguridad.

## Decisión

Definir una CSP positiva en `tauri.conf.json` que permita exactamente lo que la app usa hoy y bloquee todo lo demás:

```
default-src 'self';
img-src 'self' data: asset: https://asset.localhost;
media-src 'self' asset: https://asset.localhost;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' data: https://fonts.gstatic.com;
script-src 'self';
connect-src 'self' ipc: http://ipc.localhost
```

## Consecuencias

### Positivas

- Bloquea por defecto `script-src` ajeno a `'self'` — la base para defenderse de XSS si alguna vez entra contenido remoto.
- Sirve de documentación viva: leer la CSP dice qué orígenes carga la app.
- Permite que auditorías externas vean intención explícita en lugar de "null".

### Negativas

- `style-src 'unsafe-inline'` sigue abierto porque tanto Vite/React como BEM con estilos inline lo necesitan. Reducirlo requeriría adoptar nonces o eliminar todos los `style={...}`.
- El font-src de Google obliga a confiar en CDNs de terceros para obtener la tipografía.

### Neutras

- Cualquier nueva conexión externa (telemetría, fuentes adicionales, imágenes remotas) requerirá actualizar la CSP y registrar el cambio.

## Alternativas consideradas

### Mantener `csp: null`

Más laxo y "funciona". Descartado por ser opaco para revisores y no aportar defensa en profundidad.

### Autohospedar la fuente "Press Start 2P"

Vendrar el `.ttf`/`.woff2` en `public/` y eliminar `fonts.googleapis.com` y `fonts.gstatic.com` de la CSP. Es la siguiente iteración natural; queda como follow-up porque cambia el flujo de carga de la fuente y no era parte del alcance del sprint de tier S.

## Notas

- Smoke recomendado tras cualquier cambio: `pnpm tauri dev` y `pnpm tauri build`, validar que la fuente carga, los assets locales se ven y los toasts surgen tras un fallo de IPC simulado.
