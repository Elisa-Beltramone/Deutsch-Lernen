// -------- ELEMENTS --------
const startButtons = document.querySelectorAll('.start-btn');
const writingSection = document.getElementById('writing-section');
const exerciseTitle = document.getElementById('exercise-title');
const textarea = document.getElementById('writing-textarea');
const wordCountSpan = document.getElementById('word-count');
const submitBtn = document.getElementById('submit-btn');
const feedbackSection = document.getElementById('ai-feedback');
const feedbackText = document.getElementById('feedback-text');
const saveFeedbackBtn = document.getElementById("save-feedback-btn");
const levelsSection = document.querySelector('.levels-explanation');
const intro = document.querySelector('.intro');

let currentLevel = null;
let warningTimeout;

// -------- HELPERS --------
function showWarning(message) {
  clearTimeout(warningTimeout);
  feedbackSection.style.display = 'block';
  feedbackText.style.color = 'orange';
  feedbackText.textContent = message;

  warningTimeout = setTimeout(() => {
    feedbackText.textContent = '';
    feedbackText.style.color = '#333';
    feedbackSection.style.display = 'none';
  }, 3000);
}

function clearFeedback() {
  feedbackSection.style.display = 'none';
  feedbackText.textContent = '';
  feedbackText.style.color = '#333';
  clearTimeout(warningTimeout);
}

function escapeHTML(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

// -------- HIGHLIGHT MISTAKES (GROUPED) --------
function highlightMistakes(originalText, mistakes = []) {
  if (!mistakes.length) return escapeHTML(originalText);

  // Sort mistakes by length (longest first) to prevent nested replacements
  mistakes.sort((a,b) => b.wrong.length - a.wrong.length);

  let highlighted = escapeHTML(originalText);

  mistakes.forEach(m => {
    const wrongEsc = m.wrong.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(wrongEsc, "g");

    highlighted = highlighted.replace(
      regex,
      `<span class="mistake" title="Correct: ${escapeHTML(m.correct)}. ${escapeHTML(m.explanation)}">${escapeHTML(m.wrong)}</span>`
    );
  });

  return highlighted;
}

// -------- START WRITING FUNCTION --------
function startWriting(level) {
  currentLevel = level.toUpperCase();

  levelsSection.style.display = 'none';
  intro.style.display = 'none';
  writingSection.style.display = 'block';

  exerciseTitle.textContent = `${currentLevel} Writing Exercise`;
  const levelTask = document.getElementById('level-task');
  if (levelTask && typeof tasks !== 'undefined' && tasks[currentLevel]) {
    levelTask.textContent = `${currentLevel} Level Task: ${tasks[currentLevel]}`;
  }

  textarea.value = '';
  wordCountSpan.textContent = '0';
  feedbackSection.style.display = 'none';

  window.scrollTo({ top: writingSection.offsetTop, behavior: 'smooth' });
}

// -------- INITIALIZE WRITING --------
function initializeWriting() {
  const spinner = document.createElement('span');
  spinner.className = 'spinner';
  spinner.textContent = '⏳ Checking...';
  spinner.style.display = 'none';
  spinner.style.marginLeft = '10px';
  spinner.style.fontWeight = 'bold';
  spinner.style.color = '#1e3a8a';
  submitBtn.parentNode.insertBefore(spinner, submitBtn.nextSibling);

  // Live word count
  textarea.addEventListener('input', () => {
    const words = textarea.value.trim().split(/\s+/).filter(w => w.length > 0);
    wordCountSpan.textContent = words.length;

    const limits = { A1: 50, A2: 80, B1: 140, B2: 180 };
    const maxWords = currentLevel ? limits[currentLevel] : 200;
    if (words.length > maxWords) {
      textarea.value = words.slice(0, maxWords).join(' ');
      wordCountSpan.textContent = maxWords;
      showWarning(`⚠️ Maximum words for ${currentLevel} is ${maxWords}.`);
    }
  });

  // Submit button
  submitBtn.addEventListener('click', async () => {
    const text = textarea.value.trim();
    if (!text || !currentLevel) return alert('Write something first!');

    clearFeedback();
    feedbackSection.style.display = 'block';
    feedbackText.style.color = '#111';
    feedbackText.innerHTML = '⏳ Checking...';
    spinner.style.display = 'inline';

    try {
      // --- Call server API ---
      const response = await fetch(`/api/writing/${currentLevel}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      const { correctedText, mistakes, explanation, grade } = data;

      // --- Highlight mistakes in original text ---
      const highlighted = highlightMistakes(text, mistakes);

      feedbackText.innerHTML = `
<b>Your Text (mistakes underlined):</b><br><br>
${highlighted}<br><br>
<b>Corrected Version:</b><br><span class="corrected">${escapeHTML(correctedText)}</span><br><br>
<b>Explanation:</b><br>${escapeHTML(explanation)}<br><br>
<b>Grade:</b> ${grade}/100
      `;

    } catch (err) {
      feedbackText.style.color = 'red';
      feedbackText.textContent = '❌ Error checking your text.';
      console.error(err);
    } finally {
      spinner.style.display = 'none';
    }
  });

  // Start buttons click
  startButtons.forEach(btn => btn.addEventListener('click', () => startWriting(btn.dataset.level)));

  // URL param support
  const params = new URLSearchParams(window.location.search);
  const levelFromURL = params.get('level');
  if (levelFromURL) startWriting(levelFromURL);
}

// DATABASE

saveFeedbackBtn.addEventListener("click", async () => {
  const feedbackText = document.getElementById("feedback-text").innerText;

  if (!feedbackText) return;

  try {
    const res = await fetch("/api/writing/save-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback: feedbackText, level: level }),
    });

    const data = await res.json();
    console.log("Saved:", data);
    alert("Feedback saved!");
  } catch (err) {
    console.error("Error:", err);
  }
});


// -------- CALL INIT --------
initializeWriting();