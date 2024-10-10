"use strict";
class CanvasInstance {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = CanvasInstance.getCanvas();
        }
        return this.instance;
    }
    static getCanvas() {
        const gameScreen = document.getElementById("game_screen");
        const boundedContext = gameScreen.getBoundingClientRect();
        const height = Math.floor(boundedContext.height) - Constants.BORDER_WIDTH;
        const width = Math.floor(boundedContext.width) - Constants.BORDER_WIDTH;
        gameScreen.height = height;
        gameScreen.width = width;
        return {
            canvasContext: gameScreen.getContext("2d"),
            height: height,
            width: width,
        };
    }
}
var _a;
class Constants {
}
_a = Constants;
Constants.BORDER_WIDTH = 1;
Constants.FPS = 60;
Constants.MILLISECONDS_PER_FRAME = 1000 / _a.FPS;
Constants.MILLISECONDS_RENDER_MINIMUM = Math.floor(_a.MILLISECONDS_PER_FRAME) - 1;
Constants.MILLISECONDS_RENDER_MAXIMUM = Math.floor(_a.MILLISECONDS_PER_FRAME) + 1;
class MoveableEntity {
    constructor(initialVerticalPosition, initialHorizontalPosition, height, width) {
        this.canvas = CanvasInstance.getInstance();
        this.movementService = new MovementService(height, width, this.canvas.height, this.canvas.width, initialVerticalPosition, initialHorizontalPosition);
    }
}
// @ts-ignore
class Enemy extends MoveableEntity {
    constructor(initialVerticalPosition, initialHorizontalPosition) {
        super(initialVerticalPosition, initialHorizontalPosition, Enemy.HEIGHT, Enemy.WIDTH);
    }
    draw() {
        this.updatePosition();
        const previousFillStyle = this.canvas.canvasContext.fillStyle;
        this.canvas.canvasContext.fillStyle = Enemy.COLOR;
        this.canvas.canvasContext.fillRect(this.movementService.horizontalPosition, this.movementService.verticalPosition, Enemy.WIDTH, Enemy.HEIGHT);
        this.canvas.canvasContext.fillStyle = previousFillStyle;
    }
    updatePosition() {
        if (this.movementService.isMovingLeft) {
            this.movementService.moveLeft(1);
        }
        else if (this.movementService.isMovingRight) {
            this.movementService.moveRight(1);
        }
    }
}
Enemy.HEIGHT = 25;
Enemy.WIDTH = 25;
Enemy.COLOR = "purple";
// @ts-ignore
class Player extends MoveableEntity {
    constructor() {
        super(Player.getInitialVerticalPosition(canvas.height), Player.getInitialHorizontalPosition(canvas.width), Player.HEIGHT, Player.WIDTH);
        this.isShooting = false;
        this.blaster = new Blaster(this.movementService.verticalPosition);
    }
    reset() {
        this.isShooting = false;
        this.movementService.verticalPosition = Player.getInitialVerticalPosition(canvas.height);
        this.movementService.horizontalPosition =
            Player.getInitialHorizontalPosition(canvas.width);
        this.blaster = new Blaster(this.movementService.verticalPosition);
    }
    draw() {
        this.updatePosition();
        const previousFillStyle = this.canvas.canvasContext.fillStyle;
        this.canvas.canvasContext.fillStyle = Player.COLOR;
        this.canvas.canvasContext.fillRect(this.movementService.horizontalPosition, this.movementService.verticalPosition, Player.WIDTH, Player.HEIGHT);
        this.canvas.canvasContext.fillStyle = previousFillStyle;
    }
    startMovingLeft() {
        this.movementService.startMovingLeft();
    }
    startMovingRight() {
        this.movementService.startMovingRight();
    }
    stopMovingRight() {
        this.movementService.stopMovingRight();
    }
    stopMovingLeft() {
        this.movementService.stopMovingLeft();
    }
    getNextShot() {
        if (!this.isShooting)
            return null;
        const blasterHorizontalOffset = this.movementService.horizontalPosition +
            Math.floor(Player.WIDTH / 2) -
            this.blaster.getBlasterHorizontalOffset();
        return this.blaster.shoot(blasterHorizontalOffset);
    }
    startShooting() {
        this.isShooting = true;
    }
    stopShooting() {
        this.isShooting = false;
    }
    increaseRateOfFire() {
        this.blaster.increaseRateOfFire();
    }
    decreaseRateOfFire() {
        this.blaster.decreaseRateOfFire();
    }
    updatePosition() {
        if (this.movementService.isMovingLeft) {
            this.movementService.moveLeft(1);
        }
        else if (this.movementService.isMovingRight) {
            this.movementService.moveRight(1);
        }
    }
    static getInitialVerticalPosition(maxHeight) {
        return maxHeight - this.HEIGHT;
    }
    static getInitialHorizontalPosition(maxWidth) {
        return Math.floor(maxWidth / 2 - this.WIDTH / 2);
    }
}
Player.HEIGHT = 25;
Player.WIDTH = 25;
Player.COLOR = "green";
class KeyboardControls {
    constructor(player) {
        this.player = player;
        this.addKeyDownControls();
        this.addKeyUpControls();
    }
    addKeyDownControls() {
        window.addEventListener("keydown", (e) => {
            switch (e.code) {
                case "ArrowLeft":
                    this.player.startMovingLeft();
                    break;
                case "ArrowRight":
                    this.player.startMovingRight();
                    break;
                case "Space":
                    this.player.startShooting();
                    break;
            }
        });
    }
    addKeyUpControls() {
        window.addEventListener("keyup", (e) => {
            switch (e.code) {
                case "ArrowLeft":
                    this.player.stopMovingLeft();
                    break;
                case "ArrowRight":
                    this.player.stopMovingRight();
                    break;
                case "ArrowUp":
                    this.player.increaseRateOfFire();
                    break;
                case "ArrowDown":
                    this.player.decreaseRateOfFire();
                    break;
                case "Space":
                    this.player.stopShooting();
                    break;
            }
        });
    }
}
class MovementService {
    constructor(height, width, canvasHeight, canvasWidth, initialVerticalPosition, initialHorizontalPosition) {
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isMovingUp = false;
        this.isMovingDown = false;
        this.HEIGHT = height;
        this.WIDTH = width;
        this.CANVAS_HEIGHT = canvasHeight;
        this.CANVAS_WIDTH = canvasWidth;
        this.verticalPosition = initialVerticalPosition;
        this.horizontalPosition = initialHorizontalPosition;
    }
    startMovingLeft() {
        this.isMovingLeft = true;
        this.isMovingRight = false;
    }
    stopMovingLeft() {
        this.isMovingLeft = false;
    }
    startMovingRight() {
        this.isMovingRight = true;
        this.isMovingLeft = false;
    }
    stopMovingRight() {
        this.isMovingRight = false;
    }
    startMovingUp() {
        this.isMovingUp = true;
        this.isMovingDown = false;
    }
    stopMovingUp() {
        this.isMovingUp = false;
    }
    startMovingDown() {
        this.isMovingDown = true;
        this.isMovingUp = false;
    }
    stopMovingDown() {
        this.isMovingDown = false;
    }
    moveLeft(unitsToMove) {
        const newPosition = this.horizontalPosition - unitsToMove;
        this.horizontalPosition = newPosition >= 0 ? newPosition : 0;
    }
    moveRight(unitsToMove) {
        const newPosition = this.horizontalPosition + unitsToMove;
        const maxRightPosition = this.CANVAS_WIDTH - this.WIDTH;
        this.horizontalPosition =
            newPosition <= maxRightPosition ? newPosition : maxRightPosition;
    }
    moveUp(unitsToMove) {
        this.verticalPosition = this.verticalPosition - unitsToMove;
    }
    moveDown(unitsToMove) {
        this.verticalPosition = this.verticalPosition + unitsToMove;
    }
}
class Blaster {
    constructor(initialVerticalPosition) {
        this.BULLET_SPEED = 5;
        this.MAXIMUM_COOLDOWN_PERIOD_MILLISECONDS = 500;
        this.MINIMUM_COOLDOWN_PERIOD_MILLISECONDS = 100;
        this.CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS = 25;
        this.timeLastShotFired = 0;
        this.cooldownPeriod = this.MAXIMUM_COOLDOWN_PERIOD_MILLISECONDS;
        this.verticalPosition = initialVerticalPosition;
    }
    shoot(initialHorizontalPosition) {
        const currentTime = Date.now();
        const shouldFire = currentTime - this.timeLastShotFired >= this.cooldownPeriod;
        if (!shouldFire)
            return null;
        this.timeLastShotFired = currentTime;
        return new BlasterBullet(this.verticalPosition, initialHorizontalPosition, this.BULLET_SPEED);
    }
    increaseRateOfFire() {
        const newCoolDown = this.cooldownPeriod - this.CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS;
        this.cooldownPeriod =
            newCoolDown < this.MINIMUM_COOLDOWN_PERIOD_MILLISECONDS
                ? this.MINIMUM_COOLDOWN_PERIOD_MILLISECONDS
                : newCoolDown;
    }
    decreaseRateOfFire() {
        const newCoolDown = this.cooldownPeriod + this.CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS;
        this.cooldownPeriod =
            newCoolDown > this.MAXIMUM_COOLDOWN_PERIOD_MILLISECONDS
                ? this.MAXIMUM_COOLDOWN_PERIOD_MILLISECONDS
                : newCoolDown;
    }
    getBlasterHorizontalOffset() {
        return Math.floor(BlasterBullet.WIDTH / 2);
    }
}
// @ts-ignore
class BlasterBullet extends MoveableEntity {
    constructor(initialVerticalPosition, initialHorizontalPosition, bulletSpeed) {
        super(initialVerticalPosition, initialHorizontalPosition, BlasterBullet.HEIGHT, BlasterBullet.WIDTH);
        this.COLOR = "red";
        this.bulletSpeed = bulletSpeed;
        this.movementService.startMovingUp();
    }
    draw() {
        this.updatePosition();
        const previousFillStyle = this.canvas.canvasContext.fillStyle;
        this.canvas.canvasContext.fillStyle = this.COLOR;
        this.canvas.canvasContext.fillRect(this.movementService.horizontalPosition, this.movementService.verticalPosition, BlasterBullet.WIDTH, BlasterBullet.HEIGHT);
        this.canvas.canvasContext.fillStyle = previousFillStyle;
    }
    isBulletOffScreen() {
        return this.movementService.verticalPosition <= -BlasterBullet.HEIGHT;
    }
    updatePosition() {
        if (this.movementService.isMovingUp) {
            this.movementService.moveUp(this.bulletSpeed);
        }
    }
}
BlasterBullet.HEIGHT = 5;
BlasterBullet.WIDTH = 5;
const bulletArray = [];
const enemies = [];
// @ts-ignore
const canvas = CanvasInstance.getInstance();
// @ts-ignore
const player = new Player();
// @ts-ignore
const keyboardControls = new KeyboardControls(player);
let lastTimestamp = 0;
let maxEnemies = 5;
const enemySpacing = 5;
function shouldRenderFrame(timestamp) {
    const deltaTimeMilliseconds = Math.floor(timestamp - lastTimestamp);
    lastTimestamp = timestamp;
    return (Constants.MILLISECONDS_RENDER_MINIMUM <= deltaTimeMilliseconds &&
        deltaTimeMilliseconds <= Constants.MILLISECONDS_RENDER_MAXIMUM);
}
function initNewGame() {
    player.reset();
    player.draw();
}
function renderBullets() {
    let index = 0;
    while (index < bulletArray.length) {
        const currentBullet = bulletArray[index];
        if (!currentBullet.isBulletOffScreen()) {
            currentBullet.draw();
            index++;
        }
        else {
            bulletArray.splice(index, 1);
        }
    }
}
function renderEnemies() {
    if (enemies.length === 0) {
        const intRange = [...Array.from(new Array(maxEnemies)).keys()];
        intRange.forEach((index) => {
            const enemy = new Enemy(0, index * (Enemy.WIDTH + enemySpacing));
            enemies.push(enemy);
        });
    }
    enemies.forEach((enemy) => enemy.draw());
}
function renderFrame(timestamp) {
    if (!shouldRenderFrame(timestamp)) {
        return;
    }
    canvas.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    const nextShot = player.getNextShot();
    if (nextShot !== null) {
        bulletArray.push(nextShot);
    }
    renderEnemies();
    renderBullets();
}
function animate(timestamp) {
    renderFrame(timestamp);
    requestAnimationFrame(animate);
}
initNewGame();
animate(0);
