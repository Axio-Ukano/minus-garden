# minu-garden — Vision

## Descripción

**minu-garden** es una app de escritorio offline diseñada para acompañar sesiones de estudio de Minu. Combina un timer de estudio con una economía de corazones 💗 y un jardín virtual que crece a medida que se estudia.

## Concepto central

Estudiar → ganar corazones → comprar plantas y flores → ver el jardín crecer. El jardín refleja visualmente el esfuerzo acumulado, y pequeños mini-juegos estilo Adorable Home (organizar cosas, cuidar plantas, mini-tareas cortas) hacen que las pausas sean divertidas.

## Stack técnico

| Capa           | Tecnología                |
| -------------- | ------------------------- |
| UI             | React + TypeScript        |
| Estilos        | Tailwind CSS v4           |
| Desktop shell  | Tauri 2                   |
| Backend nativo | Rust                      |
| Base de datos  | SQLite (via Tauri plugin) |
| Estado         | Zustand                   |

## Plataforma

- **Target:** Desktop (Windows y macOS)
- **Modo:** Offline-first — no requiere conexión a internet
- **Distribución:** Binario instalable local

## No-goals para v1

- Sin login ni cuentas de usuario
- Sin sincronización en la nube
- Sin pagos ni monetización
- Sin versión móvil
- Sin multijugador
