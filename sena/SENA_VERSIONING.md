# Control de Versionamiento — SENA GA7 (AA1-EV05)

> Documento de evidencia para la actividad **AA1-EV05** del programa
> SENA GA7-220501096. El propio repositorio Git y su historial sirven como
> evidencia ejecutiva; este archivo describe las herramientas, comandos y
> flujo de trabajo utilizado.

## Herramienta utilizada

- **Git** (local) + **GitHub** (remoto).
- Repositorio: <https://github.com/Axio-Ukano/minus-garden>
- Rama principal (estable): `main`
- Rama de trabajo SENA: `sena/evidencias`

## Comandos utilizados en este proyecto

| Comando                           | Descripción                                       |
| --------------------------------- | ------------------------------------------------- |
| `git checkout -b sena/evidencias` | Crear la rama de trabajo desde `main`             |
| `git status`                      | Ver el estado del directorio de trabajo y staging |
| `git diff`                        | Ver cambios no confirmados                        |
| `git add <ruta>`                  | Agregar archivos al staging                       |
| `git commit -m "feat(sena): ..."` | Confirmar cambios con mensaje descriptivo         |
| `git log --oneline`               | Ver historial de commits resumido                 |
| `git remote -v`                   | Ver repositorios remotos configurados             |
| `git push origin sena/evidencias` | Subir los cambios al repositorio remoto           |

## Convención de mensajes de commit

Se sigue el patrón [Conventional Commits](https://www.conventionalcommits.org/)
con el prefijo de scope `sena` para distinguir los cambios de evidencia:

- `feat(sena): ...` — nueva funcionalidad o módulo de evidencia.
- `docs(sena): ...` — sólo documentación.
- `fix(sena): ...` — corrección de bugs.

## Flujo de trabajo seguido

1. Se parte de la rama `main` (estable, ya releasada como v0.5.3).
2. Se crea la rama `sena/evidencias` con `git checkout -b`.
3. Por cada bloque de evidencia (backend, frontend, tests, docs, etc.) se
   ejecuta un commit independiente con mensaje descriptivo.
4. Al cerrar el trabajo se hace `git push` de la rama al remoto.
5. La rama `main` **nunca se modifica** en este flujo; el ZIP de entrega
   se genera a partir de la rama `sena/evidencias`.

## Historial esperado de la rama

> Para reproducir el historial:
>
> ```bash
> git log --oneline sena/evidencias ^main
> ```

Los commits creados durante esta entrega siguen el patrón:

- `feat(sena): add Node.js/Express backend with SQLite CRUD (AA2-EV01, AA2-EV02, AA5-EV01)`
- `feat(sena): add React CRUD module consuming REST API (AA3-EV01, AA4-EV03)`
- `feat(sena): add API test suite and Postman collection (AA5-EV02, AA5-EV04)`
- `docs(sena): add API documentation and validation tests doc (AA3-EV02, AA5-EV03)`
- `docs(sena): add versioning documentation (AA1-EV05)`
- `docs(sena): add delivery structure and CI workflow (GA7 complete)`

## Captura sugerida para la evidencia

Para complementar el archivo se sugiere adjuntar capturas de pantalla con:

1. La salida de `git log --oneline sena/evidencias` mostrando los commits.
2. La vista de la rama `sena/evidencias` en GitHub.
3. La salida de `git remote -v` mostrando el remoto correctamente configurado.

Esos elementos completan la evidencia AA1-EV05 (uso de un sistema de control
de versiones para un proyecto real).
