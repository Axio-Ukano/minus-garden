# Playbook operativo post tier S

> Documento canónico de "qué hago, en qué orden, con qué comando" para todo trabajo en el repo a partir de v0.5.0. Vive aquí; `README.md` y `CONTRIBUTING.md` solo enlazan a este archivo.

---

## 0. Setup por máquina (una sola vez)

```bash
pnpm install      # instala deps + activa hooks pre-commit (lint-staged)
gh auth status    # confirmar autenticación de GitHub CLI
pnpm validate     # debe pasar en main antes de empezar a tocar nada
```

Si `pnpm install` no activa los hooks (poco común), correr `pnpm exec simple-git-hooks` manualmente.

VS Code instala automáticamente las extensiones recomendadas (`tauri-vscode`, `rust-analyzer`, `vscode-eslint`, `prettier-vscode`) la primera vez que abres el repo.

---

## 1. Inicio de sesión de trabajo

```bash
git checkout main
git pull --ff-only
git fetch --tags
```

Verificar que el árbol esté limpio (`git status` vacío). Si no, decidir: stash, commit, o discard antes de empezar.

---

## 2. Crear rama

Naming obligatorio:

| Prefijo     | Para qué                                        |
| ----------- | ----------------------------------------------- |
| `feat/`     | nueva feature visible para el usuario           |
| `fix/`      | bug fix                                         |
| `refactor/` | reestructuración sin cambio funcional           |
| `chore/`    | tooling, deps, configuración, build             |
| `docs/`     | solo documentación                              |
| `test/`     | añadir o ajustar tests sin tocar código de prod |
| `ci/`       | workflows de GitHub Actions                     |

```bash
git checkout -b <prefijo>/<scope-corto>
# ejemplos:
git checkout -b feat/notification-on-finish
git checkout -b fix/history-view-empty-state
git checkout -b chore/bump-tauri-2.1
```

---

## 3. Durante el desarrollo

### Loop interno

```bash
pnpm dev          # iteración rápida del frontend (sin Tauri)
pnpm tauri dev    # iteración con la app real (más pesada pero refleja IPC y CSP)
pnpm test:watch   # tests en vivo si tocas stores/lib
pnpm typecheck    # verificación rápida del tipado
```

### Commits

- Conventional Commits **en inglés** (alineado con el historial).
- Un objetivo por commit. Si tocas dos cosas, parte el commit.
- `git commit -m "feat(scope): subject ≤ 72 chars"` — el cuerpo del commit es para el "por qué", no el "qué".
- El hook pre-commit corre automáticamente:
  1. `eslint --fix --max-warnings=0` sobre archivos `*.ts|*.tsx` staged.
  2. `prettier --write` sobre `*.{ts,tsx,js,json,css,md,yml,yaml}` staged.
- Si el hook falla: **arreglar la causa**. No usar `--no-verify`.

### Reglas no negociables del código

- Sin `any` (`@typescript-eslint/no-explicit-any: error`).
- Sin variables o parámetros sin usar (`no-unused-vars: error`, ignora `^_`).
- Promesas no awaited deben llevar `void`, `.catch(...)` o ser `await`-eadas.
- Imports cross-módulo solo desde el barrel: `@/modules/<name>`. Imports profundos (`@/modules/<name>/<archivo>`) están bloqueados por ESLint.
- Imports intra-módulo: relativos (`./...`, `../...`).
- Sin dependencias circulares.
- TypeScript strict + `noUncheckedIndexedAccess`: cualquier acceso por índice o por key dinámica devuelve `T | undefined`; manejarlo con guard explícito o `?? fallback`.

---

## 4. Antes de abrir el PR — gate local

Correr **todo** en este orden y hasta que pase verde:

```bash
pnpm install --frozen-lockfile     # solo si tocaste deps; valida lockfile en el clon limpio
pnpm validate                       # typecheck + lint + format:check
pnpm circular                       # 0 ciclos
pnpm test:coverage                  # tests + cobertura ≥ 60% en módulos cubiertos
pnpm build                          # tsc + vite build
```

Si tocas UI o IPC, **smoke manual obligatorio** con la app real:

```bash
pnpm tauri dev
```

Ruta de smoke mínima:

1. Crear sesión de 1 minuto, dejar correr, confirmar que llega a `finished`.
2. Verificar que aparece en `History` y que el contador de hearts subió en el header.
3. Cambiar idioma EN/ES en `Settings`; confirmar que el header y `History` se traducen.
4. Probar volúmenes en `Settings` (master, music, ambient, sfx); cerrar y reabrir; deben persistir.
5. Iniciar/pausar la música en el `MiniPlayer`; cambiar de track.
6. Si tocaste backend o CSP: forzar un error (apagar la BD a mano o renombrar el `.db`) y confirmar que se ve un toast de error en lugar de crash.

Si algo de esto rompe, no abres el PR — investigas la causa primero.

---

## 5. Documentación que se actualiza dentro del mismo PR

