# Evidencia GA7-220501096-AA3-EV01

## Codificación de módulos con framework (React + Vite)

- **Aprendiz:** Carlos Pico
- **Programa:** Análisis y desarrollo de software
- **Código del programa de formación:** 228118
- **Número de ficha:** 3070224
- **Repositorio:** ver `REPO.txt`
- **Rama de trabajo:** `sena/evidencias`

## 1. Framework seleccionado

**React 19 + Vite 7**.

La guía en su sección 3.1 menciona explícitamente React entre los frameworks
de desarrollo ágil válidos para esta competencia:

> "...utilizando Framework para el desarrollo ágil entre los que se encuentran
> SprintBoot, **React**, Android, Swift del lado del servidor Node..."

## 2. Stack completo del proyecto formativo

| Capa              | Tecnología                            |
| ----------------- | ------------------------------------- |
| Framework UI      | React 19                              |
| Lenguaje frontend | TypeScript 5.8 (strict)               |
| Bundler           | Vite 7                                |
| Estilos           | CSS Vanilla (Custom Properties + BEM) |
| Desktop shell     | Tauri 2                               |
| Backend nativo    | Rust (edition 2021)                   |
| Backend REST      | Node.js + Express (sena-backend/)     |
| Base de datos     | SQLite                                |
| Estado global     | Zustand 5                             |

(Detalle: `docs/architecture.md`).

## 3. Características de React utilizadas

| Característica               | Dónde se demuestra                                              |
| ---------------------------- | --------------------------------------------------------------- |
| Componentes funcionales      | Todos los archivos en `src/components/` y `src/modules/`        |
| Hooks (useState, useEffect)  | `src/features/sena/components/PlantManager.tsx`                 |
| useCallback                  | `PlantManager.tsx`                                              |
| JSX                          | Toda la UI                                                      |
| Props tipadas con TypeScript | Interfaces en cada componente                                   |
| Eventos sintéticos           | `onChange`, `onSubmit`, `onClick` en `PlantManager`, `AuthDemo` |
| Renderizado condicional      | `App.tsx` (navegación por tabs)                                 |
| Listas con `.map()` + `key`  | `PlantManager.tsx` (tabla de plantas)                           |

## 4. Estándares de codificación cumplidos

- camelCase para variables y funciones
- PascalCase para componentes
- kebab-case para archivos
- TSDoc en componentes nuevos
- ESLint en `error` para `no-explicit-any`, `no-floating-promises`,
  `import/no-cycle`, `react-hooks/rules-of-hooks`
- Prettier obligatorio en pre-commit

## 5. Comentarios en el código

Todos los archivos nuevos del módulo `src/features/sena/` tienen comentarios
TSDoc explicando propósito, parámetros y retorno de cada función/componente.

## 6. Versionamiento

Rama `sena/evidencias` con 6 commits estructurados.

## 7. Cómo ejecutar

```bash
pnpm install
pnpm dev
# Abrir http://localhost:1420
```

## 8. Archivos clave para la revisión

- `package.json` — declara React 19 + Vite 7
- `vite.config.ts` — configuración del bundler
- `tsconfig.json` — TypeScript strict
- `src/App.tsx` — entrada de la aplicación
- `src/features/sena/` — módulo creado para la evidencia
- `src/modules/` — módulos del proyecto formativo existentes
- `docs/architecture.md` — descripción completa del stack
