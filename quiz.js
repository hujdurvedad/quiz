let gameId = null;
let currentQuestion = null;

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
        console.error('Greška prilikom startovanja igre:', error);
    }
}

function showQuestion() {
    let questionTitle = document.getElementById('question');
    let answersContainer = document.getElementById('answer-text');
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
            answerQuestion(option.text);
        });
    });
}

async function answerQuestion(answerText) {
    try {
        console.log('Šaljem odgovor za pitanje:', currentQuestion);

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
        console.log('Server odgovor:', data);

        if (data.correct && data.nextQuestion) {
            currentQuestion = data.nextQuestion;
            showQuestion();
        } else {
            showGameOver();
        }
    } catch (error) {
        console.error('Greška prilikom slanja odgovora:', error);
    }
}


function showGameOver() {
    let questionTitle = document.getElementById('question');
    let answersContainer = document.getElementById('answer-text');
    questionTitle.textContent = 'Kviz završen!';
    answersContainer.innerHTML = '';
}

window.addEventListener('load', function () {
    startGame();
});
