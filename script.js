const colors = ["green", "red", "yellow", "blue"];
let sequence = [];
let userSequence = [];
let soundEnabled = true;
let score = 0;
let highScore = localStorage.getItem("highscore") || 0;

document.getElementById("highscore").innerText = highScore;

const soundMap = {
    green: new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"),
    red: new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg"),
    yellow: new Audio("https://actions.google.com/sounds/v1/cartoon/wood_clicks.ogg"),
    blue: new Audio("https://actions.google.com/sounds/v1/cartoon/pop.ogg"),
};

function playSound(color) {
    if (soundEnabled) soundMap[color].play();
}

function flashColor(color) {
    const box = document.querySelector(`[data-color="${color}"]`);
    box.classList.add("flash");
    playSound(color);
    setTimeout(() => box.classList.remove("flash"), 300);
}

function generateSequence() {
    sequence.push(colors[Math.floor(Math.random() * 4)]);
}

function playSequence() {
    let i = 0;
    const interval = setInterval(() => {
        flashColor(sequence[i]);
        i++;
        if (i >= sequence.length) clearInterval(interval);
    }, getDifficultySpeed());
}

function getDifficultySpeed() {
    const difficulty = document.getElementById("difficulty").value;
    if (difficulty === "easy") return 800;
    if (difficulty === "medium") return 550;
    return 350; // hard
}

function startGame() {
    sequence = [];
    userSequence = [];
    score = 0;
    document.getElementById("score").innerText = score;

    generateSequence();
    playSequence();
}

function checkAnswer(index) {
    if (userSequence[index] !== sequence[index]) {
        alert("Game Over! Your score: " + score);

        if (score > highScore) {
            localStorage.setItem("highscore", score);
            document.getElementById("highscore").innerText = score;
        }
        return startGame();
    }

    if (userSequence.length === sequence.length) {
        score++;
        document.getElementById("score").innerText = score;

        userSequence = [];
        generateSequence();
        setTimeout(playSequence, 700);
    }
}

document.querySelectorAll(".color-box").forEach(box => {
    box.addEventListener("click", () => {
        const color = box.getAttribute("data-color");
        userSequence.push(color);
        flashColor(color);
        checkAnswer(userSequence.length - 1);
    });
});

document.getElementById("startBtn").addEventListener("click", startGame);

document.getElementById("toggleSound").addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    document.getElementById("toggleSound").innerText = soundEnabled
        ? "Sound: ON"
        : "Sound: OFF";
});