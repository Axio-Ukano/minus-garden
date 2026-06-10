# Minu's Garden — Design tokens

Source of truth: `src/styles/variables.css`. This document mirrors it; update both
together. Light mode is the `:root` default; dark mode overrides a subset under
`[data-theme="dark"]`.

## Color — Light mode (default)

| Token                  | Hex       | Usage                                     |
| ---------------------- | --------- | ----------------------------------------- |
| `--color-bg`           | `#fceaf8` | Main background                           |
| `--color-panel`        | `#fdf2fa` | Cards, modals, buttons                    |
| `--color-surface`      | `#fdf2fa` | Nav bar and surfaces                      |
| `--color-accent`       | `#ff6bb5` | Primary buttons, accents                  |
| `--color-accent-hover` | `#ff1492` | Accent hover                              |
| `--color-text`         | `#2a1f20` | Main text                                 |
| `--color-text-muted`   | `#6b3d4a` | Labels and secondary text                 |
| `--color-hearts`       | `#ffb8c1` | Hearts surface / final-stage card         |
| `--color-heart`        | `#ff6bb5` | Heart icon                                |
| `--color-success`      | `#7acb8a` | Success state                             |
| `--color-error`        | `#f295be` | Error state                               |
| `--color-input-bg`     | `#fdf5fb` | Input background (pink-tinted, not white) |
| `--color-input-border` | `#c87aaa` | Input border                              |
| `--color-border`       | `#3b2f3f` | Pixel-art borders                         |
| `--color-pixel-shadow` | `#2a1f20` | Pixel-art drop shadow                     |

## Color — Dark mode (`[data-theme="dark"]` overrides)

| Token                       | Hex                      | Usage                        |
| --------------------------- | ------------------------ | ---------------------------- |
| `--color-bg`                | `#0e0a1a`                | Base background              |
| `--color-panel`             | `#1d1535`                | Panels, inputs, buttons      |
| `--color-surface`           | `#120e22`                | Nav bar (darker than bg)     |
| `--color-text`              | `#ede4ff`                | Main text                    |
| `--color-text-muted`        | `#8a7db5`                | Secondary text               |
| `--color-accent`            | `#e85fa3`                | Accent (muted, premium pink) |
| `--color-accent-hover`      | `#d4107e`                | Accent hover                 |
| `--color-nav-active-bg`     | `rgba(255,107,181,0.12)` | Active nav background        |
| `--color-nav-active-border` | `#e85fa3`                | Active nav border            |
| `--color-input-bg`          | `#1a1230`                | Input background             |
| `--color-input-border`      | `#4a3478`                | Input border                 |
| `--color-hearts`            | `#2d1425`                | Hearts surface               |
| `--color-success`           | `#4a8a5c`                | Success state                |
| `--color-error`             | `#c24a7a`                | Error state                  |
| `--color-border`            | `#3a2960`                | Pixel-art borders            |
| `--color-pixel-shadow`      | `#06030f`                | Pixel-art drop shadow        |

## Plant colors (PlantDisplay only)

| Token                   | Hex       | Usage                  |
| ----------------------- | --------- | ---------------------- |
| `--color-accent-green`  | `#5a8a3c` | Plant greens           |
| `--color-accent-pink`   | `#ff6bb5` | Plant pinks            |
| `--color-accent-purple` | `#9b6dbd` | Plant purples, headers |

> Per-species sprite palettes are defined locally in each `*Stages.tsx` file, not as
> global tokens. These three are shared plant accents used outside the sprites.

## Typography

- **Font family** (`--font-pixel`): `"Press Start 2P", monospace`
- **Scale:**
  - `--text-pixel-xs`: 9px
  - `--text-pixel-sm`: 10px
  - `--text-pixel-md`: 12px
  - `--text-pixel-lg`: 14px
  - `--text-pixel-xl`: 16px
  - `--text-pixel-2xl`: 20px

## Spacing

- `--space-xs`: 4px
- `--space-sm`: 8px
- `--space-md`: 16px
- `--space-lg`: 24px
- `--space-xl`: 32px

## Motion

- `--hover-speed`: 0.18s (shared hover transition duration)
