# Minu's Garden - Requirements

## MVP v0.1 — Funcionalidad base

### Timer de estudio

- [x] Timer configurable (Duraciones: 5, 10, 15, 25, 50 min)
- [x] Inicio, pausa y reset
- [x] Registro automático de sesión al completar
- [x] Campo de materia/tema con autocompletado y colores

### Economía de corazones 💗

- [x] Ganar corazones al completar sesiones de estudio
- [x] Fórmula base: 1 corazón por cada 5 min completados
- [x] Balance de corazones visible en todo momento
- [x] Persistencia en SQLite (User State)

### Jardín virtual

- [ ] Vista de jardín con slots fijos (ej. 6–9 posiciones)
- [x] Plantas disponibles (Margarita, Girasol)
- [ ] Comprar plantas con corazones
- [x] Las plantas tienen niveles de crecimiento (semilla → brote → planta)
- [x] Crecer con el tiempo / sesiones completadas

### Historial

- [x] Lista de sesiones completadas
- [x] Fecha, duración, materia y corazones ganados por sesión
- [x] Eliminación de sesiones individuales

---

## v0.2 — Mejoras y contenido

### Sonidos y Ambiente

- [x] Sonidos ambientes (Lluvia, Bosque, Café, Chimenea, Ruido Blanco)
- [x] Música Lofi integrada con playlist (6 tracks)
- [x] Efectos de sonido (SFX) para botones y timer
- [x] Mezclador de volumen independiente para Master, Música, Ambiente y SFX

### Personalización y UX

- [x] Modo Oscuro (Dark Mode) nativo
- [x] Posicionamiento de la planta (Izquierda / Derecha)
- [x] Cursores pixel-art personalizados
- [x] Error Boundary para manejo de fallos
- [ ] Notificaciones de escritorio al terminar sesión
- [ ] Modo compacto (ventana pequeña solo con timer)

