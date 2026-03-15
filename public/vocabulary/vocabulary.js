const wordInput = document.getElementById("word-input");
const translationInput = document.getElementById("translation-input");
const exampleInput = document.getElementById("example-input");

const addBtn = document.getElementById("add-word-btn");
const wordList = document.getElementById("word-list");

const practiceBox = document.getElementById("practice-box");

const practiceWord = document.getElementById("practice-word");
const practiceAnswer = document.getElementById("practice-answer");
const checkBtn = document.getElementById("check-answer");
const feedback = document.getElementById("practice-feedback");
const sentenceBtn = document.getElementById("give-sentence");
const writtenSentence = document.getElementById("sentence")
const nextWord = document.getElementById("next-word")

const addCard = document.getElementById("card-add");
const listCard = document.getElementById("card-list");
const practiceCard = document.getElementById("card-practice");
const menuOptions = document.getElementById("menu-options");

const introSection = document.getElementById("intro");
const addSection = document.getElementById("add-word-section");
const listSection = document.getElementById("list-section");
const practiceSection = document.getElementById("practice-section");
const dashboard = document.getElementById("dashboard-cards");


document.addEventListener("DOMContentLoaded", () => {
    renderWords();
    hideAllSections();
    dashboard.style.display = "flex";
});

function hideAllSections() {
    addSection.style.display = "none";
    listSection.style.display = "none";
    practiceSection.style.display = "none";
    menuOptions.style.display = "none";
}

addCard.addEventListener("click", () => {
    hideAllSections();
    introSection.classList.add("hidden");
    dashboard.style.display = "none";
    addSection.style.display = "block";
    menuOptions.style.display = "block";
});

listCard.addEventListener("click", () => {
    hideAllSections();
    introSection.classList.add("hidden");
    dashboard.style.display = "none";
    listSection.style.display = "block";
    menuOptions.style.display = "block";
});

practiceCard.addEventListener("click", () => {
    hideAllSections();
    introSection.classList.add("hidden");
    dashboard.style.display = "none";
    practiceSection.style.display = "block";
    menuOptions.style.display = "block";

    if (vocab.length === 0) {
        alert("Add words first");
        return;
    }

    feedback.style.display = "none";
    practiceAnswer.value = "";
    practiceBox.style.display = "block";
    practiceAnswer.focus();

    loadRandomWord();
});



function loadRandomWord() {

    const random = vocab[Math.floor(Math.random() * vocab.length)];

    practiceWord.textContent = random.word;
    practiceBox.dataset.answer = random.translation;
    
    writtenSentence.textContent = "";
    writtenSentence.classList.add("hidden");

    feedback.style.display = "none";
    practiceAnswer.value = "";

}

menuOptions.addEventListener("click", () => {
    hideAllSections();
    dashboard.style.display = "flex";
    menuOptions.style.display = "none";
    introSection.classList.remove("hidden");
})

let vocab = JSON.parse(localStorage.getItem("vocab")) || [];

function saveWords() {
    localStorage.setItem("vocab", JSON.stringify(vocab));
}

function renderWords() {

    wordList.innerHTML = "";

    vocab.forEach((item, index) => {

        const li = document.createElement("li");

        const word = document.createElement("strong");
        word.textContent = item.word;

        const translation = document.createTextNode(` – ${item.translation}`);

        const example = document.createElement("em");
        example.textContent = item.example;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", () => {
            deleteWord(index);
        });

        li.append(word, translation, document.createElement("br"), example, deleteBtn);

        wordList.appendChild(li);
    });

}

addBtn.addEventListener("click", () => {

    const word = wordInput.value.trim();
    const translation = translationInput.value.trim();
    const example = exampleInput.value.trim();

    if (!word || !translation) return;

    vocab.push({ word, translation, example });

    saveWords();
    renderWords();

    wordInput.value = "";
    translationInput.value = "";
    exampleInput.value = "";

});

function deleteWord(index) {

    vocab.splice(index, 1);

    saveWords();
    renderWords();

}

// -------- FETCH FOR SENTENCE --------

async function giveSentenceFromAI(word) {

    sentenceBtn.disabled = true;

    try {

        const response = await fetch(`/api/vocabulary/${encodeURIComponent(word)}`);
    
        if (!response.ok) {
            const err = await response.text();
            throw new Error(err);
        }
    
        const data = await response.json();
    
        renderSentence(data);
        
    
      } catch (error) {
    
        writtenSentence.textContent = "❌ Error loading sentence.";
        console.error(error);
    
      }
}

function renderSentence(data) {
    
    writtenSentence.textContent = data.text;
  
  }


sentenceBtn.addEventListener("click", ()=> {
    
    const word = practiceWord.textContent.trim();
    if (!word) {
        alert("Please enter a word first.");
        return;
    }
    giveSentenceFromAI(word)
    writtenSentence.classList.remove("hidden");

});

checkBtn.addEventListener("click", () => {

    const user = practiceAnswer.value.trim().toLowerCase();
    const correct = practiceBox.dataset.answer.toLowerCase();

    const normalize = (text) => text.toLowerCase().trim();

    if (normalize(user) === normalize(correct)) {

        feedback.style.display = "block";
        feedback.textContent = "Correct!";
        feedback.style.color = "green";

    } else {

        feedback.style.display = "block";
        feedback.textContent = `Correct answer: ${correct}`;
        feedback.style.color = "red";

    }

});

nextWord.addEventListener("click", () => {

    practiceAnswer.focus();

    loadRandomWord();

});

translationInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addBtn.click();
    }
});

