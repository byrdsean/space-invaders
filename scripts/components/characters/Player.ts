class Player {
  private readonly HEIGHT = 25;
  private readonly WIDTH = 25;
  private readonly COLOR = "green";

  private readonly canvas: Canvas;
  private readonly movementService: MovementService;
  private blaster: Blaster;

  private isShooting: boolean = false;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.movementService = new MovementService(
      this.HEIGHT,
      this.WIDTH,
      this.canvas.height,
      this.canvas.width,
      this.getInitialVerticalPosition(),
      this.getInitialHorizontalPosition()
    );
    this.blaster = new Blaster(canvas, this.movementService.verticalPosition);
  }

  reset() {
    this.isShooting = false;
    this.movementService.verticalPosition = this.getInitialVerticalPosition();
    this.movementService.horizontalPosition =
      this.getInitialHorizontalPosition();
    this.blaster = new Blaster(canvas, this.movementService.verticalPosition);
  }

  getInitialVerticalPosition(): number {
    return this.canvas.height - this.HEIGHT;
  }

  getInitialHorizontalPosition(): number {
    return Math.floor(this.canvas.width / 2 - this.WIDTH / 2);
  }

  draw() {
    this.updatePosition();

    const previousFillStyle = this.canvas.canvasContext.fillStyle;

    this.canvas.canvasContext.fillStyle = this.COLOR;
    this.canvas.canvasContext.fillRect(
      this.movementService.horizontalPosition,
      this.movementService.verticalPosition,
      this.WIDTH,
      this.HEIGHT
    );

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

  getNextShot(): BlasterBullet | null {
    if (!this.isShooting) return null;

    const blasterHorizontalOffset =
      this.movementService.horizontalPosition +
      Math.floor(this.WIDTH / 2) -
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

  private updatePosition() {
    if (this.movementService.isMovingLeft) {
      this.movementService.moveLeft(1);
    } else if (this.movementService.isMovingRight) {
      this.movementService.moveRight(1);
    }
  }
}
