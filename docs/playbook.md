# Playbook operativo — minus-garden

> Documento canónico de "qué hago, en qué orden, con qué comando" para todo trabajo en el repo. Vive aquí; `README.md` y `CONTRIBUTING.md` solo enlazan a este archivo.
>
> **Desde mayo 2026 el repo es público**, con branch protection en `main`: squash-only merging, checks de CI requeridos, sin push directo ni bypass. Todo cambio pasa por PR.

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

> **⚠ Con squash merge, el título del PR es lo que llega a `main`** (no los commits individuales). Los commits de la rama son útiles para el review, pero release-please solo ve el commit squasheado — cuyo mensaje es el título del PR. Por eso el título **debe** seguir Conventional Commits: `feat(scope): ...`, `fix(scope): ...`, etc.

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

| Cuando cambias…                                | Actualizas…                                                                                          |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| estructura de carpetas o capas                 | `docs/architecture.md`                                                                               |
| comandos Tauri o esquema SQLite                | `docs/architecture.md` + ADR si la firma cambia                                                      |
| dependencias top-level (frontend o Rust)       | `package.json` / `Cargo.toml` + ADR si la decisión no es obvia                                       |
| boundaries entre módulos o reglas de ESLint    | `docs/architecture.md` + ADR                                                                         |
| stack visible (React/Vite/Tauri/Tailwind/...)  | `README.md` y `docs/architecture.md`                                                                 |
| scripts en `package.json`                      | `README.md`                                                                                          |
| el alcance de un sprint                        | `docs/requirements.md`                                                                               |
| cualquier cosa que merezca trazabilidad futura | nuevo `docs/adr/NNNN-<slug>.md` basado en `docs/adr/0000-template.md`                                |
| comportamiento visible para el usuario         | mensaje del commit (`feat:` / `fix:`) con descripción legible — release-please lo lleva al CHANGELOG |

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

