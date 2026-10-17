# Project Guidelines

## Build, Run, and Test

- Use Node.js 20 or newer.
- Run the full test suite from the repository root with `npm test`. It uses Node's built-in test runner and currently includes a deliberately planted `getGrade(90)` failure for the workshop's debugging chapter; do not treat that failure as an infrastructure problem.
- Run only the logic tests with `node --test tests/quiz.test.js`, or only the question-data tests with `node --test tests/questions.test.js`.
- Run one named test with Node's built-in filter, for example:
  `node --test --test-name-pattern="getGrade gives an A" tests/quiz.test.js`
- Start the local app with `npm start`; this serves `src/` at `http://localhost:8080`. The app also works from `src/index.html` directly because it uses plain script tags.
- There is no build step, linter, or dependency installation required by the repository. `npm start` uses `npx` to invoke `http-server` when needed.

## Architecture

- This is a small static quiz application with no framework, bundler, or server-side runtime.
- [`src/questions.js`](../src/questions.js) owns the quiz data. Each question has the shape `{ question, options, answer }`, where `answer` is a zero-based index into exactly four options.
- [`src/quiz.js`](../src/quiz.js) contains browser-independent quiz logic (`shuffle`, answer checking, percentage calculation, and grading). It exports functions through `module.exports` for Node tests while remaining usable from the browser.
- [`src/app.js`](../src/app.js) owns DOM references, UI state, rendering, event handlers, answer feedback, and screen transitions. Keep DOM behavior out of `quiz.js` so the logic remains directly testable.
- [`src/index.html`](../src/index.html) loads `questions.js`, then `quiz.js`, then `app.js`; preserve this order because the later scripts depend on globals defined by the earlier ones.
- [`index.html`](../index.html) is only the GitHub Pages root redirect to `src/index.html`. The deployable app is under `src/`.
- [`src/style.css`](../src/style.css) contains the presentation layer. Reuse the existing `:root` CSS variables when changing colors.

## Conventions

- Keep application code as plain CommonJS-compatible JavaScript; do not introduce a framework, module bundler, or runtime dependency for routine changes.
- Preserve the separation between pure logic, question data, and DOM/event code described above.
- When adding questions, match the existing object shape, use four options, keep question text unique, and verify that each `answer` index points to the factually correct option. `tests/questions.test.js` checks the structural constraints but cannot verify factual correctness.
- Add or update logic tests in [`tests/quiz.test.js`](../tests/quiz.test.js) for changes to `quiz.js`; question-data invariants belong in [`tests/questions.test.js`](../tests/questions.test.js).
- Keep browser-facing files compatible with direct loading from static hosting. Avoid changes that require a build step or server-side APIs.
- The workshop guides in [`workshops/`](../workshops/) describe the intended exercise flow and may contain deliberately staged changes. Update them only when a requested application change also changes the documented workshop behavior.
