'use strict';

let secretNumber = Math.floor(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;

function setMessage(msg, className) {
  document.querySelector(`.${className}`).textContent = msg;
}

document.querySelector('.check').addEventListener('click', function () {
  const guessElem = document.querySelector('.guess');
  const guess = Number(guessElem.value);

  if (!guess) {
    setMessage('⛔️ No number!', 'message');
  } else if (guess !== secretNumber) {
    if (score > 0) {
      score--;
      let msg = guess < secretNumber ? '📉 Too low!' : '📈 Too high!';
      setMessage(msg, 'message');
      setMessage(score, 'score');
    } else {
      setMessage('💥 You lost the game!', 'message');
      setMessage(0, 'score');
    }
  } else {
    setMessage('🎉 Correct Number!', 'message');
    setMessage(secretNumber, 'number');

    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';

    if (score > highscore) {
      highscore = score;
      setMessage(highscore, 'highscore');
    }
  }
});

document.querySelector('.again').addEventListener('click', function () {
  score = 20;
  secretNumber = Math.floor(Math.random() * 20) + 1;

  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';

  setMessage('Start guessing...', 'message');
  setMessage(score, 'score');
  setMessage('?', 'number');
  setMessage('', 'guess');
});
