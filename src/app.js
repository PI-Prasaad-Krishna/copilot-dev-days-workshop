// UI code: connects the quiz logic (quiz.js) to the page (index.html).

const QUESTION_TIME = 15;
const TIMEOUT_ADVANCE_DELAY = 800;
let state = createQuiz([]);
let timeLeft = QUESTION_TIME;
let timerId = null;
let advanceTimeoutId = null;
let questionCompleted = false;

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const progressText = document.getElementById("progress");
const timerText = document.getElementById("timer");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options");
const feedbackText = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const scoreText = document.getElementById("score-text");
const gradeText = document.getElementById("grade-text");

function showScreen(screenToShow) {
  [startScreen, quizScreen, resultScreen].forEach((screen) => {
    screen.hidden = screen !== screenToShow;
  });
}

function startQuiz() {
  stopTimer();
  clearAdvanceTimeout();
  state = createQuiz(shuffle(QUESTIONS));
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  stopTimer();
  clearAdvanceTimeout();
  const question = state.questions[state.current];
  timeLeft = QUESTION_TIME;
  questionCompleted = false;
  progressText.textContent = `Question ${state.current + 1} of ${state.questions.length}`;
  renderTimer();
  questionText.textContent = question.question;
  feedbackText.textContent = "";
  nextButton.hidden = true;
  optionsList.innerHTML = "";

  question.options.forEach((option, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(index, button));
    item.appendChild(button);
    optionsList.appendChild(item);
  });

  timerId = setInterval(() => {
    timeLeft--;
    renderTimer();
    if (timeLeft <= 0) {
      stopTimer();
      handleTimeout();
    }
  }, 1000);
}

function renderTimer() {
  const seconds = Math.max(0, timeLeft);
  const minutes = Math.floor(seconds / 60);
  const remainder = String(seconds % 60).padStart(2, "0");
  timerText.textContent = `${String(minutes).padStart(2, "0")}:${remainder}`;
  timerText.setAttribute("aria-label", formatTimeLeft(seconds));
  timerText.classList.toggle("warning", seconds <= 5);
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function clearAdvanceTimeout() {
  if (advanceTimeoutId !== null) {
    clearTimeout(advanceTimeoutId);
    advanceTimeoutId = null;
  }
}

function selectAnswer(selectedIndex, selectedButton) {
  if (questionCompleted) return;
  questionCompleted = true;
  stopTimer();
  const question = state.questions[state.current];
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));

  const result = answerQuestion(state, selectedIndex);
  state = result.state;
  if (result.correct) {
    selectedButton.classList.add("correct");
    feedbackText.textContent = "Correct!";
  } else {
    selectedButton.classList.add("wrong");
    buttons[question.answer].classList.add("correct");
    feedbackText.textContent = "Not quite. The correct answer is highlighted.";
  }

  nextButton.hidden = false;
  nextButton.focus();
}

function handleTimeout() {
  if (questionCompleted) return;
  questionCompleted = true;
  const question = state.questions[state.current];
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));
  buttons[question.answer].classList.add("correct");
  feedbackText.textContent = "Time's up!";
  const result = answerQuestion(state, -1);
  state = result.state;
  advanceTimeoutId = setTimeout(() => {
    advanceTimeoutId = null;
    nextQuestion();
  }, TIMEOUT_ADVANCE_DELAY);
}

function nextQuestion() {
  stopTimer();
  clearAdvanceTimeout();
  if (!isQuizFinished(state)) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  stopTimer();
  clearAdvanceTimeout();
  const total = state.questions.length;
  const percentage = calculatePercentage(state.score, total);
  scoreText.textContent = `You scored ${state.score} out of ${total} (${percentage}%)`;
  gradeText.textContent = `Grade: ${getGrade(percentage)}`;
  showScreen(resultScreen);
}

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("restart-btn").addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
