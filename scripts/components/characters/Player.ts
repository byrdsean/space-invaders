// @ts-ignore
class Player extends MoveableEntity {
  public static HEIGHT = 25;
  public static WIDTH = 25;
  private static COLOR = "green";

  private isShooting: boolean = false;

  private blaster: Blaster;
  private blasterHorizontalPosition: number = 0;

  constructor() {
    super(
      Player.getInitialVerticalPosition(canvas.height),
      Player.getInitialHorizontalPosition(canvas.width),
      Player.HEIGHT,
      Player.WIDTH
    );
    this.blaster = new Blaster(this.verticalPosition);
    this.updateBlasterHorizontalPosition();
  }

  reset() {
    this.isShooting = false;
    this.verticalPosition = Player.getInitialVerticalPosition(canvas.height);
    this.horizontalPosition = Player.getInitialHorizontalPosition(canvas.width);
    this.blaster = new Blaster(this.verticalPosition);
    this.updateBlasterHorizontalPosition();
  }

  override draw() {
    this.updatePosition();

    const previousFillStyle = this.canvas.canvasContext.fillStyle;

    this.canvas.canvasContext.fillStyle = Player.COLOR;
    this.canvas.canvasContext.fillRect(
      this.horizontalPosition,
      this.verticalPosition,
      Player.WIDTH,
      Player.HEIGHT
    );

    this.canvas.canvasContext.fillStyle = previousFillStyle;
  }

  getNextShot(): BlasterBullet | null {
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

  private updatePosition() {
    if (this.isMovingLeft) {
      this.moveLeft(1);
    } else if (this.isMovingRight) {
      this.moveRight(1);
    }

    if (this.isMovingLeft || this.isMovingRight) {
      this.updateBlasterHorizontalPosition();
    }
  }

  private static getInitialVerticalPosition(maxHeight: number): number {
    return maxHeight - this.HEIGHT;
  }

  private static getInitialHorizontalPosition(maxWidth: number): number {
    return Math.floor(maxWidth / 2 - this.WIDTH / 2);
  }

  private updateBlasterHorizontalPosition() {
    this.blasterHorizontalPosition =
      this.horizontalPosition +
      Math.floor(Player.WIDTH / 2) -
      this.blaster.getBlasterHorizontalOffset();
  }
}
