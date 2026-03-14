# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server (opens browser automatically)
- `npm run build` — Type-check with tsc then build with Vite
- `npx tsc --noEmit` — Type-check only (no output files)
- `npm test` — Run all tests (vitest run)
- `npm run test:watch` — Run tests in watch mode
- `npm run test:coverage` — Run tests with v8 coverage report
- `npm run test:e2e` — Run Playwright E2E tests (requires `npx playwright install` first)
- `npm run test:e2e:ui` — Run E2E tests with interactive UI
- `npx vitest run src/__tests__/HandEvaluator.test.ts` — Run a single test file

## Architecture

Browser-based single-player No-Limit Texas Hold'em poker game. One human player vs 5 AI opponents. Pure TypeScript with Vite — no framework, no external runtime dependencies.

### Core Game Flow

The entire game is orchestrated through `main.ts` which wires together GameEngine, Renderer, AI, Animation, and Sound:

```text
main.ts: startNewGame()
  → GameEngine(actionProvider)     # Engine receives a callback for player decisions
  → gameLoop()                     # Loops hands until game over
      → engine.playHands(1)        # Engine runs one hand
          → actionProvider(player) # Called for EACH player's turn
              ├─ Human (isAI=false): renderer.requestHumanAction()
              │   → BettingControls.show() returns Promise<BettingDecision>
              │   → Player clicks button → Promise resolves
              └─ AI (isAI=true): getAIAction()
                  → PreFlopStrategy (Chen Formula) or PostFlopStrategy (hand strength + pot odds)
                  → Returns { action, amount } after thinking delay
          → renderer.render(state) # UI updated after each action
      → showHandPopup() / showGameOverScreen()
```

**Key pattern**: `ActionProvider` is a single async callback injected into GameEngine. It abstracts away whether the decision comes from UI input or AI computation. This is how GameEngine stays decoupled from both UI and AI.

### Event-Driven Design

`EventBus` (src/utils/EventBus.ts) uses a `GameEvent` discriminated union type. GameEngine emits events; UI/Animation/Sound modules can subscribe independently. Currently, main.ts directly calls renderer.render() after actions rather than relying on EventBus subscriptions for rendering.

### Key Modules

- **src/core/** — Card/Deck types, `HandEvaluator` (brute-force C(7,5)=21 combinations, ranked by encoded `rankValue` for O(1) comparison), Player state, GameState, `PotManager` (side pot calculation & distribution), `GameEngine` (async state machine)
- **src/betting/** — `BettingAction` (action types, validation, `getAvailableActions()`), `BettingRound` (round progression, termination conditions)
- **src/ai/** — `AIController.getAIAction()` dispatches to `PreFlopStrategy` (Chen formula + tightness threshold) or `PostFlopStrategy` (hand strength + pot odds + board danger). `AIPersonality` defines 5 profiles with tightness/aggression/bluffFrequency/skill parameters
- **src/ui/** — `Renderer` integrates all views and manages DOM lifecycle. `BettingControls` uses Promise-based show()/hide() for human input. `SettingsMenu` controls sound/animation. `GameOverScreen` handles restart flow
- **src/animation/** — `AnimationManager` (Promise queue + speed multiplier), `CardAnimations`, `ChipAnimations`, `WinEffects` (particles + popup). All use Web Animations API
- **src/sound/** — `SoundManager` (AudioContext + volume/mute), `SoundEffects` (7 synthesized sounds via OscillatorNode/NoiseBuffer — no external audio files)

### Hand Evaluation Encoding

`rankValue = category × 10^10 + rank components in descending positional weight`. This allows comparing any two hands with a single numeric comparison.

### Singletons

`animationManager` and `soundManager` are module-level singletons exported from their respective files. Both must be initialized after user interaction (browser autoplay policy).

## Conventions

- Language: Korean for user-facing text and documentation; English for code identifiers
- Git Flow branching: main (release), develop (integration), feature/* (work branches)
- TypeScript strict mode with `noUncheckedIndexedAccess` — use `!` assertion only when index is guaranteed valid
- No external runtime dependencies — DOM API, Web Animations API, Web Audio API only
- Dev dependencies: Vite, TypeScript, Vitest, @vitest/coverage-v8

## Documentation Structure

- `README.md` — Project overview, setup, architecture
- `docs/prd.md` — Product Requirements Document (problem definition, differentiation, functional requirements with IDs)
- `docs/roadmap.md` — Overall roadmap with sprint progress and dependency graph
- `docs/sprint/SPRINT_N.md` — Per-sprint plans and completion records
- `docs/sprint/TEST_REPORT_SPRINT_N.md` — Per-sprint test reports
- `docs/DECISION_LOG.md` — Architecture Decision Records (ADR, 7 decisions)
- `docs/test-strategy.md` — Test pyramid, coverage targets, quality gates
- `docs/TEST_RESULTS.md` — Latest test execution results and CI/CD pipeline details

## Testing

- Unit tests: Vitest (`src/__tests__/*.test.ts`) — 82 tests across 7 files
- E2E tests: Playwright (`e2e/game.spec.ts`) — 3 tests (page load, game start, betting controls)
- Coverage: Stmts 78% / Branch 58% / Funcs 94% / Lines 80% (via `npm run test:coverage`)
- Core logic (HandEvaluator, Pot, BettingAction) has highest coverage; UI/Animation/Sound are verified via E2E + manual browser testing

## CI/CD

- `.github/workflows/ci.yml` — type check → test with coverage → build → E2E (on push/PR to main/develop)
- `.github/workflows/deploy.yml` — auto-deploy to GitHub Pages on push to main (uses actions/deploy-pages)
- `vite.config.ts` reads `BASE_URL` env var for GitHub Pages path prefix (`/game_001/`)
- Deployment: <https://loganahn.github.io/game_001/>