El versionado y el `CHANGELOG.md` los gestiona [release-please](https://github.com/googleapis/release-please) automáticamente desde el merge a `main`. La única regla del autor es escribir Conventional Commits **en inglés** correctamente: release-please se encarga de calcular el bump, sincronizar `package.json`, `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json` y reescribir `CHANGELOG.md`.

### Tabla de bumps (mientras estemos en `0.x`)

| Prefijo de commit                                     | Bump                             | Aparece en CHANGELOG bajo |
| ----------------------------------------------------- | -------------------------------- | ------------------------- |
| `fix:`                                                | patch                            | Corregido                 |
| `feat:`                                               | minor                            | Añadido                   |
| `feat!:` o `BREAKING CHANGE:` en el cuerpo            | minor en `0.x` · major en `1.0+` | Añadido                   |
| `perf:`, `refactor:`, `deps:`                         | sin bump                         | Cambiado                  |
| `revert:`                                             | sin bump                         | Eliminado                 |
| `chore:`, `docs:`, `test:`, `ci:`, `build:`, `style:` | sin bump                         | (oculto)                  |

`bump-minor-pre-major: true` y `bump-patch-for-minor-pre-major: false` están definidos en `release-please-config.json`: mientras la versión sea `0.x`, un `feat:` bumpea minor (no patch) y un breaking change bumpea minor (no major). Al pasar a `1.0` se invierte la regla — borrar esa flag entonces.

### CHANGELOG.md

- Generado automáticamente por release-please. Está en `.prettierignore` para no pelearse con el formato del bot.
- Idioma: **español**. Los labels de sección (`Añadido / Cambiado / Corregido / Eliminado`) vienen de `changelog-sections` en `release-please-config.json`. La cabecera del archivo (todo el texto sobre la primera entrada `## [X.Y.Z]`) se preserva intacta — release-please solo inserta entradas nuevas debajo, nunca sobrescribe esa cabecera. Por eso `# Changelog` y la nota de "basado en Keep a Changelog 1.1.0" siguen en español.
- Los bullets dentro de cada entrada salen del subject de cada commit y por tanto están en inglés (consistente con la regla de Conventional Commits en inglés del §3). Se acepta esa mezcla.
- El historial pre-`0.5.0` es manual y queda intacto debajo de las nuevas entradas auto-generadas.

### Flujo de versionado

1. Mergeas un PR cualquiera a `main` con commits en inglés Conventional Commits.
2. Si esos commits justifican un bump (`feat:`, `fix:`, breaking change), `release-please.yml` abre o actualiza un PR titulado `chore(main): release X.Y.Z` con todos los archivos sincronizados.
3. Tú revisas ese PR (es legible: tiene el `CHANGELOG.md` en español listo). Si está bien, lo mergeas.
4. Al mergear, el workflow crea el tag `vX.Y.Z` y el GitHub Release automáticamente.
5. Si el PR original solo tenía `chore`/`docs`/`test`/`ci`/`build`/`style`, no pasa nada — el siguiente PR con un `feat`/`fix` recogerá las notas pendientes.

---

## 7. Abrir el PR

```bash
git push -u origin <branch>
gh pr create --base main --head <branch> --title "<conv-commit-style title>" --body "<resumen>"
```

**El título del PR es crítico**: como main usa squash merge, el título se convierte en el único commit en `main`. release-please lo parsea para decidir el bump. Asegúrate de que siga Conventional Commits: `feat(timer): add pause shortcut`, `fix(audio): prevent double-play on unmount`, etc.

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

**Branch protection exige checks verdes** — el botón de merge estará bloqueado hasta que CI pase. No hay bypass posible, ni siquiera para admins.

Si CI rompe en algo que no falla en local, casi siempre es:

- `pnpm install --frozen-lockfile` rechaza el lockfile (deps drift) → resolver localmente, recommit.
- Diferencia de plataforma (Windows local vs Ubuntu CI): paths con `\` vs `/`, line endings, case-sensitive resolves.
- Coverage threshold rota porque el `include` no contempla un archivo nuevo.

Arreglar y re-pushear.

---

## 9. Merge

```bash
gh pr merge <PR#> --squash --delete-branch
```

- `--squash` es la **única estrategia habilitada** en el repo. Merge commits y rebase están desactivados en Settings → General.
- Todos los commits de la rama se comprimen en uno solo cuyo mensaje es el título del PR. El historial de `main` queda lineal: un commit = un PR = una unidad de cambio.
- `--delete-branch`: borra la rama remota (la rama también se elimina automáticamente por configuración del repo, pero el flag limpia la referencia local).

> **Consecuencia para release-please**: como cada PR produce un solo commit en `main`, el título del PR (que se convierte en el mensaje del commit squasheado) es lo que release-please parsea. Un PR con título `feat(garden): add watering animation` genera un minor bump. Uno con `chore: update deps` no genera bump.

---

## 10. Post-merge

```bash
git checkout main
git pull --ff-only
```

### El workflow `release-please` corre solo

Tras el merge (squash) a `main`, `.github/workflows/release-please.yml` ejecuta y, si el commit squasheado justifica un bump (por su título/prefijo), abre (o actualiza) un PR titulado `chore(main): release X.Y.Z`.

Ese PR ya trae:

- `package.json` bumpeado.
- `src-tauri/Cargo.toml` bumpeado.
- `src-tauri/tauri.conf.json` bumpeado.
- `CHANGELOG.md` con la nueva entrada en español.

Lo único que tienes que hacer:

1. Revisar el PR de release. Si las notas del CHANGELOG no se leen bien, edita el título del PR original (lo que quedó como commit en `main`) — release-please regenerará el CHANGELOG en su próximo run.
2. `gh pr merge <PR#> --squash --delete-branch` el PR de release.
3. Al mergearse, el workflow crea automáticamente el tag `vX.Y.Z` y el GitHub Release.

### `Cargo.lock` se sincroniza solo

El workflow `release-please.yml` incluye un step que sincroniza `Cargo.lock` automáticamente dentro del PR de release (usando `sed`, sin necesidad de instalar Rust en CI). Cuando revisas el PR de release, `Cargo.lock` ya está actualizado — no hay que hacer nada manual.

### Si el PR no bumpeó versión

Nada extra. El siguiente PR que cierre una unidad de release con `feat:` o `fix:` recogerá las notas pendientes.

---

## 11. Hotfix flow

Si descubres un bug crítico en `main` después de release:

```bash
git checkout main && git pull
git checkout -b fix/<scope-corto>
# arreglar + commit con prefijo fix: + tests
pnpm validate && pnpm test:coverage && pnpm build
git push -u origin fix/<scope>
gh pr create --base main --head fix/<scope> --title "fix(scope): describe the fix"
gh pr checks <PR#> --watch
gh pr merge <PR#> --squash --delete-branch
```

El título del PR (`fix(scope): ...`) será el commit squasheado en `main`. release-please lo verá como `fix:`, abrirá el PR `chore(main): release X.Y.(Z+1)` con los archivos sincronizados y el CHANGELOG. Mergeas ese PR y el tag/release patch sale solo (ver §10).

---

## 12. Rollback

### Revertir un commit ya en `main`

Como no se puede push directo a `main`, el revert va por PR:

```bash
git checkout main && git pull
git checkout -b revert/<scope>
git revert <commit-sha>
git push -u origin revert/<scope>
gh pr create --title "revert(scope): undo <descripción>" --body "Reverts <commit-sha>."
gh pr checks <PR#> --watch
gh pr merge <PR#> --squash --delete-branch
```

Como main usa squash (no merge commits), todos los commits en `main` son directos — no necesitas `-m 1`.

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
- [ ] **Título del PR en Conventional Commits** — es el commit que llega a `main` y lo que release-please parsea.
- [ ] `pnpm validate` verde.
- [ ] `pnpm circular` 0 ciclos.
- [ ] `pnpm test:coverage` ≥ 60% en módulos cubiertos; tests nuevos para lógica nueva.
- [ ] `pnpm build` verde.
- [ ] Smoke manual con `pnpm tauri dev` si tocaste UI/IPC/CSP.
- [ ] Docs actualizados (README/architecture/requirements/ADR según tabla §5).
- [ ] CI verde (branch protection bloquea el merge si no).
- [ ] Merge con `--squash` (única estrategia habilitada).
- [ ] `git checkout main && git pull` para cerrar la sesión.
- [ ] Si release-please abrió `chore(main): release X.Y.Z`, mergearlo cuando esté listo.

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
gh pr merge <PR#> --squash --delete-branch

# Releases: lo hace release-please en CI. Solo para rescate manual:
gh release create vX.Y.Z --target main --title "..." --notes "..."
git tag -a vX.Y.Z -m "..."  &&  git push origin vX.Y.Z
```
