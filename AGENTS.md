# AGENTS.md
## Project
Idle Garden Clock: a web toy where a procedural ecosystem grows while the user is away.
Spec lives in SPEC.md. Follow it exactly; do not drop features.
## Stack
Next.js (App Router) + TypeScript (strict) + Tailwind, Canvas 2D, Vitest, pnpm.
Backend bits: Upstash Redis (REST), web-push, zod. Deploy on Vercel.
## Commands
- Install: pnpm install
- Dev: pnpm dev
- Lint: pnpm lint
- Typecheck: pnpm tsc --noEmit
- Test: pnpm vitest run
- Build: pnpm build
## Rules
- Work phase by phase as listed in SPEC.md section 18. Finish and verify one phase before starting the next.
- After each phase run lint, typecheck, test, build. Fix everything. Then `git commit -m "phase N: <name>"`.
- lib/sim.ts, lib/rng.ts, lib/weather.ts, lib/types.ts must stay pure and isomorphic (no window, document, localStorage, Date.now()). The server runs them too.
- Simulation must stay deterministic: same seed + same ticks = same state. Never use Math.random inside stepTick.
- No stock images, fonts, or audio files. Everything is procedural (Canvas 2D, WebAudio).
- No `any`. Validate all API input with zod. Never trust client data on the server.
- Never commit secrets. Use .env.local and keep .env.example updated.
- Performance budget: 60fps on mid phones with 400 plants; cache static layers on offscreen canvases.
- Respect prefers-reduced-motion and keyboard accessibility.
- If a spec detail is ambiguous, pick the simplest sensible default, note it in DECISIONS.md, and keep going. Do not stop to ask.
- Keep a running CHANGELOG.md of what each phase delivered.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
