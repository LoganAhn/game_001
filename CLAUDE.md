# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server (opens browser automatically)
- `npm run build` — Type-check with tsc then build with Vite
- `npx tsc --noEmit` — Type-check only (no output files)
- `npm test` — Run all tests (vitest run)
- `npm run test:watch` — Run tests in watch mode
- `npm run test:coverage` — Run tests with coverage report

## Architecture

Browser-based single-player No-Limit Texas Hold'em poker game. One human player vs 5 AI opponents. Pure TypeScript with Vite — no framework, no external runtime dependencies.

### Event-Driven Design

The codebase uses a central `EventBus` (src/utils/EventBus.ts) that decouples game logic from rendering. `GameEvent` is a discriminated union type — all game state changes flow through the bus. GameEngine emits events; UI/Animation/Sound modules subscribe and react independently.

### Key Modules

- **src/core/** — Card/Deck types, `HandEvaluator` (brute-force C(7,5)=21 combinations, ranked by encoded `rankValue` for O(1) comparison), Player state, GameState, `PotManager` (side pot calculation & distribution), `GameEngine` (async state machine)
- **src/betting/** — `BettingAction` (action types, validation, available actions), `BettingRound` (round progression, termination conditions)
- **src/ai/** — AI decision-making with personality profiles (tightness, aggression, bluffFrequency, skill). Pre-flop uses Chen formula; post-flop uses hand strength + pot odds + board danger
- **src/ui/** — DOM rendering (no virtual DOM). `Renderer` integrates all views: `TableView`, `CardView` (CSS-only), `PlayerView` (6-seat), `BettingControls` (Promise-based human input), `SettingsMenu`, `GameOverScreen`, `HandRankingHelp`
- **src/animation/** — Web Animations API. `AnimationManager` (queue + speed control), `CardAnimations` (deal/flip/fold), `ChipAnimations`, `WinEffects` (particles + popup)
- **src/sound/** — Web Audio API with synthesized sounds (7 effects, no external audio files). `SoundManager` (volume/mute), `SoundEffects`
- **src/utils/** — `EventBus` (pub/sub), `Constants` (game config values)

### Game Loop

The game loop is async/await-based. Human player turns create a Promise resolved by UI button clicks. AI turns resolve after a simulated thinking delay (0.8~2.5s). This allows natural sequencing of animations and player input within a single async flow.

### Hand Evaluation Encoding

`rankValue = category × 10^10 + rank components in descending positional weight`. This allows comparing any two hands with a single numeric comparison.

## Conventions

- Language: Korean for user-facing text and documentation; English for code identifiers
- Git Flow branching: main (release), develop (integration), feature/* (work branches)
- TypeScript strict mode with `noUncheckedIndexedAccess` — use `!` assertion only when index is guaranteed valid
- No external runtime dependencies — DOM API, Web Animations API, Web Audio API only
- Dev dependencies: Vite, TypeScript, Vitest, @vitest/coverage-v8

## Documentation Structure

- `README.md` — Project overview, setup, architecture
- `CLAUDE.md` — AI context file (this file)
- `docs/prd.md` — Product Requirements Document
- `docs/roadmap.md` — Overall roadmap and progress
- `docs/sprint/SPRINT_N.md` — Per-sprint detailed plans and results
- `docs/sprint/TEST_REPORT_SPRINT_N.md` — Per-sprint test reports
- `docs/PROJECT_PLAN.md` — Original project specification

## Testing

- Unit tests: Vitest (`src/__tests__/*.test.ts`) — 82 tests covering Card, Deck, HandEvaluator, Pot, BettingAction, GameEngine, AI System (Chen Formula, HandStrength, BoardDanger, AIController)
- Coverage: `npm run test:coverage` generates report in `coverage/`

## CI/CD

- GitHub Actions CI: type check → test with coverage → build (on push/PR to main/develop)
- GitHub Actions Deploy: auto-deploy to GitHub Pages on push to main
- Deployment URL: https://loganahn.github.io/game_001/
