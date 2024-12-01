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
var _a;
class FontHelper {
    static getFontFamily(fontSize) {
        return `${fontSize}px PressStart2P, Arial`;
    }
}
_a = FontHelper;
FontHelper.FONT_SIZE = 12;
FontHelper.TITLE_FONT_SIZE = _a.FONT_SIZE * 3;
class MathHelper {
    // This method was copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    static getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }
}
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
        this.healthManagerService = new HealthManagerService(Player.MAX_HEALTH);
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
    getHealth() {
        return this.healthManagerService.getHealth();
    }
    decrementHealth(removeValue) {
        this.healthManagerService.decrementHealth(removeValue);
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
Player.MAX_HEALTH = 100;
// @ts-ignore
class Enemy extends MoveableEntity {
    constructor(initialVerticalPosition, initialHorizontalPosition, maxLeftPosition, maxRightPosition, config) {
        super(initialVerticalPosition, initialHorizontalPosition, Enemy.HEIGHT, Enemy.WIDTH);
        this.BASE_COLOR = {
            red: 117,
            green: 27,
            blue: 124,
            brightness: 1,
        };
        this.HALF_DAMAGE_COLOR = {
            red: 196,
            green: 14,
            blue: 64,
            brightness: 1,
        };
        this.DANGER_COLOR = {
            red: 255,
            green: 0,
            blue: 0,
            brightness: 1,
        };
        this.maxLeftPosition = 0;
        this.maxRightPosition = 0;
        this.nextVerticalPositonToMoveDown = 0;
        this.movementSpeed = 1;
        this.currentColor = this.BASE_COLOR;
        this.maxLeftPosition = maxLeftPosition;
        this.maxRightPosition = maxRightPosition;
        this.nextVerticalPositonToMoveDown = initialVerticalPosition;
        this.pointsForDefeating = config.pointsForDefeating;
        this.healthManagerService = new HealthManagerService(config.maxHealth);
        this.blaster = new Blaster(this.verticalPosition + Enemy.HEIGHT, initialHorizontalPosition, Enemy.WIDTH);
        this.blaster.shootDownwards();
    }
    draw() {
        this.updatePosition();
        const previousFillStyle = this.canvas.canvasContext.fillStyle;
        this.canvas.canvasContext.fillStyle = this.getRGBAColor();
        this.canvas.canvasContext.fillRect(this.horizontalPosition, this.verticalPosition, Enemy.WIDTH, Enemy.HEIGHT);
        this.canvas.canvasContext.fillStyle = previousFillStyle;
    }
    getNextShot() {
        return this.blaster.shoot();
    }
    getHealth() {
        return this.healthManagerService.getHealth();
    }
    decrementHealth(removeValue) {
        this.healthManagerService.decrementHealth(removeValue);
        const halfHealth = Math.floor(this.healthManagerService.getMaxHealth() / 2);
        const thirdHealth = Math.floor(this.healthManagerService.getMaxHealth() / 3);
        if (this.healthManagerService.getHealth() <= halfHealth) {
            this.currentColor = this.HALF_DAMAGE_COLOR;
        }
        else if (this.healthManagerService.getHealth() <= thirdHealth) {
            this.currentColor = this.DANGER_COLOR;
        }
    }
    getPointsForDefeating() {
        return this.pointsForDefeating;
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
    getRGBAColor() {
        return `rgba(${this.currentColor.red}, ${this.currentColor.green}, ${this.currentColor.blue}, ${this.currentColor.brightness})`;
    }
}
Enemy.HEIGHT = 25;
Enemy.WIDTH = 25;
class EnemyFactory {
    constructor() {
        this.weakEnemyStats = {
            maxHealth: 5,
            pointsForDefeating: 1,
        };
        this.mediumEnemyStats = {
            maxHealth: 15,
            pointsForDefeating: 3,
        };
        this.strongEnemyStats = {
            maxHealth: 30,
            pointsForDefeating: 6,
        };
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new EnemyFactory();
        return this.instance;
    }
    buildNewEnemy(enemyType, startingVerticalPosition, startingHorizontalPosition, minLeftPositionToMove, maxRightPositionToMove) {
        const enemyConfig = this.getConfigForEnemyType(enemyType);
        return new Enemy(startingVerticalPosition, startingHorizontalPosition, minLeftPositionToMove, maxRightPositionToMove, enemyConfig);
    }
    getConfigForEnemyType(enemyType) {
        switch (enemyType) {
            case EnemyType.MEDIUM:
                return this.mediumEnemyStats;
            case EnemyType.STRONG:
                return this.strongEnemyStats;
            case EnemyType.WEAK:
            default:
                return this.weakEnemyStats;
        }
    }
}
class EnemyGroup {
    constructor() {
        this.ENEMY_SPACING = 5;
        this.MAX_COOLDOWN_PERIOD_MILLISECONDS = 2500;
        this.MIN_COOLDOWN_PERIOD_MILLISECONDS = 500;
        this.CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS = 200;
        this.enemies = [];
        this.timeLastShotFired = 0;
        this.cooldownPeriod = this.MAX_COOLDOWN_PERIOD_MILLISECONDS;
        this.canvas = CanvasInstance.getInstance();
    }
    hasEnemies() {
        return this.enemies.length > 0;
    }
    getEnemies() {
        return [...this.enemies];
    }
    removeEnemy(index) {
        if (index < 0 || this.enemies.length <= index)
            return null;
        const newCoolDownPeriod = this.cooldownPeriod - this.CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS;
        this.cooldownPeriod =
            newCoolDownPeriod < this.MIN_COOLDOWN_PERIOD_MILLISECONDS
                ? this.MIN_COOLDOWN_PERIOD_MILLISECONDS
                : newCoolDownPeriod;
        return this.enemies.splice(index, 1)[0];
    }
    addEnemies(enemies) {
        if (!enemies || enemies.length === 0)
            return;
        const maxEnemiesInARow = enemies
            .map((enemyList) => enemyList.length)
            .reduce((acc, length) => Math.max(acc, length), 0);
        enemies.forEach((row, rowIndex) => {
            const verticalPosition = rowIndex * (Enemy.HEIGHT + this.ENEMY_SPACING);
            const horizontalOffset = this.calculateRowOffset(row.length);
            row.forEach((enemyType, colIndex) => {
                const horizontalPosition = colIndex * (Enemy.WIDTH + this.ENEMY_SPACING);
                const { minLeftPositionToMove, maxRightPositionToMove } = this.getMaxPositionsToMove(maxEnemiesInARow, row.length, colIndex);
                const enemy = EnemyFactory.getInstance().buildNewEnemy(enemyType, verticalPosition, horizontalPosition + horizontalOffset, minLeftPositionToMove, maxRightPositionToMove);
                enemy.startMovingLeft();
                this.enemies.push(enemy);
            });
        });
    }
    getNextShot() {
        if (this.enemies.length === 0)
            return null;
        const currentTime = Date.now();
        const shouldFire = currentTime - this.timeLastShotFired >= this.cooldownPeriod;
        if (!shouldFire)
            return null;
        this.timeLastShotFired = currentTime;
        const enemyIndex = MathHelper.getRandomInt(0, this.enemies.length);
        return this.enemies[enemyIndex].getNextShot();
    }
    getMaxPositionsToMove(maxEnemiesInARow, rowLength, enemyIndex) {
        const minLeftPositionToMove = this.calculateMinLeftPositionToMove(maxEnemiesInARow, rowLength, enemyIndex);
        const maxRightPositionToMove = this.calculateMaxRightPositionToMove(maxEnemiesInARow, rowLength, enemyIndex);
        return { minLeftPositionToMove, maxRightPositionToMove };
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
// @ts-nocheck
class EnemyLevels {
}
EnemyLevels.levels = [
    {
        level: 1,
        enemies: [
            [
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
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
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
            ],
        ],
    },
    {
        level: 2,
        enemies: [
            [
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
            ],
            [
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
            ],
            [
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
                EnemyType.WEAK,
            ],
        ],
    },
    {
        level: 3,
        enemies: [
            [
                EnemyType.STRONG,
                EnemyType.STRONG,
                EnemyType.STRONG,
                EnemyType.STRONG,
                EnemyType.STRONG,
                EnemyType.STRONG,
                EnemyType.STRONG,
                EnemyType.STRONG,
                EnemyType.STRONG,
                EnemyType.STRONG,
            ],
            [
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
            ],
            [
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
                EnemyType.MEDIUM,
            ],
        ],
    },
];
class KeyboardControls {
    constructor(player, startGame) {
        this.player = player;
        this.startGame = startGame;
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
                case "Enter":
                    this.startGame();
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
        if (object1.horizontalPosition + object1.WIDTH <
            object2.horizontalPosition) {
            return false;
        }
        if (object2.horizontalPosition + object2.WIDTH <
            object1.horizontalPosition) {
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
class DrawGameSplashScreen {
    constructor() {
        this.BUFFER_SIZE_PIXELS = 20;
        this.FONT_COLOR = "white";
        this.GAME_TITLE = "SPACE INVADERS";
        this.PRESS_ENTER = "Press ENTER to start";
        this.canvas = CanvasInstance.getInstance();
        this.canvas.canvasContext.fillStyle = this.FONT_COLOR;
    }
    drawSplashScreen() {
        const titleBoundingContext = this.drawTitle();
        this.drawText(this.PRESS_ENTER, titleBoundingContext.y +
            titleBoundingContext.height +
            this.BUFFER_SIZE_PIXELS, FontHelper.FONT_SIZE);
    }
    drawTitle() {
        this.canvas.canvasContext.font = FontHelper.getFontFamily(FontHelper.TITLE_FONT_SIZE);
        const measuredText = this.canvas.canvasContext.measureText(this.GAME_TITLE);
        const xPosition = this.canvas.width / 2 - measuredText.width / 2;
        const yPosition = this.canvas.height / 2 - FontHelper.TITLE_FONT_SIZE / 2;
        this.canvas.canvasContext.fillText(this.GAME_TITLE, xPosition, yPosition);
        return {
            x: xPosition,
            y: yPosition,
            width: measuredText.width,
            height: FontHelper.TITLE_FONT_SIZE,
        };
    }
    drawText(text, startingYPosition, fontSize) {
        this.canvas.canvasContext.font = FontHelper.getFontFamily(fontSize);
        const measuredText = this.canvas.canvasContext.measureText(text);
        const xPosition = this.canvas.width / 2 - measuredText.width / 2;
        this.canvas.canvasContext.fillText(text, xPosition, startingYPosition);
    }
}
class DrawMetricsService {
    constructor(bufferSize) {
        this.FONT_COLOR = "white";
        this.canvas = CanvasInstance.getInstance();
        this.fontFamily = FontHelper.getFontFamily(FontHelper.FONT_SIZE);
        this.bufferSize = bufferSize;
    }
    drawMetrics(score, level) {
        const scoreBoundingContext = this.writeText(`Score: ${score}`, this.bufferSize, FontHelper.FONT_SIZE + this.bufferSize);
        return this.writeText(`Level: ${level}`, scoreBoundingContext.x, FontHelper.FONT_SIZE + scoreBoundingContext.y);
    }
    writeText(text, horizontalOffset, verticalOffset) {
        this.drawTextToCanvas(text, horizontalOffset, verticalOffset);
        const measuredText = this.canvas.canvasContext.measureText(text);
        return {
            x: horizontalOffset,
            y: verticalOffset + this.bufferSize,
            width: measuredText.width,
            height: FontHelper.FONT_SIZE,
        };
    }
    drawTextToCanvas(scoreText, horizontalOffset, verticalOffset) {
        this.canvas.canvasContext.fillStyle = this.FONT_COLOR;
        this.canvas.canvasContext.font = this.fontFamily;
        this.canvas.canvasContext.fillText(scoreText, horizontalOffset, verticalOffset);
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
class HeadsUpDisplayService {
    constructor() {
        this.BUFFER_SIZE_PIXELS = 10;
        this.canvas = CanvasInstance.getInstance();
        this.drawMetricsService = new DrawMetricsService(this.BUFFER_SIZE_PIXELS);
        this.drawPlayerHealth = new DrawPlayerHealth();
    }
    draw(score, level, playerHealthPercentage) {
        this.canvas.canvasContext.save();
        const scoreBoundingContext = this.drawMetricsService.drawMetrics(score, level);
        this.drawPlayerHealth.drawPlayerHealth(scoreBoundingContext.x, scoreBoundingContext.y, playerHealthPercentage);
        this.canvas.canvasContext.restore();
    }
}
class HealthManagerService {
    constructor(maxHealth) {
        this.health = 0;
        this.MAX_HEALTH = maxHealth;
        this.health = maxHealth;
    }
    getHealth() {
        return this.health;
    }
    getMaxHealth() {
        return this.MAX_HEALTH;
    }
    decrementHealth(removeValue) {
        if (removeValue < 0)
            return;
        const updatedHealth = this.health - removeValue;
        this.health = updatedHealth < 0 ? 0 : updatedHealth;
    }
}
class LevelService {
    constructor() {
        this.COUNTDOWN_MAX = 3;
        this.COUNTDOWN_TIME_MILLISECONDS = 1000;
        this.BUFFER_SIZE_PIXELS = 20;
        this.FONT_COLOR = "white";
        this.NEXT_LEVEL_TITLE = "Next Level";
        this.STARTING_IN_TITLE = "Starting in";
        this.currentLevel = 0;
        this.levels = [];
        this.currentCountDown = this.COUNTDOWN_MAX;
        this.canvas = CanvasInstance.getInstance();
        this.canvas.canvasContext.fillStyle = this.FONT_COLOR;
        EnemyLevels.levels
            .map((level) => level.level)
            .sort()
            .forEach((level) => this.levels.push(level));
    }
    getCurrentLevel() {
        return this.currentLevel;
    }
    hasRemainingLevels() {
        return this.levels.length > 0;
    }
    isShowingNextLevelScreen() {
        return this.startCountDownTime !== undefined;
    }
    startNextLevel() {
        if (!this.hasRemainingLevels())
            return;
        this.currentLevel = this.levels.shift();
        this.startCountDownTime = Date.now();
        const enemiesForCurrentLevel = EnemyLevels.levels.find((level) => level.level === this.currentLevel);
        return enemiesForCurrentLevel?.enemies;
    }
    drawNextLevelScreen() {
        if (!this.shouldRenderLevelScreen())
            return;
        const nextLevelBoundingContext = this.drawNextLevelMessage();
        const countdownText = `${this.STARTING_IN_TITLE}: ${this.currentCountDown}`;
        this.drawText(countdownText, nextLevelBoundingContext.y +
            nextLevelBoundingContext.height +
            this.BUFFER_SIZE_PIXELS, FontHelper.FONT_SIZE);
    }
    shouldRenderLevelScreen() {
        const currentTime = Date.now();
        const shouldDecrementCountDown = this.startCountDownTime &&
            currentTime - this.startCountDownTime >= this.COUNTDOWN_TIME_MILLISECONDS;
        if (shouldDecrementCountDown) {
            this.currentCountDown--;
            this.startCountDownTime = currentTime;
        }
        if (this.currentCountDown <= 0) {
            this.currentCountDown = this.COUNTDOWN_MAX;
            this.startCountDownTime = undefined;
            return false;
        }
        return true;
    }
    drawNextLevelMessage() {
        this.canvas.canvasContext.font = FontHelper.getFontFamily(FontHelper.TITLE_FONT_SIZE);
        const text = `${this.NEXT_LEVEL_TITLE}: ${this.currentLevel}`;
        const measuredText = this.canvas.canvasContext.measureText(text);
        const xPosition = this.canvas.width / 2 - measuredText.width / 2;
        const yPosition = this.canvas.height / 2 - FontHelper.TITLE_FONT_SIZE / 2;
        this.canvas.canvasContext.fillText(text, xPosition, yPosition);
        return {
            x: xPosition,
            y: yPosition,
            width: measuredText.width,
            height: FontHelper.TITLE_FONT_SIZE,
        };
    }
    drawText(text, startingYPosition, fontSize) {
        this.canvas.canvasContext.font = FontHelper.getFontFamily(fontSize);
        const measuredText = this.canvas.canvasContext.measureText(text);
        const xPosition = this.canvas.width / 2 - measuredText.width / 2;
        this.canvas.canvasContext.fillText(text, xPosition, startingYPosition);
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
    getDamageAmount() {
        return BlasterBullet.DAMAGE;
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
BlasterBullet.DAMAGE = 5;
class SpaceInvaders {
    constructor() {
        this.FPS = 60;
        this.lastTimestamp = 0;
        this.score = 0;
        this.bulletArray = [];
        this.enemyBulletArray = [];
        this.gameStarted = false;
        const millisecondsPerFrame = 1000 / this.FPS;
        this.renderMaximumMilliseconds = Math.floor(millisecondsPerFrame) + 1;
        this.renderMinimumMilliseconds = Math.floor(millisecondsPerFrame) - 1;
        this.canvas = CanvasInstance.getInstance();
        const playerVerticalPosition = Player.getInitialVerticalPosition(this.canvas.height);
        const playerHorizontalPosition = Player.getInitialHorizontalPosition(this.canvas.height);
        this.player = new Player(playerVerticalPosition, playerHorizontalPosition);
        this.enemyGroup = new EnemyGroup();
        this.keyboardControls = new KeyboardControls(this.player, () => {
            this.startGame();
        });
        this.keyboardControls.addKeyDownControls();
        this.keyboardControls.addKeyUpControls();
        this.collisionDetector = new CollisionDetectionService();
        this.headsUpDisplay = new HeadsUpDisplayService();
        this.gameSplashScreen = new DrawGameSplashScreen();
        this.levelService = new LevelService();
    }
    renderFrame(timestamp) {
        if (!this.shouldRenderFrame(timestamp))
            return;
        const ctx = this.canvas.canvasContext;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.gameStarted) {
            this.gameSplashScreen.drawSplashScreen();
            return;
        }
        if (this.levelService.isShowingNextLevelScreen()) {
            this.levelService.drawNextLevelScreen();
            return;
        }
        if (this.enemyGroup.hasEnemies()) {
            this.renderGamePlay();
        }
        else if (!this.levelService.hasRemainingLevels()) {
            //TODO - implement game over - player won
            console.log("game over");
        }
        else {
            this.startNextLevel();
        }
    }
    renderGamePlay() {
        this.removeCollidedBulletsAndEnemies();
        this.checkPlayerHit();
        this.enemyGroup.getEnemies().forEach((enemy) => enemy.draw());
        this.addNextShot(this.enemyGroup.getNextShot(), this.enemyBulletArray);
        this.player.draw();
        this.addNextShot(this.player.getNextShot(), this.bulletArray);
        this.showAndRemoveBullets(this.enemyBulletArray);
        this.showAndRemoveBullets(this.bulletArray);
        this.headsUpDisplay.draw(this.score, this.levelService.getCurrentLevel(), this.player.getHealth());
    }
    startNextLevel() {
        this.bulletArray.length = 0;
        this.enemyBulletArray.length = 0;
        this.player.reset();
        const enemiesForNextLevel = this.levelService.startNextLevel();
        if (!enemiesForNextLevel)
            return;
        this.enemyGroup.addEnemies(enemiesForNextLevel);
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
    showAndRemoveBullets(bullets) {
        [...bullets].forEach((bullet, index) => {
            if (!bullet.isBulletOffScreen()) {
                bullet.draw();
            }
            else {
                bullets.splice(index, 1);
            }
        });
    }
    checkPlayerHit() {
        if (this.enemyBulletArray.length === 0)
            return;
        [...this.enemyBulletArray].forEach((bullet, index) => {
            const hasCollided = this.collisionDetector.hasCollided(bullet, this.player);
            if (hasCollided) {
                this.enemyBulletArray.splice(index, 1);
                this.player.decrementHealth(bullet.getDamageAmount());
            }
        });
    }
    removeCollidedBulletsAndEnemies() {
        if (this.bulletArray.length === 0)
            return;
        [...this.bulletArray].forEach((bullet, index) => {
            if (this.getCollidedEnemies(bullet)) {
                this.bulletArray.splice(index, 1);
            }
        });
    }
    getCollidedEnemies(bullet) {
        return this.enemyGroup
            .getEnemies()
            .map((enemy, index) => {
            if (!this.collisionDetector.hasCollided(bullet, enemy)) {
                return false;
            }
            enemy.decrementHealth(bullet.getDamageAmount());
            if (enemy.getHealth() <= 0) {
                this.enemyGroup.removeEnemy(index);
                this.score += enemy.getPointsForDefeating();
            }
            return true;
        })
            .includes(true);
    }
    startGame() {
        this.gameStarted = true;
    }
}
const spaceInvaders = new SpaceInvaders();
function animate(timestamp) {
    spaceInvaders.renderFrame(timestamp);
    requestAnimationFrame(animate);
}
animate(0);
