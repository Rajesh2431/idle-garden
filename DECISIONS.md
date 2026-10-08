# Decisions
- 2026-10-08: Work in the supplied `clock` workspace. User supplied all 23 specification sections in the task; SPEC.md records their implementation contract.
- Git initialization fails because the pre-existing `.git` mount is read-only. Do not bypass this boundary. Phase verification and intended commit messages are recorded in CHANGELOG.md; commits require a writable Git checkout.
- Network DNS is blocked. Use cached packages where possible; document unavailable dependencies/checks rather than claim success.
- Simulation calendar/night uses UTC for deterministic browser/server replay. Rendering uses the user's local wall clock as requested. A fixed calendar avoids host timezone dependence without changing the snapshot contract.
- Random garden seeds are generated at the application boundary. newGarden's default seed is derived from its explicit timestamp, keeping the core pure.
- Async catch-up scheduling lives in lib/catchup.ts and is re-exported by sim.ts; the simulation module itself has no browser globals. Collect new events explicitly before the rolling log discards them.
- Preserve supplied growth probabilities. Thirty days cannot guarantee a lush garden for every seed/weather; debug tools can populate 400 plants for performance inspection.
- Cached package contents restored into ignored node_modules for local verification, missing backend packages retrieved from the public npm registry through the browser. Standard pnpm install remains the supported setup. Next 16.3 CLI config capture failed in this environment; useTypeScriptCli:false selects its supported compiler API path and retains type checking. Build workers limited to two.
