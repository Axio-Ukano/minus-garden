# Evidencia GA7-220501096-AA4-EV03

## Componente frontend del proyecto formativo y proyectos de clase

- **Aprendiz:** Carlos Pico
- **Programa:** Análisis y desarrollo de software
- **Código del programa de formación:** 228118
- **Número de ficha:** 3070224
- **Repositorio:** ver `REPO.txt`
- **Rama de trabajo:** `sena/evidencias`

## 1. Componentes React entregados

### 1.1 Componentes nuevos creados para esta evidencia

- **`src/features/sena/SenaDemo.tsx`** — Página contenedora con header y
  navegación interna entre el gestor de plantas y la demo de autenticación.

- **`src/features/sena/components/PlantManager.tsx`** — CRUD completo de
  plantas. Demuestra: `useState`, `useEffect`, `useCallback`, formulario
  controlado, lista renderizada con `.map()`, edición in-place,
  eliminación con confirmación, validaciones de cliente, consumo REST.

- **`src/features/sena/components/AuthDemo.tsx`** — Tabs de registro y
  login. Demuestra: estado múltiple, formularios independientes,
  validaciones (longitud, formato email), manejo de respuesta del backend.

- **`src/features/sena/api/plantsApi.ts`** y **`authApi.ts`** — Clientes
  HTTP tipados (TypeScript) que consumen el backend REST.

### 1.2 Componentes existentes del proyecto formativo

Todo el directorio `src/` contiene el proyecto Minus Garden ya implementado
en React 19:

- `src/components/` — primitivas UI reutilizables (Panel, Tooltip, Input,
  PixelIcons, etc.)
- `src/modules/timer/` — temporizador Pomodoro
- `src/modules/history/` — historial de sesiones
- `src/modules/music/` — reproductor de música
- `src/modules/plants/` — modelos visuales de plantas (10 especies)
- `src/modules/settings/` — modal de ajustes
- `src/modules/audio/` — servicio de audio (Howler)

## 2. Características de React demostradas

| Característica          | Ejemplo concreto                                 |
| ----------------------- | ------------------------------------------------ |
| Componente funcional    | `PlantManager`, `AuthDemo`, `SenaDemo`           |
| Hooks de estado         | `useState<SenaPlant[]>([])` en `PlantManager`    |
| Hooks de efecto         | `useEffect(() => { void refresh() }, [refresh])` |
| Hooks de memorización   | `useCallback(async () => {...}, [])`             |
| Eventos                 | `onChange`, `onSubmit`, `onClick` en formularios |
| Renderizado condicional | `editingId === null ? "Crear" : "Editar"`        |
| Listas con key          | `plants.map(plant => <tr key={plant.id}>...)`    |
| Props tipadas           | Interfaces `SenaPlant`, `SenaPlantInput`         |
| Children y composición  | `SenaDemo` compone `PlantManager` y `AuthDemo`   |

## 3. Comentarios en el código

Cada componente nuevo tiene un bloque TSDoc al inicio que explica qué
demuestra y a qué evidencia corresponde. Cada función relevante tiene
su propia documentación.

## 4. Estándares de codificación

- camelCase para variables y funciones
- PascalCase para componentes
- kebab-case para archivos
- ESLint en `error` para `no-explicit-any`, `no-floating-promises`,
  `import/no-cycle`, `react-hooks/rules-of-hooks`
- Prettier obligatorio (pre-commit hook)
- Boundaries de módulos vigilados por `no-restricted-imports`

## 5. Versionamiento

Rama `sena/evidencias` con commits descriptivos en Conventional Commits.

## 6. Cómo ejecutar

```bash
pnpm install
pnpm dev
# Abrir http://localhost:1420 → pestaña "SENA" en el nav inferior
```

## 7. Archivos clave para la revisión

- `src/features/sena/SenaDemo.tsx`
- `src/features/sena/components/PlantManager.tsx`
- `src/features/sena/components/AuthDemo.tsx`
- `src/features/sena/api/plantsApi.ts`
- `src/features/sena/api/authApi.ts`
- `src/App.tsx` — integración del módulo SENA como pestaña
- `package.json` — declaración del framework
- `docs/architecture.md` — descripción detallada del stack
