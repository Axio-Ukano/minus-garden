// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

// CI/local gate: every first-party .ts/.tsx/.rs source file must carry the
// 3-line SPDX copyright header. Fails (exit 1) listing any offenders.
// See docs/playbook.md §16 for the licensing policy.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const SPDX = "SPDX-License-Identifier: CC-BY-NC-ND-4.0";

// Generated/vendor files that are intentionally exempt. Keep in sync with the
// header policy in docs/playbook.md §16.
const EXCLUDE = [
  /^node_modules\//,
  /^src-tauri\/target\//,
  /^dist\//,
  /^src\/vite-env\.d\.ts$/, // Vite-generated; header maintained by hand
];

// execFileSync (no shell) so the *.ts patterns reach git as pathspecs intact
// on every platform instead of being expanded by the shell.
const tracked = execFileSync("git", ["ls-files", "*.ts", "*.tsx", "*.rs"], {
  encoding: "utf8",
})
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .filter((file) => !EXCLUDE.some((re) => re.test(file)));

const missing = tracked.filter((file) => !readFileSync(file, "utf8").slice(0, 400).includes(SPDX));

if (missing.length > 0) {
  console.error(`✗ ${missing.length} source file(s) missing the SPDX license header:\n`);
  for (const file of missing) console.error(`  ${file}`);
  console.error("\nAdd this 3-line header to the top of each file:\n");
  console.error("  // Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)");
  console.error("  // Minus Garden · https://github.com/Axio-Ukano/minus-garden");
  console.error(`  // ${SPDX}\n`);
  process.exit(1);
}

console.log(`✓ license headers present on all ${tracked.length} first-party source files`);
