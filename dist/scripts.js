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
    moveLeft(unitsToMove, minHorizontalPosition = 0) {
        const newPosition = this.horizontalPosition - unitsToMove;
        this.horizontalPosition =
            newPosition >= minHorizontalPosition
                ? newPosition
                : minHorizontalPosition;
    }
    moveRight(unitsToMove, maxWidth = this.canvas.width) {
        const newPosition = this.horizontalPosition + unitsToMove;
        const maxRightPosition = maxWidth - this.WIDTH;
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
        this.blaster = new Blaster(this.verticalPosition, this.horizontalPosition, Player.WIDTH);
    }
    reset() {
        this.isShooting = false;
        this.verticalPosition = Player.getInitialVerticalPosition(this.canvas.height);
        this.horizontalPosition = Player.getInitialHorizontalPosition(this.canvas.height);
        this.blaster = new Blaster(this.verticalPosition, this.horizontalPosition, Player.WIDTH);
    }
    draw() {
        this.updatePosition();
        const previousFillStyle = this.canvas.canvasContext.fillStyle;
        this.canvas.canvasContext.fillStyle = Player.COLOR;
        this.canvas.canvasContext.fillRect(this.horizontalPosition, this.verticalPosition, Player.WIDTH, Player.HEIGHT);
        this.canvas.canvasContext.fillStyle = previousFillStyle;
    }
    getNextShot() {
        return this.isShooting ? this.blaster.shoot() : null;
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
            this.blaster.updateBlasterHorizontalPosition(this.horizontalPosition);
        }
    }
}
Player.HEIGHT = 25;
Player.WIDTH = 25;
Player.COLOR = "green";
// @ts-ignore
class Enemy extends MoveableEntity {
    constructor(initialVerticalPosition, initialHorizontalPosition, maxLeftPosition, maxRightPosition) {
        super(initialVerticalPosition, initialHorizontalPosition, Enemy.HEIGHT, Enemy.WIDTH);
        this.maxLeftPosition = 0;
        this.maxRightPosition = 0;
        this.nextVerticalPositonToMoveDown = 0;
        this.movementSpeed = 1;
        this.maxLeftPosition = maxLeftPosition;
        this.maxRightPosition = maxRightPosition;
        this.nextVerticalPositonToMoveDown = initialVerticalPosition;
        this.blaster = new Blaster(this.verticalPosition + Enemy.HEIGHT, initialHorizontalPosition, Enemy.WIDTH);
        this.blaster.shootDownwards();
    }
    draw() {
        this.updatePosition();
        const previousFillStyle = this.canvas.canvasContext.fillStyle;
        this.canvas.canvasContext.fillStyle = Enemy.COLOR;
        this.canvas.canvasContext.fillRect(this.horizontalPosition, this.verticalPosition, Enemy.WIDTH, Enemy.HEIGHT);
        this.canvas.canvasContext.fillStyle = previousFillStyle;
    }
    getNextShot() {
        return this.blaster.shoot();
    }
    updatePosition() {
        this.updateMoveLeft();
        this.updateMoveRight();
        this.updateMoveDown();
    }
    updateMoveLeft() {
        if (!this.isMovingLeft)
            return;
        if (this.horizontalPosition <= this.maxLeftPosition) {
            this.stopMovingLeft();
            this.setNextVerticalPositionToMoveDown();
            this.startMovingDown();
        }
        else {
            this.moveLeft(this.movementSpeed, this.maxLeftPosition);
            this.blaster.updateBlasterHorizontalPosition(this.horizontalPosition);
        }
    }
    updateMoveRight() {
        if (!this.isMovingRight)
            return;
        if (this.horizontalPosition + Enemy.WIDTH >= this.maxRightPosition) {
            this.stopMovingRight();
            this.setNextVerticalPositionToMoveDown();
            this.startMovingDown();
        }
        else {
            this.moveRight(this.movementSpeed, this.maxRightPosition);
            this.blaster.updateBlasterHorizontalPosition(this.horizontalPosition);
        }
    }
    updateMoveDown() {
        if (!this.isMovingDown)
            return;
        if (this.verticalPosition < this.nextVerticalPositonToMoveDown) {
            this.moveDown(this.movementSpeed);
            this.blaster.updateBlasterVerticalPosition(this.verticalPosition + Enemy.HEIGHT);
            return;
        }
        this.stopMovingDown();
        if (this.horizontalPosition <= this.maxLeftPosition) {
            this.startMovingRight();
        }
        if (this.horizontalPosition + Enemy.WIDTH >= this.maxRightPosition) {
            this.startMovingLeft();
        }
    }
    setNextVerticalPositionToMoveDown() {
        this.nextVerticalPositonToMoveDown += Enemy.HEIGHT;
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
            [EnemyType.WEAK, EnemyType.WEAK, EnemyType.WEAK],
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
            [EnemyType.WEAK, EnemyType.WEAK, EnemyType.WEAK],
        ],
    },
];
class EnemyGroup {
    constructor() {
        this.ENEMY_SPACING = 5;
        this.enemies = [];
        this.currentLevel = 1;
        this.canvas = CanvasInstance.getInstance();
        this.addEnemies();
    }
    getEnemies() {
        return [...this.enemies];
    }
    removeEnemy(index) {
        return index < 0 || this.enemies.length <= index
            ? null
            : this.enemies.splice(index, 1)[0];
    }
    addEnemies() {
        const levelData = EnemyConstants.levels.find((levelData) => levelData.level == this.currentLevel);
        if (!levelData)
            return;
        const maxEnemiesInARow = levelData.enemies
            .map((enemyList) => enemyList.length)
            .reduce((acc, length) => Math.max(acc, length), 0);
        levelData.enemies.forEach((row, rowIndex) => {
            const verticalPosition = rowIndex * (Enemy.HEIGHT + this.ENEMY_SPACING);
            const horizontalOffset = this.calculateRowOffset(row.length);
            row.forEach((_, colIndex) => {
                const horizontalPosition = colIndex * (Enemy.WIDTH + this.ENEMY_SPACING);
                const minLeftPositionToMove = this.calculateMinLeftPositionToMove(maxEnemiesInARow, row.length, colIndex);
                const maxRightPositionToMove = this.calculateMaxRightPositionToMove(maxEnemiesInARow, row.length, colIndex);
                const enemy = new Enemy(verticalPosition, horizontalPosition + horizontalOffset, minLeftPositionToMove, maxRightPositionToMove);
                enemy.startMovingLeft();
                this.enemies.push(enemy);
            });
        });
    }
    calculateMaxRightPositionToMove(maxEnemiesInARow, rowLength, enemyIndex) {
        const spacesToRight = (maxEnemiesInARow - rowLength) / 2 + (rowLength - enemyIndex - 1);
        const maxRightPositionToMove = spacesToRight * Enemy.WIDTH +
            spacesToRight * this.ENEMY_SPACING +
            this.ENEMY_SPACING;
        return this.canvas.width - maxRightPositionToMove;
    }
    calculateMinLeftPositionToMove(maxEnemiesInARow, rowLength, enemyIndex) {
        const spacesToLeft = (maxEnemiesInARow - rowLength) / 2 + enemyIndex;
        return (spacesToLeft * Enemy.WIDTH +
            spacesToLeft * this.ENEMY_SPACING +
            this.ENEMY_SPACING);
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
class CollisionDetectionService {
    constructor() { }
    hasCollided(object1, object2) {
        if (!object1 || !object2) {
            return false;
        }
        if (object1.horizontalPosition + object1.WIDTH < object2.horizontalPosition) {
            return false;
        }
        if (object2.horizontalPosition + object2.WIDTH < object1.horizontalPosition) {
            return false;
        }
        if (object1.verticalPosition + object1.HEIGHT < object2.verticalPosition) {
            return false;
        }
        if (object2.verticalPosition + object2.HEIGHT < object1.verticalPosition) {
            return false;
        }
        return true;
    }
}
class DrawPlayerHealth {
    constructor() {
        this.HEALTH_BAR_COLOR = "white";
        this.HEALTH_BAR_DIVET_COLOR = "yellow";
        this.HEALTH_BAR_DIVET_HEIGHT = 5;
        this.HEALTH_BAR_DIVET_WIDTH = 15;
        this.HEALTH_BAR_DIVET_BUFFER = 2;
        this.MAX_HEALTH_BAR_DIVETS = 20;
        this.BORDER_WIDTH_PIXELS = 1;
        this.canvas = CanvasInstance.getInstance();
    }
    drawPlayerHealth(startingX, startingY, playerHealthPercentage) {
        const validatedPlayerHealth = this.validatePlayerHealthPercentage(playerHealthPercentage);
        const healthBarHeight = this.HEALTH_BAR_DIVET_HEIGHT * this.MAX_HEALTH_BAR_DIVETS +
            this.HEALTH_BAR_DIVET_BUFFER * this.MAX_HEALTH_BAR_DIVETS +
            this.HEALTH_BAR_DIVET_BUFFER * 2;
        const healthBarWidth = this.HEALTH_BAR_DIVET_WIDTH +
            this.HEALTH_BAR_DIVET_BUFFER * 2 +
            this.BORDER_WIDTH_PIXELS * 2;
        this.drawPlayerHealthDivets(startingX, startingY, validatedPlayerHealth);
        this.canvas.canvasContext.strokeStyle = this.HEALTH_BAR_COLOR;
        this.canvas.canvasContext.strokeRect(startingX, startingY, healthBarWidth, healthBarHeight);
        return {
            x: startingX,
            y: startingY,
            width: healthBarWidth,
            height: healthBarHeight,
        };
    }
    validatePlayerHealthPercentage(playerHealthPercentage) {
        if (playerHealthPercentage < 0)
            return 0;
        if (playerHealthPercentage > 100)
            return 100;
        return playerHealthPercentage;
    }
    drawPlayerHealthDivets(startingX, startingY, playerHealthPercentage) {
        const numberRange = [...new Array(this.MAX_HEALTH_BAR_DIVETS).keys()];
        const numberOfDivetsToHide = this.MAX_HEALTH_BAR_DIVETS -
            Math.ceil(this.MAX_HEALTH_BAR_DIVETS * (playerHealthPercentage / 100));
        this.canvas.canvasContext.fillStyle = this.HEALTH_BAR_DIVET_COLOR;
        numberRange.forEach((index) => this.drawHealthDivet(index, numberOfDivetsToHide, startingX, startingY));
    }
    drawHealthDivet(divetIndex, numberOfDivetsToHide, startingX, startingY) {
        if (divetIndex < numberOfDivetsToHide)
            return;
        const xPosition = startingX + this.BORDER_WIDTH_PIXELS + this.HEALTH_BAR_DIVET_BUFFER;
        const yPosition = startingY +
            this.BORDER_WIDTH_PIXELS +
            this.HEALTH_BAR_DIVET_BUFFER +
            divetIndex *
                (this.HEALTH_BAR_DIVET_HEIGHT + this.HEALTH_BAR_DIVET_BUFFER);
        this.canvas.canvasContext.fillRect(xPosition, yPosition, this.HEALTH_BAR_DIVET_WIDTH, this.HEALTH_BAR_DIVET_HEIGHT);
    }
}
class DrawScoreService {
    constructor(bufferSize) {
        this.FONT_SIZE_PIXELS = 12;
        this.FONT_COLOR = "white";
        this.canvas = CanvasInstance.getInstance();
        this.fontFamily = `${this.FONT_SIZE_PIXELS}px \"Press Start 2P\", Arial`;
        this.bufferSize = bufferSize;
    }
    drawScore(score) {
        const scoreText = `Score: ${score}`;
        this.drawTextToCanvas(scoreText);
        const measuredText = this.canvas.canvasContext.measureText(scoreText);
        return {
            x: this.bufferSize,
            y: this.FONT_SIZE_PIXELS + this.bufferSize,
            width: measuredText.width,
            height: this.FONT_SIZE_PIXELS,
        };
    }
    drawTextToCanvas(scoreText) {
        this.canvas.canvasContext.fillStyle = this.FONT_COLOR;
        this.canvas.canvasContext.font = this.fontFamily;
        this.canvas.canvasContext.fillText(scoreText, this.bufferSize, this.FONT_SIZE_PIXELS + this.bufferSize);
    }
}
class HeadsUpDisplayService {
    constructor() {
        this.BUFFER_SIZE_PIXELS = 10;
        this.canvas = CanvasInstance.getInstance();
        this.drawScoreService = new DrawScoreService(this.BUFFER_SIZE_PIXELS);
        this.drawPlayerHealth = new DrawPlayerHealth();
    }
    draw(score, playerHealthPercentage) {
        this.canvas.canvasContext.save();
        const scoreBoundingContext = this.drawScoreService.drawScore(score);
        this.drawPlayerHealth.drawPlayerHealth(scoreBoundingContext.x, scoreBoundingContext.y + scoreBoundingContext.height, playerHealthPercentage);
        this.canvas.canvasContext.restore();
    }
}
class Blaster {
    constructor(initialVerticalPosition, ownerHorizontalPosition, ownerWidth) {
        this.BULLET_SPEED = 2;
        this.MAX_COOLDOWN_PERIOD_MILLISECONDS = 500;
        this.MIN_COOLDOWN_PERIOD_MILLISECONDS = 100;
        this.CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS = 25;
        this.timeLastShotFired = 0;
        this.cooldownPeriod = this.MAX_COOLDOWN_PERIOD_MILLISECONDS;
        this.isShootingDown = false;
        this.ownerWidth = ownerWidth;
        this.verticalPosition = initialVerticalPosition;
        this.horizontalPosition = 0;
        this.updateBlasterHorizontalPosition(ownerHorizontalPosition);
    }
    shoot() {
        const currentTime = Date.now();
        const shouldFire = currentTime - this.timeLastShotFired >= this.cooldownPeriod;
        if (!shouldFire)
            return null;
        this.timeLastShotFired = currentTime;
        const bullet = new BlasterBullet(this.verticalPosition, this.horizontalPosition, this.BULLET_SPEED);
        if (this.isShootingDown) {
            bullet.startMovingDown();
        }
        else {
            bullet.startMovingUp();
        }
        return bullet;
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
    updateBlasterHorizontalPosition(ownerHorizontalPosition) {
        const blasterHorizontalOffset = Math.floor(BlasterBullet.WIDTH / 2);
        this.horizontalPosition =
            ownerHorizontalPosition +
                Math.floor(this.ownerWidth / 2) -
                blasterHorizontalOffset;
    }
    updateBlasterVerticalPosition(ownerVerticalPosition) {
        this.verticalPosition = ownerVerticalPosition;
    }
    shootDownwards() {
        this.isShootingDown = true;
    }
}
// @ts-ignore
class BlasterBullet extends MoveableEntity {
    constructor(initialVerticalPosition, initialHorizontalPosition, bulletSpeed) {
        super(initialVerticalPosition, initialHorizontalPosition, BlasterBullet.HEIGHT, BlasterBullet.WIDTH);
        this.COLOR = "red";
        this.bulletSpeed = bulletSpeed;
    }
    draw() {
        this.updatePosition();
        const previousFillStyle = this.canvas.canvasContext.fillStyle;
        this.canvas.canvasContext.fillStyle = this.COLOR;
        this.canvas.canvasContext.fillRect(this.horizontalPosition, this.verticalPosition, BlasterBullet.WIDTH, BlasterBullet.HEIGHT);
        this.canvas.canvasContext.fillStyle = previousFillStyle;
    }
    isBulletOffScreen() {
        const isAboveCanvas = this.verticalPosition <= -BlasterBullet.HEIGHT;
        const isBelowCanvas = this.verticalPosition >= this.canvas.height;
        return isAboveCanvas || isBelowCanvas;
    }
    updatePosition() {
        if (this.isMovingUp) {
            this.moveUp(this.bulletSpeed);
        }
        else if (this.isMovingDown) {
            this.moveDown(this.bulletSpeed);
        }
    }
}
BlasterBullet.HEIGHT = 5;
BlasterBullet.WIDTH = 5;
class SpaceInvaders {
    constructor() {
        this.FPS = 60;
        this.lastTimestamp = 0;
        this.score = 0;
        this.bulletArray = [];
        this.enemyBulletArray = [];
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
        this.collisionDetector = new CollisionDetectionService();
        this.headsUpDisplay = new HeadsUpDisplayService();
    }
    renderFrame(timestamp) {
        if (!this.shouldRenderFrame(timestamp))
            return;
        this.canvas.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.removeCollidedBulletsAndEnemies();
        this.enemyGroup.getEnemies().forEach((enemy) => {
            enemy.draw();
            this.addNextShot(enemy.getNextShot(), this.enemyBulletArray);
        });
        this.renderBullets(this.enemyBulletArray);
        this.player.draw();
        this.addNextShot(this.player.getNextShot(), this.bulletArray);
        this.renderBullets(this.bulletArray);
        this.headsUpDisplay.draw(this.score, 100);
    }
    addNextShot(nextShot, bullets) {
        if (!nextShot)
            return;
        bullets.push(nextShot);
    }
    shouldRenderFrame(timestamp) {
        const deltaTimeMilliseconds = Math.floor(timestamp - this.lastTimestamp);
        this.lastTimestamp = timestamp;
        return (this.renderMinimumMilliseconds <= deltaTimeMilliseconds &&
            deltaTimeMilliseconds <= this.renderMaximumMilliseconds);
    }
    renderBullets(bullets) {
        let index = 0;
        while (index < bullets.length) {
            const currentBullet = bullets[index];
            if (!currentBullet.isBulletOffScreen()) {
                currentBullet.draw();
                index++;
            }
            else {
                bullets.splice(index, 1);
            }
        }
    }
    removeCollidedBulletsAndEnemies() {
        if (this.bulletArray.length === 0)
            return;
        let index = 0;
        while (index < this.bulletArray.length) {
            const removedEnemies = this.removeCollidedEnemy(this.bulletArray[index]);
            if (0 < removedEnemies.length) {
                this.bulletArray.splice(index, 1);
            }
            else {
                index++;
            }
        }
    }
    removeCollidedEnemy(bullet) {
        let index = 0;
        const removedEnemies = [];
        while (index < this.enemyGroup.getEnemies().length) {
            const hasCollided = this.collisionDetector.hasCollided(bullet, this.enemyGroup.getEnemies()[index]);
            if (hasCollided) {
                const removedEnemy = this.enemyGroup.removeEnemy(index);
                removedEnemies.push(removedEnemy);
            }
            else {
                index++;
            }
        }
        return removedEnemies;
    }
}
const spaceInvaders = new SpaceInvaders();
function animate(timestamp) {
    spaceInvaders.renderFrame(timestamp);
    requestAnimationFrame(animate);
}
this.animate(0);
