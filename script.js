const gridSize = 6;
const numPairs = (gridSize * gridSize) / 2;

const emojis = ['🎄', '🎅', '❄️', '🎁', '🦌', '⛄', '🍪', '🌟', '🛷', '🎶', '🔔', '🥂', '🧦', '🍫', '🪵', '🕯️', '☃️', '🎍'];
const symbols = generateSymbols(numPairs);
let cardsArray = [...symbols, ...symbols];
shuffle(cardsArray);

const gameBoard = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const backButton = document.getElementById('back');
const playerInputDiv = document.getElementById('player-input');
const playerNameInput = document.getElementById('player-name');
const startGameButton = document.getElementById('start-game');
const leaderboardList = document.getElementById('leaderboard-list');
const headerDiv = document.querySelector('.header');

let flippedCards = [];
let matchedPairs = 0;
let timer = 0;
let timerInterval;
let playerName = '';
let leaderboard = loadLeaderboard();

function initGame() {
  clearInterval(timerInterval);
  timer = 0;
  timerElement.textContent = `Time: ${timer}s`;
  flippedCards = [];
  matchedPairs = 0;

  cardsArray = [...symbols, ...symbols];
  shuffle(cardsArray);

  gameBoard.innerHTML = '';
  renderCards();

  timerElement.style.display = 'block';
  backButton.style.display = 'block';
  gameBoard.style.display = 'grid';

  timerInterval = setInterval(() => {
    timer++;
    timerElement.textContent = `Time: ${timer}s`;
  }, 1000);
}

startGameButton.addEventListener('click', () => {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert('Please enter your name!');
    return;
  }
  playerInputDiv.style.display = 'none';
  headerDiv.style.display = 'none';
  leaderboardList.style.display = 'none';
  gameBoard.style.display = 'grid';
  initGame();
});

// Back button click event
backButton.addEventListener('click', () => {
  clearInterval(timerInterval); // Stop the timer if the user clicks back
  timer = 0;
  timerElement.textContent = `Time: ${timer}s`; // Reset the timer display

  // Hide game board and timer, show the player input and leaderboard
  gameBoard.style.display = 'none';
  timerElement.style.display = 'none';
  backButton.style.display = 'none';
  playerInputDiv.style.display = 'block';
  headerDiv.style.display = 'block';
  leaderboardList.style.display = 'block'; // Show leaderboard again
  flippedCards = [];
  matchedPairs = 0; // Reset matched pairs for the next game
  leaderboardList.style.display = 'block'; // Ensure leaderboard is displayed on returning
});

function renderCards() {
  cardsArray.forEach((symbol) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    gameBoard.appendChild(card);

    const emoji = document.createElement('div');
    emoji.textContent = symbol;
    emoji.classList.add('emoji');
    card.appendChild(emoji);

    card.addEventListener('click', () => handleCardClick(card));
  });
}

function handleCardClick(card) {
  if (card.classList.contains('flipped') || flippedCards.length === 2) {
    return;
  }

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkForMatch();
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.symbol === card2.dataset.symbol) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs++;

    if (matchedPairs === numPairs) {
      clearInterval(timerInterval);
      alert(`Congratulations, ${playerName}! You completed the game in ${timer}s.`);
      updateLeaderboard(playerName, timer);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
    }, 1000);
  }

  flippedCards = [];
}

function updateLeaderboard(playerName, time) {
  leaderboard.push({ name: playerName, time: time });
  leaderboard.sort((a, b) => a.time - b.time);

  if (leaderboard.length > 5) {
    leaderboard.pop(); // Keep top 5 scores
  }

  saveLeaderboard();
  displayLeaderboard();
}

function displayLeaderboard() {
  leaderboardList.innerHTML = '';
  leaderboard.forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = `${entry.name} - ${entry.time}s`;
    leaderboardList.appendChild(li);
  });
  leaderboardList.style.display = 'block';
}

function loadLeaderboard() {
  const storedLeaderboard = localStorage.getItem('leaderboard');
  return storedLeaderboard ? JSON.parse(storedLeaderboard) : [];
}

function saveLeaderboard() {
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function generateSymbols(numPairs) {
  return emojis.slice(0, numPairs);
}

displayLeaderboard(); // Show leaderboard when page loads
