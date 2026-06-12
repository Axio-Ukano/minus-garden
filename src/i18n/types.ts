// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

export type DeepTranslation<T> = {
  [K in keyof T]: T[K] extends object ? DeepTranslation<T[K]> : string;
};
