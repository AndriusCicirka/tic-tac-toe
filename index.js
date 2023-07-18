'use strict';

let gameOver = false;
let playerMarker = null;
let foeMarker = null;
let whoseTurn = null;

let playerScore;
let foeScore;

const winningCombinations = [
	[1, 2, 3],
	[4, 5, 6],
	[7, 8, 9],
	[1, 4, 7],
	[2, 5, 8],
	[3, 6, 9],
	[1, 5, 9],
	[3, 5, 7],
];

const cells = {
	x: [],
	o: [],
	available: [1, 2, 3, 4, 5, 6, 7, 8, 9],
};

const startButton = document.getElementById('start-button');
const playButton = document.getElementById('play-button');
const restartButton = document.getElementById('restart-button');
const playAgainButton = document.getElementById('play-again--button');
const menuButton = document.getElementById('menu-button');

const underHeadingText = document.querySelector('.game-under--heading');

const sideSelectionMenu = document.querySelector('.game-side--select');
const sideX = document.querySelector('.game-side--x');
const sideO = document.querySelector('.game-side--o');

const playerScoreValue = document.querySelector('.game-score--player1--value');
const foeScoreValue = document.querySelector('.game-score--player2--value');

const gameScoreDash = document.querySelector('.game-score--wrap');
const gameGrid = document.querySelector('.game-grid');

//
//
//
//

const resetGrid = () => {
	for (let cell of gameGrid.children) {
		cell.textContent = '';
		cell.classList.remove('red');
	}

	cells.x = [];
	cells.o = [];
	cells.available = [1, 2, 3, 4, 5, 6, 7, 8, 9];

	gameOver = false;
};

const updateScore = (clear = false) => {
	if (clear) {
		playerScore = 0;
		foeScore = 0;
	}

	playerScoreValue.textContent = playerScore;
	foeScoreValue.textContent = foeScore;
};

const updateTurn = () => {
	whoseTurn === 'x' ? (whoseTurn = 'o') : (whoseTurn = 'x');

	if (playerMarker === whoseTurn) {
		underHeadingText.textContent = 'Your turn';
	} else {
		underHeadingText.textContent = "Foe's turn";
		aiMove();
	}
};

//
//
//
//

startButton.addEventListener('click', (event) => {
	event.preventDefault();

	underHeadingText.textContent = 'Pick your side';
	startButton.classList.add('hide');

	playButton.classList.remove('hide');
	sideSelectionMenu.classList.remove('hide');
	underHeadingText.classList.remove('hide');
});

sideX.addEventListener('click', () => {
	sideX.classList.add('game-side--x--active');

	sideO.classList.remove('game-side--o--active');
	underHeadingText.classList.remove('red');

	playerMarker = 'x';
	foeMarker = 'o';
});

sideO.addEventListener('click', () => {
	sideO.classList.add('game-side--o--active');

	sideX.classList.remove('game-side--x--active');
	underHeadingText.classList.remove('red');

	playerMarker = 'o';
	foeMarker = 'x';
});

playButton.addEventListener('click', (event) => {
	event.preventDefault();
	updateScore(true);

	if (!playerMarker) {
		underHeadingText.classList.add('red');
	} else {
		playButton.classList.add('hide');
		sideSelectionMenu.classList.add('hide');

		gameGrid.classList.remove('hide');
		gameScoreDash.classList.remove('hide');
		restartButton.classList.remove('hide');
		menuButton.classList.remove('hide');

		updateTurn();
	}
});

menuButton.addEventListener('click', (event) => {
	event.preventDefault();

	resetGrid();

	startButton.classList.remove('hide');

	sideX.classList.remove('game-side--x--active');
	sideO.classList.remove('game-side--o--active');

	playButton.classList.add('hide');
	sideSelectionMenu.classList.add('hide');
	underHeadingText.classList.add('hide');
	gameScoreDash.classList.add('hide');
	restartButton.classList.add('hide');
	menuButton.classList.add('hide');
	gameGrid.classList.add('hide');
	playAgainButton.classList.add('hide');

	playerMarker = null;
	whoseTurn = null;
});

playAgainButton.addEventListener('click', (event) => {
	event.preventDefault();
	playAgainButton.classList.add('hide');
	resetGrid();
	updateTurn();
});

restartButton.addEventListener('click', (event) => {
	event.preventDefault();
	playAgainButton.classList.add('hide');
	resetGrid();
	updateTurn();
	updateScore(true);
});

//
//
//
//

gameGrid.addEventListener('click', (event) => {
	event.preventDefault();

	let cell = event.target;
	let cellId;

	if (
		cell.textContent.length === 0 &&
		!gameOver &&
		whoseTurn === playerMarker
	) {
		cell.textContent = whoseTurn;
		cellId = +event.target.id.split('-')[0];
		cells[whoseTurn].push(cellId);
		cells.available = cells.available.filter((num) => num != cellId);
		checkForWin(whoseTurn);

		if (!gameOver) updateTurn();
	}
});

const aiMove = () => {
	let cellId;

	if (whoseTurn === foeMarker) {
		setTimeout(function () {
			cellId =
				cells.available[Math.floor(Math.random() * cells.available.length)];
			cells[whoseTurn].push(cellId);
			cells.available = cells.available.filter((num) => num != cellId);

			document.getElementById(`${cellId}-cell`).textContent = whoseTurn;
			checkForWin(whoseTurn);

			if (!gameOver) updateTurn();
		}, 750);
	}
};

const checkForWin = (side) => {
	let flag = false;
	if (cells[side].length > 2) {
		for (let combination of winningCombinations) {
			if (combination.every((num) => cells[side].includes(num))) {
				gameOver = true;

				for (let num of combination) {
					document.getElementById(`${num}-cell`).classList.add('red');
				}

				if (playerMarker === whoseTurn) {
					underHeadingText.textContent = 'You won!';
					playerScore++;
				} else {
					underHeadingText.textContent = 'Foe won!';
					foeScore++;
				}

				flag = true;
				playAgainButton.classList.remove('hide');
				updateScore();

				break;
			}
		}

		if (cells.x.length + cells.o.length === 9 && !flag) {
			gameOver = true;
			underHeadingText.textContent = 'Draw!';
		}
	}
};
