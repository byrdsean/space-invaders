"use strict";
function getCanvas() {
    var gameScreen = document.getElementById("game_screen");
    var boundedContext = gameScreen.getBoundingClientRect();
    var height = Math.floor(boundedContext.height) - Constants.BORDER_WIDTH;
    var width = Math.floor(boundedContext.width) - Constants.BORDER_WIDTH;
    gameScreen.height = height;
    gameScreen.width = width;
    return {
        canvasContext: gameScreen.getContext("2d"),
        height: height,
        width: width,
    };
}
var Constants = /** @class */ (function () {
    function Constants() {
    }
    var _a;
    _a = Constants;
    Constants.BORDER_WIDTH = 1;
    Constants.FPS = 60;
    Constants.MILLISECONDS_PER_FRAME = 1000 / _a.FPS;
    Constants.MILLISECONDS_RENDER_MINIMUM = Math.floor(_a.MILLISECONDS_PER_FRAME) - 1;
    Constants.MILLISECONDS_RENDER_MAXIMUM = Math.floor(_a.MILLISECONDS_PER_FRAME) + 1;
    return Constants;
}());
var Player = /** @class */ (function () {
    function Player(canvas) {
        this.HEIGHT = 25;
        this.WIDTH = 25;
        this.COLOR = "green";
        this.isShooting = false;
        this.canvas = canvas;
        this.movementService = new MovementService(this.HEIGHT, this.WIDTH, this.canvas.height, this.canvas.width, this.getInitialVerticalPosition(), this.getInitialHorizontalPosition());
        this.blaster = new Blaster(canvas, this.movementService.verticalPosition);
    }
    Player.prototype.reset = function () {
        this.isShooting = false;
        this.movementService.verticalPosition = this.getInitialVerticalPosition();
        this.movementService.horizontalPosition =
            this.getInitialHorizontalPosition();
        this.blaster = new Blaster(canvas, this.movementService.verticalPosition);
    };
    Player.prototype.getInitialVerticalPosition = function () {
        return this.canvas.height - this.HEIGHT;
    };
    Player.prototype.getInitialHorizontalPosition = function () {
        return Math.floor(this.canvas.width / 2 - this.WIDTH / 2);
    };
    Player.prototype.draw = function () {
        this.updatePosition();
        var previousFillStyle = this.canvas.canvasContext.fillStyle;
        this.canvas.canvasContext.fillStyle = this.COLOR;
        this.canvas.canvasContext.fillRect(this.movementService.horizontalPosition, this.movementService.verticalPosition, this.WIDTH, this.HEIGHT);
        this.canvas.canvasContext.fillStyle = previousFillStyle;
    };
    Player.prototype.startMovingLeft = function () {
        this.movementService.startMovingLeft();
    };
    Player.prototype.startMovingRight = function () {
        this.movementService.startMovingRight();
    };
    Player.prototype.stopMovingRight = function () {
        this.movementService.stopMovingRight();
    };
    Player.prototype.stopMovingLeft = function () {
        this.movementService.stopMovingLeft();
    };
    Player.prototype.getNextShot = function () {
        if (!this.isShooting)
            return null;
        var blasterHorizontalOffset = this.movementService.horizontalPosition +
            Math.floor(this.WIDTH / 2) -
            this.blaster.getBlasterHorizontalOffset();
        return this.blaster.shoot(blasterHorizontalOffset);
    };
    Player.prototype.startShooting = function () {
        this.isShooting = true;
    };
    Player.prototype.stopShooting = function () {
        this.isShooting = false;
    };
    Player.prototype.increaseRateOfFire = function () {
        this.blaster.increaseRateOfFire();
    };
    Player.prototype.decreaseRateOfFire = function () {
        this.blaster.decreaseRateOfFire();
    };
    Player.prototype.updatePosition = function () {
        if (this.movementService.isMovingLeft) {
            this.movementService.moveLeft(1);
        }
        else if (this.movementService.isMovingRight) {
            this.movementService.moveRight(1);
        }
    };
    return Player;
}());
var KeyboardControls = /** @class */ (function () {
    function KeyboardControls(player) {
        this.player = player;
        this.addKeyDownControls();
        this.addKeyUpControls();
    }
    KeyboardControls.prototype.addKeyDownControls = function () {
        var _this = this;
        window.addEventListener("keydown", function (e) {
            switch (e.code) {
                case "ArrowLeft":
                    _this.player.startMovingLeft();
                    break;
                case "ArrowRight":
                    _this.player.startMovingRight();
                    break;
                case "Space":
                    _this.player.startShooting();
                    break;
            }
        });
    };
    KeyboardControls.prototype.addKeyUpControls = function () {
        var _this = this;
        window.addEventListener("keyup", function (e) {
            switch (e.code) {
                case "ArrowLeft":
                    _this.player.stopMovingLeft();
                    break;
                case "ArrowRight":
                    _this.player.stopMovingRight();
                    break;
                case "ArrowUp":
                    _this.player.increaseRateOfFire();
                    break;
                case "ArrowDown":
                    _this.player.decreaseRateOfFire();
                    break;
                case "Space":
                    _this.player.stopShooting();
                    break;
            }
        });
    };
    return KeyboardControls;
}());
var MovementService = /** @class */ (function () {
    function MovementService(height, width, canvasHeight, canvasWidth, initialVerticalPosition, initialHorizontalPosition) {
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
    MovementService.prototype.startMovingLeft = function () {
        this.isMovingLeft = true;
        this.isMovingRight = false;
    };
    MovementService.prototype.stopMovingLeft = function () {
        this.isMovingLeft = false;
    };
    MovementService.prototype.startMovingRight = function () {
        this.isMovingRight = true;
        this.isMovingLeft = false;
    };
    MovementService.prototype.stopMovingRight = function () {
        this.isMovingRight = false;
    };
    MovementService.prototype.startMovingUp = function () {
        this.isMovingUp = true;
        this.isMovingDown = false;
    };
    MovementService.prototype.stopMovingUp = function () {
        this.isMovingUp = false;
    };
    MovementService.prototype.startMovingDown = function () {
        this.isMovingDown = true;
        this.isMovingUp = false;
    };
    MovementService.prototype.stopMovingDown = function () {
        this.isMovingDown = false;
    };
    MovementService.prototype.moveLeft = function (unitsToMove) {
        var newPosition = this.horizontalPosition - unitsToMove;
        this.horizontalPosition = newPosition >= 0 ? newPosition : 0;
    };
    MovementService.prototype.moveRight = function (unitsToMove) {
        var newPosition = this.horizontalPosition + unitsToMove;
        var maxRightPosition = this.CANVAS_WIDTH - this.WIDTH;
        this.horizontalPosition =
            newPosition <= maxRightPosition ? newPosition : maxRightPosition;
    };
    MovementService.prototype.moveUp = function (unitsToMove) {
        this.verticalPosition = this.verticalPosition - unitsToMove;
    };
    MovementService.prototype.moveDown = function (unitsToMove) {
        this.verticalPosition = this.verticalPosition + unitsToMove;
    };
    return MovementService;
}());
var Blaster = /** @class */ (function () {
    function Blaster(canvas, initialVerticalPosition) {
        this.BULLET_SPEED = 5;
        this.MAXIMUM_COOLDOWN_PERIOD_MILLISECONDS = 500;
        this.MINIMUM_COOLDOWN_PERIOD_MILLISECONDS = 100;
        this.CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS = 25;
        this.timeLastShotFired = 0;
        this.cooldownPeriod = this.MAXIMUM_COOLDOWN_PERIOD_MILLISECONDS;
        this.canvas = canvas;
        this.verticalPosition = initialVerticalPosition;
    }
    Blaster.prototype.shoot = function (initialHorizontalPosition) {
        var currentTime = Date.now();
        var shouldFire = currentTime - this.timeLastShotFired >= this.cooldownPeriod;
        if (!shouldFire)
            return null;
        this.timeLastShotFired = currentTime;
        return new BlasterBullet(this.canvas, this.verticalPosition, initialHorizontalPosition, this.BULLET_SPEED);
    };
    Blaster.prototype.increaseRateOfFire = function () {
        var newCoolDown = this.cooldownPeriod - this.CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS;
        this.cooldownPeriod =
            newCoolDown < this.MINIMUM_COOLDOWN_PERIOD_MILLISECONDS
                ? this.MINIMUM_COOLDOWN_PERIOD_MILLISECONDS
                : newCoolDown;
    };
    Blaster.prototype.decreaseRateOfFire = function () {
        var newCoolDown = this.cooldownPeriod + this.CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS;
        this.cooldownPeriod =
            newCoolDown > this.MAXIMUM_COOLDOWN_PERIOD_MILLISECONDS
                ? this.MAXIMUM_COOLDOWN_PERIOD_MILLISECONDS
                : newCoolDown;
    };
    Blaster.prototype.getBlasterHorizontalOffset = function () {
        return Math.floor(BlasterBullet.WIDTH / 2);
    };
    return Blaster;
}());
var BlasterBullet = /** @class */ (function () {
    function BlasterBullet(canvas, initialVerticalPosition, initialHorizontalPosition, bulletSpeed) {
        this.COLOR = "red";
        this.canvas = canvas;
        this.bulletSpeed = bulletSpeed;
        this.movementService = new MovementService(BlasterBullet.HEIGHT, BlasterBullet.WIDTH, this.canvas.height, this.canvas.width, initialVerticalPosition, initialHorizontalPosition);
        this.movementService.startMovingUp();
    }
    BlasterBullet.prototype.draw = function () {
        this.updatePosition();
        var previousFillStyle = this.canvas.canvasContext.fillStyle;
        this.canvas.canvasContext.fillStyle = this.COLOR;
        this.canvas.canvasContext.fillRect(this.movementService.horizontalPosition, this.movementService.verticalPosition, BlasterBullet.WIDTH, BlasterBullet.HEIGHT);
        this.canvas.canvasContext.fillStyle = previousFillStyle;
    };
    BlasterBullet.prototype.isBulletOffScreen = function () {
        return this.movementService.verticalPosition <= -BlasterBullet.HEIGHT;
    };
    BlasterBullet.prototype.updatePosition = function () {
        if (this.movementService.isMovingUp) {
            this.movementService.moveUp(this.bulletSpeed);
        }
    };
    BlasterBullet.HEIGHT = 5;
    BlasterBullet.WIDTH = 5;
    return BlasterBullet;
}());
var bulletArray = [];
var canvas = getCanvas();
// @ts-ignore
var player = new Player(canvas);
// @ts-ignore
var keyboardControls = new KeyboardControls(player);
var lastTimestamp = 0;
function shouldRenderFrame(timestamp) {
    var deltaTimeMilliseconds = Math.floor(timestamp - lastTimestamp);
    lastTimestamp = timestamp;
    return (Constants.MILLISECONDS_RENDER_MINIMUM <= deltaTimeMilliseconds &&
        deltaTimeMilliseconds <= Constants.MILLISECONDS_RENDER_MAXIMUM);
}
function initNewGame() {
    player.reset();
    player.draw();
}
function renderBullets() {
    var index = 0;
    while (index < bulletArray.length) {
        var currentBullet = bulletArray[index];
        if (!currentBullet.isBulletOffScreen()) {
            currentBullet.draw();
            index++;
        }
        else {
            bulletArray.splice(index, 1);
        }
    }
}
function renderFrame(timestamp) {
    if (!shouldRenderFrame(timestamp)) {
        return;
    }
    canvas.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    var nextShot = player.getNextShot();
    if (nextShot !== null) {
        bulletArray.push(nextShot);
    }
    renderBullets();
}
function animate(timestamp) {
    renderFrame(timestamp);
    requestAnimationFrame(animate);
}
initNewGame();
animate(0);
