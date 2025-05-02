let gameId = null;
let currentQuestion = null;
let counter = 0;
let previousCorrect = false;
let streak = 0;
let progressCounter = 0;
let score = 0;
let timerInterval = null;
let timeLeft = 30;
let bestScore = 0;

async function startGame() {
    try {
        let response = await fetch('https://quiz-be-zeta.vercel.app/game/start', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        });
        let data = await response.json();
        gameId = data.gameId;
        currentQuestion = data.question;
        showQuestion();
    } catch (error) {
        console.error('Greška prilikom startovanja igre', error);
    }
}

function updateQuestionCounter() {
    if (counter === 20) {
        showGameOver();
    }
    counter++;
    const questionsNum = document.getElementById('questionsNum');
    questionsNum.innerHTML = counter;
}

function updateProgressBar() {
    progressCounter += 5;
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${progressCounter}%`;
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.innerHTML = score;
}

function updateBestScore() {
    const bestScoreElement = document.getElementById('best-score');
    bestScoreElement.textContent = bestScore;
}

function updateStreak() {
    const streakElement = document.getElementById('streak');
    streakElement.innerHTML = streak;
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = currentQuestion.timeLimit;
    const timerElement = document.getElementById('timer');
    timerElement.innerHTML = `${timeLeft}s`;

    timerInterval = setInterval(() => {
        timeLeft--;
        if (timerElement) timerElement.textContent = `${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById('answer-text').style.pointerEvents = 'none';
            answerQuestion("");
        }
    }, 1000);
}

function updateNumPlayed() {
    const numPlayed = localStorage.getItem('numPlayed');
    const playedCount = numPlayed ? parseInt(numPlayed) + 1 : 1;
    localStorage.setItem('numPlayed', playedCount);
    const numPlayedElement = document.getElementById('numPlayed');
    numPlayedElement.innerHTML = playedCount;
}

function gameLogic() {
    updateQuestionCounter();
    updateProgressBar();
    updateScore();
    updateBestScore();
    updateStreak();
    startTimer();
}

function showQuestion() {
    let questionTitle = document.getElementById('question');
    let answersContainer = document.getElementById('answer-text');
    if (!questionTitle || !answersContainer) return;

    questionTitle.textContent = currentQuestion.title;
    answersContainer.innerHTML = '';

    currentQuestion.options.forEach(function (option, index) {
        let answerDiv = document.createElement('div');
        answerDiv.className = 'answer';

        let answerNum = document.createElement('div');
        answerNum.className = 'answer-num';
        answerNum.textContent = String.fromCharCode(65 + index);

        let answerText = document.createElement('p');
        answerText.className = 'answer-text';
        answerText.textContent = option.text;

        answerDiv.appendChild(answerNum);
        answerDiv.appendChild(answerText);
        answersContainer.appendChild(answerDiv);

        answerDiv.addEventListener('click', function () {
            document.getElementById('answer-text').style.pointerEvents = 'none';
            answerQuestion(option.text);
        });
    });

    answersContainer.style.pointerEvents = 'auto';
    gameLogic();
}

async function answerQuestion(answerText) {
    try {
        clearInterval(timerInterval);
        let response = await fetch('https://quiz-be-zeta.vercel.app/game/answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                gameId: gameId,
                questionId: currentQuestion._id,
                answer: answerText,
            }),
        });

        const data = await response.json();

        if (data.correct) {
            if (previousCorrect) {
                streak++;
            } else {
                streak = 0;
                previousCorrect = true;
            }
        } else {
            streak = 0;
            previousCorrect = false;
        }

        if (data.correct && data.score && !isNaN(data.score)) {
            score += data.score;
        }

        updateScore();
        updateStreak();

        const answerDivs = document.querySelectorAll('.answer');
        const answersContainer = document.getElementById('answer-text');
        answersContainer.style.pointerEvents = 'none';

        answerDivs.forEach((div) => {
            const optionText = div.querySelector('.answer-text').textContent.trim().toLowerCase();
            const clickedAnswer = answerText.trim().toLowerCase();
            const correctAnswer = data.correctAnswer?.trim().toLowerCase();
            const answerNum = div.querySelector('.answer-num');

            if (optionText === clickedAnswer) {
                if (data.correct) {
                    div.classList.add('correct');
                    answerNum.classList.add('selected-correct');
                } else {
                    div.classList.add('incorrect');
                    answerNum.classList.add('selected-incorrect');
                }
            }

            if (!data.correct && correctAnswer && optionText === correctAnswer) {
                div.classList.add('correct');
            }
        });

        if (data.correct && data.nextQuestion) {
            setTimeout(() => {
                currentQuestion = data.nextQuestion;
                showQuestion();
            }, 3000);
        } else {
            if (data.correct) {
                updateProgressBar();
            }

            setTimeout(() => {
                showGameOver();
            }, 3000);
        }


    } catch (error) {
        console.error('Greška prilikom slanja odgovora:', error);
    }
}

function showGameOver() {
    let questionTitle = document.getElementById('question');
    let answersContainer = document.getElementById('answer-text');
    questionTitle.textContent = `Kviz završen! Osvojili ste ${score} bodova.`;
    answersContainer.innerHTML = '';
    clearInterval(timerInterval);

    if (score > bestScore) {
        localStorage.setItem('best-score', score);
        bestScore = score;
        updateBestScore();
    }

    updateNumPlayed();
}

window.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('question') && document.getElementById('answer-text')) {
        bestScore = parseInt(localStorage.getItem('best-score')) || 0;
        updateBestScore();
        startGame();
    }

    const numPlayedElement = document.getElementById('numPlayed');
    if (numPlayedElement) {
        const numPlayed = localStorage.getItem('numPlayed') || '0';
        numPlayedElement.innerHTML = numPlayed;
    }
});

const finishBtn = document.getElementById("finish-btn");
finishBtn.addEventListener("click", () => {
    showGameOver();
})