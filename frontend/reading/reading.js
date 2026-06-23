// -------- ELEMENTS --------
const startButtons = document.querySelectorAll('.level-btn');
const levelSelection = document.getElementById('level-selection');

const readingSection = document.getElementById('reading-section');
const readingTitle = document.getElementById('reading-title');
const readingText = document.getElementById('reading-text');
const questionsContainer = document.getElementById('questions-container');

const submitBtn = document.getElementById('submit-reading');
const feedbackSection = document.getElementById('reading-feedback');
const feedbackText = document.getElementById('feedback-text');

const intro = document.querySelector('.intro');
const newExerciseBtn = document.getElementById("new-reading");

let currentLevel = null;
let questionsData = [];


// -------- URL LEVEL --------
const params = new URLSearchParams(window.location.search);
const levelFromURL = params.get("level");
const allowedLevels = ["A1", "A2", "B1", "B2"];

if (levelFromURL && allowedLevels.includes(levelFromURL.toUpperCase())) {
  currentLevel = levelFromURL.toUpperCase();
  startReading(currentLevel);
}


// -------- START READING --------
function startReading(level) {

  levelSelection.classList.add("hidden");
  intro.classList.add("hidden");
  readingSection.classList.remove("hidden");

  readingTitle.textContent = `${level} Reading Exercise`;

  loadReadingFromAI(level);
}


startButtons.forEach(btn => {

  btn.addEventListener('click', () => {

    currentLevel = btn.dataset.level;
    startReading(currentLevel);

  });

});


newExerciseBtn.addEventListener("click", () => {

  feedbackSection.classList.add("hidden");
  loadReadingFromAI(currentLevel);

});


// -------- FETCH READING FROM BACKEND --------
async function loadReadingFromAI(level) {

  readingText.textContent = "⏳ Generating reading exercise...";
  questionsContainer.innerHTML = "";

  submitBtn.disabled = true;

  try {

    const response = await fetch(`/api/reading/${encodeURIComponent(level)}`);

    if (!response.ok) throw new Error("Failed to fetch reading");

    const data = await response.json();

    renderReading(data);

    submitBtn.disabled = false;

    submitBtn.classList.remove("hidden");
    newExerciseBtn.classList.remove("hidden");

  } catch (error) {

    readingText.textContent = "❌ Error loading reading exercise.";
    console.error(error);

  }

}


// -------- RENDER TEXT + QUESTIONS --------
function renderReading(data) {

  readingText.textContent = data.text;

  questionsData = data.questions;

  questionsContainer.innerHTML = "";

  data.questions.forEach((q, index) => {

    const questionBlock = document.createElement("div");
    questionBlock.classList.add("question");

    const p = document.createElement("p");
    const strong = document.createElement("strong");

    strong.textContent = `${index + 1}. ${q.question}`;
    p.appendChild(strong);
    questionBlock.appendChild(p);

    // OPTIONS
    q.options.forEach((option, i) => {

      const label = document.createElement("label");

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${index}`;
      input.value = i;

      label.appendChild(input);
      label.append(` ${option}`);

      questionBlock.appendChild(label);
      questionBlock.appendChild(document.createElement("br"));

    });

    questionsContainer.appendChild(questionBlock);

  });

}


// -------- CHECK ANSWERS --------
submitBtn.addEventListener("click", () => {

  let score = 0;

  questionsData.forEach((q, index) => {

    const options = document.querySelectorAll(`input[name="q${index}"]`);

    options.forEach((option, i) => {

      const label = option.parentElement;

      if (i === q.answer) {
        label.classList.add("correct");
      }

      if (option.checked && i !== q.answer) {
        label.classList.add("wrong");
      }

      if (option.checked && i === q.answer) {
        score++;
      }

    });

  });

  feedbackSection.classList.remove("hidden");

  feedbackText.innerHTML = `
    You scored <strong>${score}</strong> out of
    <strong>${questionsData.length}</strong>
  `;

});