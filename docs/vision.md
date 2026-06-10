# Minu's Garden — Vision

## Description

**Minu's Garden** is an offline desktop app designed to accompany Minu's study sessions. It combines a study timer with a hearts economy 💗 and a virtual garden that grows as you study.

## Core concept

Study → earn hearts → buy plants and flowers → watch the garden grow. The garden is a visual reflection of accumulated effort, and small Adorable Home-style mini-games (arranging things, tending plants, short mini-tasks) make breaks fun.

## Tech stack

| Layer          | Technology            |
| -------------- | --------------------- |
| UI             | React 19 + TypeScript |
| Styles         | Vanilla CSS           |
| Desktop shell  | Tauri 2               |
| Native backend | Rust                  |
| Database       | SQLite (via rusqlite) |
| State          | Zustand 5             |

## Platform

- **Target:** Desktop (Windows and macOS)
- **Mode:** Offline-first — no internet connection required
- **Distribution:** Local installable binary

## Non-goals for v1

- No login or user accounts
- No cloud sync
- No payments or monetization
- No mobile version
- No multiplayer
