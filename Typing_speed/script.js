const textToTypeElement = document.getElementById('text-to-type');
const inputArea = document.getElementById('input-area');
const timeTakenDisplay = document.getElementById('time-taken');
const accuracyDisplay = document.getElementById('accuracy');
const wpmDisplay = document.getElementById('wpm');
const scoreDisplay = document.getElementById('score');
const restartButton = document.getElementById('restart-button');

let startTime, endTime;
let originalText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. Mauris ultricies magna sit amet ante euismod, ac tincidunt quam pulvinar. In hac habitasse platea dictumst. Integer non elementum dui. Quisque fermentum, sem et varius dictum, nisl purus bibendum nisl, nec dictum sapien nibh id justo. Duis tempus, metus at dapibus sollicitudin, est erat tincidunt ex, sit amet consectetur tortor lorem eget sapien.";
let shuffledText = shuffleWords(originalText);
textToTypeElement.innerText = shuffledText;

inputArea.addEventListener('focus', () => {
    if (!startTime) {
        startTime = new Date();
    }
});

inputArea.addEventListener('input', () => {
    const typedText = inputArea.value;
    const currentTime = new Date();
    const timeElapsed = (currentTime - startTime) / 1000 / 60; // Time in minutes
    
    if (timeElapsed > 0) {
        const wordsTyped = typedText.split(' ').length;
        const wpm = Math.round(wordsTyped / timeElapsed); // Calculate WPM
        wpmDisplay.innerText = `Typing Speed: ${wpm} WPM`;
    }

    if (typedText === shuffledText) {
        endTime = new Date();
        const timeTaken = (endTime - startTime) / 1000;
        timeTakenDisplay.innerText = `Time Taken: ${timeTaken.toFixed(2)} seconds`;

        const correctChars = typedText.split('').filter((char, index) => char === shuffledText[index]).length;
        const accuracy = (correctChars / shuffledText.length) * 100;
        accuracyDisplay.innerText = `Accuracy: ${accuracy.toFixed(2)}%`;

        const score = calculateScore(timeTaken, accuracy, wpm);
        scoreDisplay.innerText = `Score: ${score}`;
        
        saveScore(score);
        displayScoreHistory();
    }
});

restartButton.addEventListener('click', () => {
    shuffledText = shuffleWords(originalText);
    textToTypeElement.innerText = shuffledText;
    inputArea.value = '';
    timeTakenDisplay.innerText = '';
    accuracyDisplay.innerText = '';
    wpmDisplay.innerText = '';
    scoreDisplay.innerText = '';
    startTime = null;
    endTime = null;
});

function shuffleWords(text) {
    const words = text.split(' ');
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
    return words.join(' ');
}

function calculateScore(time, accuracy, wpm) {
    const timeScore = Math.max(0, 100 - time * 2);
    const accuracyScore = (accuracy / 100) * 100;
    const speedScore = wpm * 0.5; // Adjust the impact of WPM on the score
    return Math.round(timeScore + accuracyScore + speedScore);
}

function saveScore(score) {
    let scores = JSON.parse(localStorage.getItem('typingScores')) || [];
    scores.push(score);
    localStorage.setItem('typingScores', JSON.stringify(scores));
}

function displayScoreHistory() {
    let scores = JSON.parse(localStorage.getItem('typingScores')) || [];
    alert(`Previous Scores: ${scores.join(', ')}`);
}
