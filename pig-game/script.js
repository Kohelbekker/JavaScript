'use strict';

const player0Section = document.querySelector('.player--0');
const player1Section = document.querySelector('.player--1');
const diceImage = document.querySelector('.dice');

let activePlayer = document.querySelector('.player--active');

const init = () => {
  setTextValue(0, '#score--0');
  setTextValue(0, '#score--1');
  setTextValue(0, '#current--0');
  setTextValue(0, '#current--1');
  player1Section.classList.remove('player--active');
  player0Section.classList.add('player--active');
  diceImage.classList.add('hidden');
};

const setTextValue = (text, selector) => {
  document.querySelector(`${selector}`).textContent = text;
};

const generateDiceNum = () => {
  return Math.floor(Math.random() * 6) + 1;
};

const switchActivePlayer = () => {
  let newActive = activePlayer === player0Section ? player1Section : player0Section;

  activePlayer.querySelector('.current-score').textContent = 0;
  activePlayer.classList.remove('player--active');
  newActive.classList.add('player--active');
  activePlayer = newActive;
};

document.querySelector('.btn--roll').addEventListener('click', function () {
  const currentScore = activePlayer.querySelector('.current-score');

  if (activePlayer.querySelector('.score').textContent > 100) return;

  let diceNum = generateDiceNum();
  diceImage.classList.remove('hidden');
  diceImage.src = `dice-${diceNum}.png`;

  if (diceNum !== 1) {
    currentScore.textContent = diceNum + +currentScore.textContent;
  } else {
    switchActivePlayer();
  }
});

document.querySelector('.btn--hold').addEventListener('click', function () {
  const score = activePlayer.querySelector('.score');

  if (activePlayer.querySelector('.score').textContent > 100) return;

  score.textContent = +score.textContent + +activePlayer.querySelector('.current-score').textContent;

  if (+score.textContent > 100) {
    diceImage.classList.add('hidden');
    alert(`${activePlayer.querySelector('.name').textContent} won the game!`);
  } else {
    switchActivePlayer();
  }
});

document.querySelector('.btn--new').addEventListener('click', function () {
  init();
});
