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

The codebase uses a central `EventBus` (src/utils/EventBus.ts) that decouples game logic from rendering. `GameEvent` is a discriminated union type — all game state changes flow through the bus. GameEngine emits events; UI modules subscribe and react independently.

### Implemented Modules

- **src/core/** — Card/Deck types, `HandEvaluator` (brute-force C(7,5)=21 combinations, ranked by encoded `rankValue` for O(1) comparison), Player state, GameState, `PotManager` (side pot calculation & distribution), `GameEngine` (async state machine)
- **src/betting/** — `BettingAction` (action types, validation, available actions), `BettingRound` (round progression, termination conditions)
- **src/ui/** — DOM rendering (no virtual DOM). `Renderer` integrates all views: `TableView` (oval felt table), `CardView` (CSS-only cards), `PlayerView` (6-seat layout with dealer/blind markers), `CommunityCardsView`, `PotView`, `MessageView`
- **src/utils/** — `EventBus` (pub/sub), `Constants` (game config values)

### Planned Modules (not yet implemented)

- **src/ai/** — AI decision-making with personality profiles (Sprint 5)
- **src/animation/** — Web Animations API for sequenced animations (Sprint 6)
- **src/sound/** — Web Audio API with synthesized sounds (Sprint 7)

### Game Loop

The game loop is async/await-based. Human player turns will create a Promise resolved by UI button clicks (Sprint 4). AI turns resolve after a simulated thinking delay. This allows natural sequencing of animations and player input within a single async flow.

### Hand Evaluation Encoding

`rankValue = category × 10^10 + rank components in descending positional weight`. This allows comparing any two hands with a single numeric comparison.

## Conventions

- Language: Korean for user-facing text and documentation; English for code identifiers
- Git Flow branching: main (release), develop (integration), feature/* (work branches)
- TypeScript strict mode with `noUncheckedIndexedAccess` — use `!` assertion only when index is guaranteed valid
- No external runtime dependencies — DOM API, Web Animations API, Web Audio API only
- Dev dependencies allowed: Vite, TypeScript, Vitest, Playwright
- Project plan and sprint tracking in docs/

## Documentation Structure

- `docs/prd.md` — Product Requirements Document
- `docs/roadmap.md` — Overall roadmap and progress
- `docs/sprint/SPRINT_N.md` — Per-sprint detailed plans and results
- `docs/PROJECT_PLAN.md` — Original project specification

## Testing

- Unit tests: Vitest (`src/__tests__/*.test.ts`) — 69 tests covering Card, Deck, HandEvaluator, Pot, BettingAction, GameEngine
- E2E tests: Playwright (planned for Sprint 8)
