const player = document.querySelector('.player');
const game = document.querySelector('.game');
const platforms = document.getElementsByClassName('platform');
const scoretxt = document.querySelector('.score');
const startBtn = document.querySelector('.start-btn');
const menu = document.querySelector('.menu');
const playTxt = menu.querySelectorAll('p');

const width = 900;
const platformWidth = 50;
let xPlayer = 450;
let yPlayer = 10;
const spaceBetweenPlatforms = 60;
const speedPlayer = 10;
const jumpHeight = 30;
let gameStarted = 0;
let firstJump;
const xPlatforms = [];
let keysPressed = {};
let score;

const initGame = () => {
	menu.classList.toggle('hide');
	playTxt[0].classList.add('hide');
	playTxt[1].classList.remove('hide');
	gameStarted = 1;
	firstJump = 0;
	score = 0;
	xPlatforms.push(0);
	xPlatforms.push(450);
	initPlatform();
};
const clearPlatforms = () => {
	const n = platforms.length;
	for (let i = 0; i < n; i++) {
		platforms[0].remove();
		xPlatforms.shift();
	}
};
const gameOver = () => {
	clearPlatforms();
	menu.classList.toggle('hide');
	gameStarted = 0;
};
const newXPlatform = (i) => {
	let newX =
		xPlatforms[i - 1] +
		Math.floor(
			Math.random() * spaceBetweenPlatforms * 2 - spaceBetweenPlatforms
		);
	if (newX < 0) {
		newX = -newX;
	} else if (newX > width - platformWidth) {
		console.log(newX);
		newX = newX - (newX - (900 - platformWidth));
		console.log(`to ${newX}`);
	}
	xPlatforms.push(newX);
};
const initPlatform = () => {
	for (let i = 0; i < 17; i++) {
		createPlatform();
	}
	platforms[0].style.left = `-10px`;
	platforms[0].style.bottom = `0px`;
	platforms[0].style.width = `${width + 20}px`;

	platforms[1].style.left = `450px`;
	platforms[1].style.bottom = `30px`;
	for (let i = 2; i < 17; i++) {
		newXPlatform(i);
		platforms[i].style.left = `${xPlatforms[i]}px`;
		platforms[i].style.bottom = `${30 * i}px`;
	}
};
const movePlatforms = () => {
	if (firstJump === 0) firstJump = 1;
	platforms[0].remove();
	xPlatforms.shift();
	for (let i = 0; i < platforms.length; i++) {
		platforms[i].style.bottom = `${30 * i}px`;
	}
	createPlatform();
	newXPlatform(xPlatforms.length);
	platforms[16].style.left = `${xPlatforms[16]}px`;
	platforms[16].style.bottom = `${30 * 17}px`;
};
const createPlatform = () => {
	const newPlatform = document.createElement('div');
	newPlatform.classList.add('platform');
	game.append(newPlatform);
};
const playerFall = () => {
	if (yPlayer > 10) {
		yPlayer = 10;
		player.style.bottom = `${yPlayer}px`;
	}
};
const playerJump = (side = 0) => {
	yPlayer += jumpHeight;
	xPlayer += side * speedPlayer;
	player.style.bottom = `${yPlayer}px`;
	player.style.left = `${xPlayer}px`;
	if (xPlayer > xPlatforms[1] && xPlayer < xPlatforms[1] + platformWidth) {
		score++;
		scoretxt.textContent = `score ${score}`;
		setTimeout(movePlatforms, 300);
	}
	setTimeout(playerFall, 260);
};
const moveSide = (side) => {
	if (xPlayer + speedPlayer > speedPlayer) {
		xPlayer += side * speedPlayer;
		player.style.left = `${xPlayer}px`;
	}
};
const playerMove = () => {
	if (gameStarted === 1) {
		if (
			firstJump === 1 &&
			(xPlayer < xPlatforms[0] || xPlayer > xPlatforms[0] + platformWidth)
		) {
			gameOver();
		}
		if (
			(keysPressed['w'] || keysPressed['W']) &&
			(keysPressed['a'] || keysPressed['A']) &&
			yPlayer === 10
		) {
			playerJump();
			moveSide(-1);
		} else if (
			(keysPressed['w'] || keysPressed['W']) &&
			(keysPressed['d'] || keysPressed['D']) &&
			yPlayer === 10
		) {
			playerJump();
			moveSide(1);
		} else if ((keysPressed['w'] || keysPressed['W']) && yPlayer === 10) {
			playerJump();
		} else if (keysPressed['a'] || keysPressed['A']) {
			moveSide(-1);
		} else if (keysPressed['d'] || keysPressed['D']) {
			moveSide(1);
		}
	}
};
startBtn.addEventListener('click', initGame);

document.addEventListener('keydown', (e) => {
	keysPressed[e.key] = true;
	playerMove();
});

document.addEventListener('keyup', (e) => {
	delete keysPressed[e.key];
});
