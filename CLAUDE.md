# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server (opens browser automatically)
- `npm run build` — Type-check with tsc then build with Vite
- `npx tsc --noEmit` — Type-check only (no output files)
- `npm test` — Run all tests (vitest run)
- `npm run test:watch` — Run tests in watch mode

## Architecture

Browser-based single-player No-Limit Texas Hold'em poker game. One human player vs 5 AI opponents. Pure TypeScript with Vite — no framework, no external runtime dependencies.

### Event-Driven Design

The codebase uses a central `EventBus` (src/utils/EventBus.ts) that decouples game logic from rendering. `GameEvent` is a discriminated union type — all game state changes flow through the bus. GameEngine emits events; UI/Animation/Sound modules subscribe and react independently.

### Key Modules

- **src/core/** — Game logic: Card/Deck types, `HandEvaluator` (brute-force C(7,5)=21 combinations, ranked by encoded `rankValue` for O(1) comparison), Player state, GameState, Pot management
- **src/betting/** — Betting round logic, action types (fold/check/call/raise/allin), validation
- **src/ai/** — AI decision-making with personality profiles (tightness, aggression, bluffFrequency). Pre-flop uses Chen formula; post-flop uses hand strength + pot odds
- **src/ui/** — DOM rendering (no virtual DOM). CSS-only card rendering (no image assets)
- **src/animation/** — Web Animations API for sequenced card/chip animations
- **src/sound/** — Web Audio API with synthesized sounds

### Game Loop

The game loop is async/await-based. Human player turns create a Promise resolved by UI button clicks. AI turns resolve after a simulated thinking delay. This allows natural sequencing of animations and player input within a single async flow.

### Hand Evaluation Encoding

`rankValue = category × 10^10 + rank components in descending positional weight`. This allows comparing any two hands with a single numeric comparison.

## Conventions

- Language: Korean for user-facing text and documentation; English for code identifiers
- Git Flow branching: main (release), develop (integration), feature/* (work branches)
- TypeScript strict mode with `noUncheckedIndexedAccess` — use `!` assertion only when index is guaranteed valid
- No external dependencies — DOM API, Web Animations API, Web Audio API only
- Project plan and sprint tracking in docs/PROJECT_PLAN.md
