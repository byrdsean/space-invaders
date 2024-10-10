// @ts-ignore
class BlasterBullet extends MoveableEntity {
  public static HEIGHT = 5;
  public static WIDTH = 5;
  private readonly COLOR = "red";

  private readonly bulletSpeed: number;

  constructor(
    initialVerticalPosition: number,
    initialHorizontalPosition: number,
    bulletSpeed: number
  ) {
    super(
      initialVerticalPosition,
      initialHorizontalPosition,
      BlasterBullet.HEIGHT,
      BlasterBullet.WIDTH
    );
    this.bulletSpeed = bulletSpeed;
    this.movementService.startMovingUp();
  }

  override draw() {
    this.updatePosition();

    const previousFillStyle = this.canvas.canvasContext.fillStyle;

    this.canvas.canvasContext.fillStyle = this.COLOR;
    this.canvas.canvasContext.fillRect(
      this.movementService.horizontalPosition,
      this.movementService.verticalPosition,
      BlasterBullet.WIDTH,
      BlasterBullet.HEIGHT
    );

    this.canvas.canvasContext.fillStyle = previousFillStyle;
  }

  isBulletOffScreen(): boolean {
    return this.movementService.verticalPosition <= -BlasterBullet.HEIGHT;
  }

  private updatePosition() {
    if (this.movementService.isMovingUp) {
      this.movementService.moveUp(this.bulletSpeed);
    }
  }
}
