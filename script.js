const intro = document.getElementById("intro");
const puzzleCard = document.getElementById("puzzle-card");
const endingCard = document.getElementById("ending-card");
const beginBtn = document.getElementById("begin-btn");
const puzzleEmoji = document.getElementById("puzzle-emoji");
const puzzleTitle = document.getElementById("puzzle-title");
const puzzlePrompt = document.getElementById("puzzle-prompt");
const puzzleContent = document.getElementById("puzzle-content");
const feedback = document.getElementById("feedback");
const hintBtn = document.getElementById("hint-btn");
const hintText = document.getElementById("hint-text");
const progressFill = document.getElementById("progress-fill");
const stepLabel = document.getElementById("step-label");
const heartsLabel = document.getElementById("hearts-label");
const letterModal = document.getElementById("letter-modal");

let currentPuzzle = 0;
let solved = [false, false, false];

const puzzles = [
  {
    emoji: "🔎",
    title: "A Tiny Riddle",
    prompt: "I have a face and two hands, but no arms or legs. I help you count the moments until we meet. What am I?",
    hint: "You might glance at it when you're waiting for someone special.",
    type: "choice",
    answers: ["A teddy bear", "A clock", "A flower", "A book"],
    correct: "A clock",
    success: "That's right! Every moment with you is precious. ♡"
  },
  {
    emoji: "🔤",
    title: "The Secret Word",
    prompt: "Unscramble these letters to find the word that makes the world feel warmer: <strong>V O L E</strong>",
    hint: "Rearrange the four letters. It's what this little game is all about.",
    type: "text",
    accepted: ["love"],
    success: "You found it! The best four-letter word. 💗"
  },
  {
    emoji: "💜",
    title: "What Matters Most?",
    prompt: "Choose the answer to open the final lock. What makes a little gift truly special?",
    hint: "It's not about how expensive something is. Think about the feeling behind it.",
    type: "choice",
    answers: ["Its price tag", "How big it is", "The love behind it", "The wrapping paper"],
    correct: "The love behind it",
    success: "Exactly! And this little box is filled with love for you. 💌"
  }
];

function beginGame() {
  currentPuzzle = 0;
  solved = [false, false, false];
  intro.classList.add("hidden");
  endingCard.classList.add("hidden");
  puzzleCard.classList.remove("hidden");
  renderPuzzle();
}

function renderPuzzle() {
  const p = puzzles[currentPuzzle];
  puzzleEmoji.textContent = p.emoji;
  puzzleTitle.textContent = p.title;
  puzzlePrompt.innerHTML = p.prompt;
  puzzleContent.replaceChildren();
  feedback.textContent = "";
  hintText.textContent = p.hint;
  hintText.classList.add("hidden");
  hintBtn.textContent = "Need a tiny clue? 💭";
  stepLabel.textContent = `PUZZLE ${currentPuzzle + 1} OF ${puzzles.length}`;
  heartsLabel.textContent = solved.map(v => v ? "♥" : "♡").join(" ");
  progressFill.style.width = `${(currentPuzzle / puzzles.length) * 100}%`;

  if (p.type === "choice") {
    const grid = document.createElement("div");
    grid.className = "answer-grid";
    p.answers.forEach(answer => {
      const button = document.createElement("button");
      button.className = "answer-btn";
      button.textContent = answer;
      button.addEventListener("click", () => checkChoice(button, answer, p));
      grid.appendChild(button);
    });
    puzzleContent.appendChild(grid);
  } else {
    const form = document.createElement("form");
    form.className = "word-answer";
    const input = document.createElement("input");
    input.type = "text";
    input.id = "word-input";
    input.placeholder = "Type your answer...";
    input.autocomplete = "off";
    input.setAttribute("aria-label", "Your answer");
    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = "Unlock";
    form.append(input, button);
    form.addEventListener("submit", event => {
      event.preventDefault();
      checkText(input.value, p, input);
    });
    puzzleContent.appendChild(form);
    input.focus({ preventScroll: true });
  }
}

function checkChoice(button, answer, puzzle) {
  if (solved[currentPuzzle]) return;
  if (answer === puzzle.correct) {
    button.classList.add("correct");
    handleCorrect(puzzle);
  } else {
    button.classList.add("wrong");
    feedback.textContent = "Not quite, sweetheart. Try again! ♡";
  }
}

function checkText(value, puzzle, input) {
  if (solved[currentPuzzle]) return;
  if (puzzle.accepted.includes(value.trim().toLowerCase())) {
    input.classList.add("correct");
    handleCorrect(puzzle);
  } else {
    feedback.textContent = "Almost! Rearrange the letters and try again. 💭";
    input.focus();
    input.select();
  }
}

function handleCorrect(puzzle) {
  solved[currentPuzzle] = true;
  feedback.textContent = puzzle.success;
  heartsLabel.textContent = solved.map(v => v ? "♥" : "♡").join(" ");
  progressFill.style.width = `${((currentPuzzle + 1) / puzzles.length) * 100}%`;
  puzzleContent.querySelectorAll("button, input").forEach(el => el.disabled = true);

  const next = document.createElement("button");
  next.className = "primary-btn";
  next.style.marginTop = "12px";
  next.textContent = currentPuzzle === puzzles.length - 1 ? "Unlock the secret box 💝" : "Next little puzzle →";
  next.addEventListener("click", () => {
    currentPuzzle++;
    if (currentPuzzle >= puzzles.length) showEnding();
    else renderPuzzle();
  });
  puzzleContent.appendChild(next);
}

function showEnding() {
  puzzleCard.classList.add("hidden");
  endingCard.classList.remove("hidden");
  progressFill.style.width = "100%";
}

function openLetter() {
  letterModal.classList.remove("hidden");
  document.getElementById("close-letter-btn").focus();
}

function closeLetter() {
  letterModal.classList.add("hidden");
}

beginBtn.addEventListener("click", beginGame);
hintBtn.addEventListener("click", () => {
  hintText.classList.toggle("hidden");
  hintBtn.textContent = hintText.classList.contains("hidden") ? "Need a tiny clue? 💭" : "Hide the clue ♡";
});
document.getElementById("open-letter-btn").addEventListener("click", openLetter);
document.getElementById("close-letter-btn").addEventListener("click", closeLetter);
letterModal.addEventListener("click", event => {
  if (event.target === letterModal) closeLetter();
});
document.getElementById("again-btn").addEventListener("click", () => {
  closeLetter();
  beginGame();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeLetter();
});
