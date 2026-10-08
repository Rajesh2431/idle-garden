# Changelog
## Phase 0: scaffold (in progress)
Next App Router, strict TypeScript, Tailwind, ESLint, Vitest, environment template and project documentation.

Phase 0 verified: lint, typecheck, 1 test, production build pass. Intended commit: `phase 0: scaffold`; blocked by read-only .git.

## Phase 1: simulation core
Pure seeded simulation, UTC replay calendar, six-hour weather/overrides, names, gifts, anniversaries, bounded gzip snapshots and chunked catch-up. Fixed report loss when the rolling log fills and backwards presence timestamps. All checks pass; 14 tests. Intended commit: `phase 1: simulation core` (Git mount blocked).

## Phase 2: static render
Local-clock sky, seasonal cached paper hills, water-sized pond, procedural five-species LRU sprites, grain/vignette and debug time steps. Browser-rendered first scene inspected. Lint/typecheck/14 tests/build pass. Phone 60fps target remains a device check. Intended commit: `phase 2: static render` (Git mount blocked).

## Phase 3: live loop and presence
Visible + recent-input presence, monotonic tick skipping, idle catch-up, interpolation, battery throttling, save on timer/hide/pagehide, validated storage and corrupt-save quarantine/in-memory fallback. Browser persistence inspected. Lint/typecheck/16 tests/build pass. Intended commit: `phase 3: live loop and presence` (Git mount blocked).

## Phase 4: life and weather
Seven distinct weather treatments, bounded particles, deterministic lightning intervals, derived rabbits/birds/fireflies/frogs/owl, pointer fleeing, plant shyness and reduced-motion behavior. 400-plant debug population holds cache at 400 and save at ~44KB. Lint/typecheck/16 tests/build pass. Browser debug reported 14fps in the automated development browser; 60fps acceptance is not yet verified. Intended commit: `phase 4: life and weather` (Git mount blocked).

## Phase 5: report and share
Native focus-trapped away dialog, event timeline, fixed-sky before/after canvas with keyboard range control, 1080×1350 PNG/Web Share export, hint toast and asynchronous progress on boot/debug catch-up. Lint/typecheck/16 tests/build pass. Intended commit: `phase 5: report and share` (Git mount blocked).
