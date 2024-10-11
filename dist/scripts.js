"use strict";
class CanvasInstance {
    constructor() { }
    static getInstance() {
        if (this.instance)
            return this.instance;
        const gameScreen = document.getElementById(CanvasInstance.GAME_SCREEN_ID);
        const boundedContext = gameScreen.getBoundingClientRect();
        const height = Math.floor(boundedContext.height) - CanvasInstance.BORDER_WIDTH;
        const width = Math.floor(boundedContext.width) - CanvasInstance.BORDER_WIDTH;
        gameScreen.height = height;
        gameScreen.width = width;
        this.instance = {
            canvasContext: gameScreen.getContext("2d"),
            height: height,
            width: width,
        };
        return this.instance;
    }
}
CanvasInstance.GAME_SCREEN_ID = "game_screen";
CanvasInstance.BORDER_WIDTH = 1;
var EnemyType;
(function (EnemyType) {
    EnemyType[EnemyType["WEAK"] = 0] = "WEAK";
    EnemyType[EnemyType["MEDIUM"] = 1] = "MEDIUM";
    EnemyType[EnemyType["STRONG"] = 2] = "STRONG";
})(EnemyType || (EnemyType = {}));
class MoveableEntity {
    constructor(initialVerticalPosition, initialHorizontalPosition, height, width) {
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isMovingUp = false;
        this.isMovingDown = false;
        this.canvas = CanvasInstance.getInstance();
        this.HEIGHT = height;
        this.WIDTH = width;
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
        const maxRightPosition = this.canvas.width - this.WIDTH;
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
// @ts-ignore
class Player extends MoveableEntity {
    constructor(initialVerticalPosition, initialHorizontalPosition) {
        super(initialVerticalPosition, initialHorizontalPosition, Player.HEIGHT, Player.WIDTH);
        this.isShooting = false;
        this.blasterHorizontalPosition = 0;
        this.blaster = new Blaster(this.verticalPosition);
        this.updateBlasterHorizontalPosition();
    }
    reset() {
        this.isShooting = false;
        this.verticalPosition = Player.getInitialVerticalPosition(this.canvas.height);
        this.horizontalPosition = Player.getInitialHorizontalPosition(this.canvas.height);
        this.blaster = new Blaster(this.verticalPosition);
        this.updateBlasterHorizontalPosition();
    }
    draw() {
        this.updatePosition();
        const previousFillStyle = this.canvas.canvasContext.fillStyle;
        this.canvas.canvasContext.fillStyle = Player.COLOR;
        this.canvas.canvasContext.fillRect(this.horizontalPosition, this.verticalPosition, Player.WIDTH, Player.HEIGHT);
        this.canvas.canvasContext.fillStyle = previousFillStyle;
    }
    getNextShot() {
        return this.isShooting
            ? this.blaster.shoot(this.blasterHorizontalPosition)
            : null;
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
    static getInitialVerticalPosition(maxHeight) {
        return maxHeight - this.HEIGHT;
    }
    static getInitialHorizontalPosition(maxWidth) {
        return Math.floor(maxWidth / 2 - this.WIDTH / 2);
    }
    updatePosition() {
        if (this.isMovingLeft) {
            this.moveLeft(1);
        }
        else if (this.isMovingRight) {
            this.moveRight(1);
        }
        if (this.isMovingLeft || this.isMovingRight) {
            this.updateBlasterHorizontalPosition();
        }
    }
    updateBlasterHorizontalPosition() {
        this.blasterHorizontalPosition =
            this.horizontalPosition +
                Math.floor(Player.WIDTH / 2) -
                this.blaster.getBlasterHorizontalOffset();
    }
}
Player.HEIGHT = 25;
Player.WIDTH = 25;
Player.COLOR = "green";
// @ts-ignore
class Enemy extends MoveableEntity {
    constructor(initialVerticalPosition, initialHorizontalPosition, minHorizontalBound, maxHorizontalBound) {
        super(initialVerticalPosition, initialHorizontalPosition, Enemy.HEIGHT, Enemy.WIDTH);
        this.lastVerticalPosition = 0;
        this.minHorizontalBound = minHorizontalBound;
        this.maxHorizontalBound = maxHorizontalBound;
        this.lastVerticalPosition = initialVerticalPosition;
    }
    draw() {
        this.updatePosition();
        const previousFillStyle = this.canvas.canvasContext.fillStyle;
        this.canvas.canvasContext.fillStyle = Enemy.COLOR;
        this.canvas.canvasContext.fillRect(this.horizontalPosition, this.verticalPosition, Enemy.WIDTH, Enemy.HEIGHT);
        this.canvas.canvasContext.fillStyle = previousFillStyle;
    }
    updatePosition() {
        this.checkLeftMovement();
        this.checkRightMovement();
        this.checkDownMovement();
    }
    checkLeftMovement() {
        if (!this.isMovingLeft)
            return;
        if (this.minHorizontalBound <= this.horizontalPosition - 1) {
            this.moveLeft(1);
        }
        else {
            this.startMovingRight();
            this.startMovingDown();
        }
    }
    checkRightMovement() {
        if (!this.isMovingRight)
            return;
        const nextPosition = this.horizontalPosition + Enemy.WIDTH + 1;
        if (nextPosition <= this.maxHorizontalBound) {
            this.moveRight(1);
        }
        else {
            this.startMovingLeft();
            this.startMovingDown();
        }
    }
    checkDownMovement() {
        if (!this.isMovingDown)
            return;
        if (this.verticalPosition - this.lastVerticalPosition >= Enemy.HEIGHT) {
            this.stopMovingDown();
            this.lastVerticalPosition = this.verticalPosition;
        }
        else {
            this.moveDown(1);
        }
    }
}
Enemy.HEIGHT = 25;
Enemy.WIDTH = 25;
Enemy.COLOR = "purple";
// @ts-nocheck
class EnemyConstants {
}
EnemyConstants.levels = [
    {
        level: 1,
        enemies: [
            [
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
            ],
            [
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
            ],
            [
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
            ],
        ],
    },
];
class EnemyGroup {
    constructor() {
        this.ENEMY_SPACING = 5;
        this.BUFFER_FROM_CANVAS_BOUNDS = 10;
        this.enemies = [];
        this.currentLevel = 1;
        this.canvas = CanvasInstance.getInstance();
        this.addEnemies();
    }
    getEnemies() {
        return [...this.enemies];
    }
    addEnemies() {
        const levelData = EnemyConstants.levels.find((levelData) => levelData.level == this.currentLevel);
        if (!levelData)
            return;
        levelData.enemies.forEach((row, rowIndex) => {
            const verticalPosition = rowIndex * (Enemy.HEIGHT + this.ENEMY_SPACING);
            const horizontalOffset = this.calculateRowOffset(row.length);
            row.forEach((col, colIndex) => {
                const horizontalPosition = colIndex * (Enemy.WIDTH + this.ENEMY_SPACING);
                const enemy = new Enemy(verticalPosition, horizontalPosition + horizontalOffset, this.BUFFER_FROM_CANVAS_BOUNDS, this.canvas.width - this.BUFFER_FROM_CANVAS_BOUNDS);
                enemy.startMovingLeft();
                this.enemies.push(enemy);
            });
        });
    }
    calculateRowOffset(rowLength) {
        const maxWidthOfRow = rowLength * Enemy.WIDTH + (rowLength - 1) * this.ENEMY_SPACING;
        return Math.floor(this.canvas.width / 2) - Math.floor(maxWidthOfRow / 2);
    }
}
class KeyboardControls {
    constructor(player) {
        this.player = player;
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
class Blaster {
    constructor(initialVerticalPosition) {
        this.BULLET_SPEED = 5;
        this.MAX_COOLDOWN_PERIOD_MILLISECONDS = 500;
        this.MIN_COOLDOWN_PERIOD_MILLISECONDS = 100;
        this.CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS = 25;
        this.timeLastShotFired = 0;
        this.cooldownPeriod = this.MAX_COOLDOWN_PERIOD_MILLISECONDS;
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
            newCoolDown < this.MIN_COOLDOWN_PERIOD_MILLISECONDS
                ? this.MIN_COOLDOWN_PERIOD_MILLISECONDS
                : newCoolDown;
    }
    decreaseRateOfFire() {
        const newCoolDown = this.cooldownPeriod + this.CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS;
        this.cooldownPeriod =
            newCoolDown > this.MAX_COOLDOWN_PERIOD_MILLISECONDS
                ? this.MAX_COOLDOWN_PERIOD_MILLISECONDS
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
        this.startMovingUp();
    }
    draw() {
        this.updatePosition();
        const previousFillStyle = this.canvas.canvasContext.fillStyle;
        this.canvas.canvasContext.fillStyle = this.COLOR;
        this.canvas.canvasContext.fillRect(this.horizontalPosition, this.verticalPosition, BlasterBullet.WIDTH, BlasterBullet.HEIGHT);
        this.canvas.canvasContext.fillStyle = previousFillStyle;
    }
    isBulletOffScreen() {
        return this.verticalPosition <= -BlasterBullet.HEIGHT;
    }
    updatePosition() {
        if (this.isMovingUp) {
            this.moveUp(this.bulletSpeed);
        }
    }
}
BlasterBullet.HEIGHT = 5;
BlasterBullet.WIDTH = 5;
class SpaceInvaders {
    constructor() {
        this.FPS = 60;
        this.lastTimestamp = 0;
        this.bulletArray = [];
        const millisecondsPerFrame = 1000 / this.FPS;
        this.renderMaximumMilliseconds = Math.floor(millisecondsPerFrame) + 1;
        this.renderMinimumMilliseconds = Math.floor(millisecondsPerFrame) - 1;
        this.canvas = CanvasInstance.getInstance();
        const playerVerticalPosition = Player.getInitialVerticalPosition(this.canvas.height);
        const playerHorizontalPosition = Player.getInitialHorizontalPosition(this.canvas.height);
        this.player = new Player(playerVerticalPosition, playerHorizontalPosition);
        this.enemyGroup = new EnemyGroup();
        this.keyboardControls = new KeyboardControls(this.player);
        this.keyboardControls.addKeyDownControls();
        this.keyboardControls.addKeyUpControls();
    }
    renderFrame(timestamp) {
        if (!this.shouldRenderFrame(timestamp))
            return;
        this.canvas.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw();
        this.enemyGroup.getEnemies().forEach((enemy) => enemy.draw());
        const nextShot = this.player.getNextShot();
        if (nextShot !== null) {
            this.bulletArray.push(nextShot);
        }
        this.renderBullets();
    }
    shouldRenderFrame(timestamp) {
        const deltaTimeMilliseconds = Math.floor(timestamp - this.lastTimestamp);
        this.lastTimestamp = timestamp;
        return (this.renderMinimumMilliseconds <= deltaTimeMilliseconds &&
            deltaTimeMilliseconds <= this.renderMaximumMilliseconds);
    }
    renderBullets() {
        let index = 0;
        while (index < this.bulletArray.length) {
            const currentBullet = this.bulletArray[index];
            if (!currentBullet.isBulletOffScreen()) {
                currentBullet.draw();
                index++;
            }
            else {
                this.bulletArray.splice(index, 1);
            }
        }
    }
}
const spaceInvaders = new SpaceInvaders();
function animate(timestamp) {
    spaceInvaders.renderFrame(timestamp);
    requestAnimationFrame(animate);
}
this.animate(0);
