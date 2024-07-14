const wordElement = document.getElementById("word");
const wrongLettersElement = document.getElementById("wrong-letters");
const playAgainButton = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const finalMessageRevealWord = document.getElementById("final-message-reveal-word");
const figureParts = document.querySelectorAll(".figure-part");

const wordsAPIUrl = "https://random-word-api.herokuapp.com/word?number=50";

let words = [];
let selectedWord = "";
let playable = true;
const correctLetters = [];
const wrongLetters = [];

async function fetchWords() {
    try {
        const response = await fetch(wordsAPIUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch words from API");
        }
        const data = await response.json();
        return data; // Assuming API returns an array of words
    } catch (error) {
        console.error("Error fetching words:", error);
        return [];
    }
}

async function initGame() {
    try {
        words = await fetchWords();
        if (words.length === 0) {
            throw new Error("No words fetched from API");
        }
        selectedWord = words[Math.floor(Math.random() * words.length)];
        displayWord();
    } catch (error) {
        console.error("Error initializing game:", error);
        // Handle initialization error, e.g., show error message to user
        finalMessage.innerText = "Error initializing game. Please try again later.";
        finalMessageRevealWord.innerText = "";
        popup.style.display = "flex";
        playable = false;
    }
}

function displayWord() {
    wordElement.innerHTML = `
    ${selectedWord
            .split("")
            .map(
                (letter) => `
          <span class="letter">
            ${correctLetters.includes(letter) ? letter : ""}
          </span>
        `
            )
            .join("")}
  `;

    const innerWord = wordElement.innerText.replace(/\n/g, "");
    if (innerWord === selectedWord) {
        finalMessage.innerText = "Congratulations! You won! 😃";
        finalMessageRevealWord.innerText = "";
        popup.style.display = "flex";
        playable = false;
    }
}

function updateWrongLettersElement() {
    wrongLettersElement.innerHTML = `
    ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`).join("")}
  `;

    figureParts.forEach((part, index) => {
        part.style.display = index < wrongLetters.length ? "block" : "none";
    });

    if (wrongLetters.length === figureParts.length) {
        finalMessage.innerText = "Unfortunately you lost. 😕";
        finalMessageRevealWord.innerText = `...the word was: ${selectedWord}`;
        popup.style.display = "flex";
        playable = false;
    }
}

function showNotification() {
    notification.classList.add("show");
    setTimeout(() => {
        notification.classList.remove("show");
    }, 2000);
}

window.addEventListener("keypress", (e) => {
    if (playable) {
        const letter = e.key.toLowerCase();
        if (letter >= "a" && letter <= "z") {
            if (selectedWord.includes(letter)) {
                if (!correctLetters.includes(letter)) {
                    correctLetters.push(letter);
                    displayWord();
                } else {
                    showNotification();
                }
            } else {
                if (!wrongLetters.includes(letter)) {
                    wrongLetters.push(letter);
                    updateWrongLettersElement();
                } else {
                    showNotification();
                }
            }
        }
    }
});

playAgainButton.addEventListener("click", () => {
    playable = true;
    correctLetters.length = 0;
    wrongLetters.length = 0;
    selectedWord = words[Math.floor(Math.random() * words.length)];
    displayWord();
    updateWrongLettersElement();
    popup.style.display = "none";
});

// Initialize the game
initGame();