| Cuando cambias…                                | Actualizas…                                                           |
| ---------------------------------------------- | --------------------------------------------------------------------- |
| estructura de carpetas o capas                 | `docs/architecture.md`                                                |
| comandos Tauri o esquema SQLite                | `docs/architecture.md` + ADR si la firma cambia                       |
| dependencias top-level (frontend o Rust)       | `package.json` / `Cargo.toml` + ADR si la decisión no es obvia        |
| boundaries entre módulos o reglas de ESLint    | `docs/architecture.md` + ADR                                          |
| stack visible (React/Vite/Tauri/Tailwind/...)  | `README.md` y `docs/architecture.md`                                  |
| scripts en `package.json`                      | `README.md`                                                           |
| el alcance de un sprint                        | `docs/requirements.md`                                                |
| cualquier cosa que merezca trazabilidad futura | nuevo `docs/adr/NNNN-<slug>.md` basado en `docs/adr/0000-template.md` |
| comportamiento visible para el usuario         | `CHANGELOG.md` bajo `## [Unreleased]` o la versión nueva              |

### Cuándo crear un ADR (regla práctica)

Si tu cambio responde "sí" a alguna de estas, hace falta ADR:

- ¿Añade o quita una dependencia top-level?
- ¿Cambia un boundary entre módulos?
- ¿Modifica el bridge Tauri o la firma pública de un comando?
- ¿Cambia el esquema SQLite (incluye plan de migración)?
- ¿Toma una decisión técnica que querré entender de aquí a 6 meses sin leer todo el diff?

Numeración: el siguiente entero libre tras el último ADR.

---

## 6. Estrategia de versionado y CHANGELOG

### Versionado SemVer

| Tipo de cambio                                        | Bump  |
| ----------------------------------------------------- | ----- |
| Romper compatibilidad pública (esquema, comando, IPC) | major |
| Añadir feature visible sin romper                     | minor |
| Bug fixes, polish, tooling, docs                      | patch |

Tres archivos a sincronizar SIEMPRE en el commit `chore(release): bump to X.Y.Z`:

- `package.json` (`"version"`)
- `src-tauri/Cargo.toml` (`version = "..."`)
- `src-tauri/tauri.conf.json` (`"version": "..."`)

### CHANGELOG.md

- Una entrada por release.
- Idioma: **español** (consistente con el resto de docs).
- Formato Keep a Changelog 1.1.0 con secciones `Añadido / Cambiado / Corregido / Eliminado` (en ese orden).
- Mientras desarrollas, opcionalmente acumular notas en `## [Unreleased]` y al cerrar release renombrarlo a `## [X.Y.Z] — YYYY-MM-DD`.
- Cada entrada debe poder leerse sin abrir el diff: di qué cambió y por qué importa.

### Cuándo bumpear

- Bumpeas en el último commit del PR (`chore(release): bump to X.Y.Z`) cuando ese PR cierra una unidad de trabajo "lanzable".
- PRs internos puramente de tooling pueden NO bumpear (queda como `[Unreleased]`).
- Tier S, refactors visibles, features nuevas → sí bumpean.

---

## 7. Abrir el PR

```bash
git push -u origin <branch>
gh pr create --base main --head <branch> --title "<conv-commit-style title>" --body "<resumen>"
```

El cuerpo debe seguir `.github/PULL_REQUEST_TEMPLATE.md`:

- Resumen 1-3 líneas.
- Tipo de cambio (checkboxes).
- Checklist de validación (todos verdes).
- Capturas/video si afectó UI.
- Notas para el reviewer.

Si quieres pre-llenar checkboxes, pasa el body completo con `--body "$(cat <<'EOF' ... EOF)"`.

---

## 8. Esperar CI

```bash
gh pr checks <PR#> --watch
```

Workflow `validate.yml` corre: `pnpm install --frozen-lockfile` → `typecheck` → `lint` → `format:check` → `circular` → `test:coverage` → `build`. Tarda ~1 minuto.

Si CI rompe en algo que no falla en local, casi siempre es:

- `pnpm install --frozen-lockfile` rechaza el lockfile (deps drift) → resolver localmente, recommit.
- Diferencia de plataforma (Windows local vs Ubuntu CI): paths con `\` vs `/`, line endings, case-sensitive resolves.
- Coverage threshold rota porque el `include` no contempla un archivo nuevo.

Arreglar y re-pushear; **no** mergear hasta verde.

---

## 9. Merge

```bash
gh pr merge <PR#> --merge --delete-branch
```

- `--merge` (no `--squash`, no `--rebase`): preserva los commits atómicos en `main` para que cada uno sea cherry-pickable y revertible con `git revert <hash>`.
- `--delete-branch`: borra la rama remota y local automáticamente.

Casos donde sí usar squash: PRs con commits de "fix prettier", "fix lint", "wip" sin valor histórico. La regla de oro es: si los commits no se merecen vivir en el log de `main`, squashea.

---

## 10. Post-merge

```bash
git checkout main
git pull --ff-only
```

### Si el PR bumpeó versión

```bash
# 1. Tag en el merge commit (HEAD de main)
git tag -a vX.Y.Z -m "vX.Y.Z — <título corto del release>"
git push origin vX.Y.Z

