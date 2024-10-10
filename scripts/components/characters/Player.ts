// @ts-ignore
class Player extends MoveableEntity {
  public static HEIGHT = 25;
  public static WIDTH = 25;
  private static COLOR = "green";

  private isShooting: boolean = false;

  private blaster: Blaster;

  constructor() {
    super(
      Player.getInitialVerticalPosition(canvas.height),
      Player.getInitialHorizontalPosition(canvas.width),
      Player.HEIGHT,
      Player.WIDTH
    );
    this.blaster = new Blaster(this.movementService.verticalPosition);
  }

  reset() {
    this.isShooting = false;
    this.movementService.verticalPosition = Player.getInitialVerticalPosition(
      canvas.height
    );
    this.movementService.horizontalPosition =
      Player.getInitialHorizontalPosition(canvas.width);
    this.blaster = new Blaster(this.movementService.verticalPosition);
  }

  override draw() {
    this.updatePosition();

    const previousFillStyle = this.canvas.canvasContext.fillStyle;

    this.canvas.canvasContext.fillStyle = Player.COLOR;
    this.canvas.canvasContext.fillRect(
      this.movementService.horizontalPosition,
      this.movementService.verticalPosition,
      Player.WIDTH,
      Player.HEIGHT
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

  private updatePosition() {
    if (this.movementService.isMovingLeft) {
      this.movementService.moveLeft(1);
    } else if (this.movementService.isMovingRight) {
      this.movementService.moveRight(1);
    }
  }

  private static getInitialVerticalPosition(maxHeight: number): number {
    return maxHeight - this.HEIGHT;
  }

  private static getInitialHorizontalPosition(maxWidth: number): number {
    return Math.floor(maxWidth / 2 - this.WIDTH / 2);
  }
}
