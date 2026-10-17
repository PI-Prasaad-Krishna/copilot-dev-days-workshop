// Tests use Node's built-in test runner, so nothing needs to be installed.
// Run them with:  npm test
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  shuffle,
  isCorrect,
  createQuiz,
  answerQuestion,
  isQuizFinished,
  calculatePercentage,
  isNewBestScore,
  formatTimeLeft,
  getFeedbackMessage,
  getGrade,
} = require("../src/quiz.js");

test("createQuiz returns a fresh initial state", () => {
  const questions = [{ question: "One", answer: 0 }];
  const state = createQuiz(questions);

  assert.deepEqual(state, { questions, current: 0, score: 0 });
  assert.notStrictEqual(state.questions, questions);
});

test("answerQuestion returns a new state and records a correct answer", () => {
  const state = createQuiz([{ question: "One", answer: 1 }]);
  const result = answerQuestion(state, 1);

  assert.deepEqual(result, {
    state: { questions: state.questions, current: 1, score: 1 },
    correct: true,
  });
  assert.deepEqual(state, { questions: state.questions, current: 0, score: 0 });
  assert.notStrictEqual(result.state, state);
});

test("answerQuestion does not increase the score for a wrong answer", () => {
  const state = createQuiz([{ question: "One", answer: 1 }]);
  const result = answerQuestion(state, 0);

  assert.equal(result.correct, false);
  assert.equal(result.state.score, 0);
  assert.equal(result.state.current, 1);
});

test("isQuizFinished reflects the current question", () => {
  const state = createQuiz([{ question: "One", answer: 0 }]);

  assert.equal(isQuizFinished(state), false);
  assert.equal(isQuizFinished(answerQuestion(state, 0).state), true);
});

test("isCorrect returns true for the right answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 2), true);
});

test("isCorrect returns false for a wrong answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 0), false);
});

test("calculatePercentage rounds to a whole number", () => {
  assert.equal(calculatePercentage(2, 3), 67);
});

test("calculatePercentage returns 0 when there are no questions", () => {
  assert.equal(calculatePercentage(0, 0), 0);
});

test("isNewBestScore returns true when there is no previous score", () => {
  assert.equal(isNewBestScore(80, null), true);
});

test("isNewBestScore returns true for a higher score", () => {
  assert.equal(isNewBestScore(80, 70), true);
});

test("isNewBestScore returns false for an equal score", () => {
  assert.equal(isNewBestScore(70, 70), false);
});

test("isNewBestScore returns false for a lower score", () => {
  assert.equal(isNewBestScore(60, 70), false);
});

test("formatTimeLeft formats seconds for status messages", () => {
  assert.equal(formatTimeLeft(12), "⏱ 12s");
  assert.equal(formatTimeLeft(0), "⏱ 0s");
});

test("formatTimeLeft clamps negative values to zero", () => {
  assert.equal(formatTimeLeft(-1), "⏱ 0s");
});

test("shuffle keeps every item and does not change the original array", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle(original);
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
});

test("getGrade gives an A at the 90% boundary", () => {
  assert.equal(getGrade(90), "A");
});

test("getGrade gives a B at the 75% boundary", () => {
  assert.equal(getGrade(75), "B");
});

test("getGrade gives a C at the 50% boundary", () => {
  assert.equal(getGrade(50), "C");
});

test("getFeedbackMessage returns encouragement for every grade", () => {
  assert.equal(getFeedbackMessage("A"), "Excellent work!");
  assert.equal(getFeedbackMessage("B"), "Great job!");
  assert.equal(getFeedbackMessage("C"), "Good effort!");
  assert.equal(getFeedbackMessage("F"), "Keep practicing!");
});