# 2. Crear el release en GitHub copiando la sección del CHANGELOG
gh release create vX.Y.Z --target main --title "vX.Y.Z — <título>" --notes "<contenido>"
# o más cómodo, leer del CHANGELOG:
gh release create vX.Y.Z --target main --title "vX.Y.Z — <título>" --notes-file CHANGELOG.md   # cortar luego en GitHub UI
```

### Si NO bumpeó versión

Nada extra. El siguiente PR que cierre una unidad de release recogerá las notas pendientes.

---

## 11. Hotfix flow

Si descubres un bug crítico en `main` después de release:

```bash
git checkout main && git pull
git checkout -b fix/<scope-corto>
# arreglar + commit + tests
pnpm validate && pnpm test:coverage && pnpm build
git push -u origin fix/<scope>
gh pr create --base main --head fix/<scope> --title "fix(scope): ..."
gh pr checks <PR#> --watch
gh pr merge <PR#> --merge --delete-branch
git checkout main && git pull
# bump patch
# editar package.json + Cargo.toml + tauri.conf.json a X.Y.(Z+1)
# editar CHANGELOG con entrada nueva
git add -A && git commit -m "chore(release): bump to X.Y.Z+1"
# tag + release igual que en sección 10
```

---

## 12. Rollback

### Revertir un commit ya en `main`

```bash
git checkout main && git pull
git revert <commit-sha>
git push origin main
```

Si el commit fue parte de un PR mergeado con merge commit: `git revert -m 1 <merge-sha>`.

### Borrar un tag mal puesto

```bash
git tag -d vX.Y.Z
git push origin :refs/tags/vX.Y.Z
gh release delete vX.Y.Z --yes
```

---

## 13. Checklist consolidado por PR

Imprime esta lista mentalmente antes de cada PR:

- [ ] Salí de `main` actualizado y creé rama con prefijo correcto.
- [ ] Commits atómicos, Conventional Commits, en inglés.
- [ ] `pnpm validate` verde.
- [ ] `pnpm circular` 0 ciclos.
- [ ] `pnpm test:coverage` ≥ 60% en módulos cubiertos; tests nuevos para lógica nueva.
- [ ] `pnpm build` verde.
- [ ] Smoke manual con `pnpm tauri dev` si tocaste UI/IPC/CSP.
- [ ] Docs actualizados (README/architecture/requirements/ADR según tabla §5).
- [ ] CHANGELOG actualizado (en español).
- [ ] PR abierto con plantilla; título Conventional Commits.
- [ ] CI verde antes de merge.
- [ ] Merge con `--merge` (no squash) salvo PRs de WIP / fixups.
- [ ] Si bumpé versión: tag + GitHub release.
- [ ] `git checkout main && git pull` para cerrar la sesión.

---

## 14. Diferimientos vivos (NO hacer hasta que aplique)

Estos están registrados como decisiones conscientes en ADRs y `docs/requirements.md`:

- **Tests E2E con Playwright** — cuando haya 2 vistas críticas que se rompen entre sí.
- **`tauri-plugin-log`** — cuando se distribuya fuera de uso personal.
- **`manualChunks` en Vite** — solo si bundle gzip supera 200 KB.
- **Autohospedar la fuente "Press Start 2P"** — para cerrar `font-src` a `'self'` y simplificar la CSP.
- **Puerto `SessionRecorder`** — solo si crece el acoplamiento timer ⇄ history.
- **Split de `SoundSection.tsx`** — al añadir nueva sub-feature.
- **Refactor de `App.tsx` a router-map** — al añadir 3ª/4ª vista.
- **Branch protection en `main`** — bloqueado por plan de GitHub. Activar manualmente cuando el repo pase a Pro o público (Settings → Branches → exigir el check `typecheck + lint + format + circular + test + build`).

Antes de abrir un PR sobre cualquiera de estos, releer el ADR correspondiente y confirmar que la condición de disparo se cumple.

---

## 15. Glosario rápido de comandos

```bash
pnpm dev                # Vite sin Tauri
pnpm tauri dev          # app de escritorio con HMR
pnpm build              # tsc + vite build (frontend prod)
pnpm tauri build        # bundle nativo

pnpm typecheck          # tsc --noEmit
pnpm lint               # ESLint
pnpm lint:fix           # ESLint --fix
pnpm format             # Prettier --write
pnpm format:check       # Prettier --check
pnpm validate           # typecheck + lint + format:check
pnpm circular           # madge --circular
pnpm test               # vitest run
pnpm test:watch         # vitest watch
pnpm test:coverage      # vitest run --coverage (gating ≥60%)

gh pr create --base main --head <branch>
gh pr checks <PR#> --watch
gh pr merge <PR#> --merge --delete-branch
gh release create vX.Y.Z --target main --title "..." --notes "..."
git tag -a vX.Y.Z -m "..."  &&  git push origin vX.Y.Z
```
