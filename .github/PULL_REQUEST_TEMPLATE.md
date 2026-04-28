# Resumen

<!-- Qué cambia y por qué (1-3 líneas). -->

## Tipo de cambio

- [ ] feat — nueva feature
- [ ] fix — bug
- [ ] refactor — sin cambio funcional
- [ ] chore / build / ci — tooling, deps, configuración
- [ ] docs — solo documentación
- [ ] test — añade o ajusta tests

## Checklist

- [ ] `pnpm validate` pasa (typecheck + lint + format:check).
- [ ] `pnpm circular` sin ciclos nuevos.
- [ ] `pnpm test:coverage` cumple el umbral configurado (60%).
- [ ] `pnpm build` verde.
- [ ] Si toca UI: smoke manual (timer → guardar → history → hearts).
- [ ] Si introduce decisión arquitectónica: añade un ADR en `docs/adr/`.
- [ ] Si toca dependencias: justificadas y movidas al bucket correcto
      (`dependencies` vs `devDependencies`).
- [ ] CHANGELOG actualizado bajo `## [Unreleased]` cuando aplique.

## Capturas / video (si afecta UI)

<!-- Pega aquí el antes/después o un GIF. -->

## Notas para el reviewer

<!-- Áreas en las que quieres atención específica, dudas, follow-ups. -->
