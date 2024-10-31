// @ts-ignore
class BlasterBullet extends MoveableEntity {
  public static HEIGHT = 5;
  public static WIDTH = 5;
  private static DAMAGE = 10;
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
  }

  getDamageAmount(): number {
    return BlasterBullet.DAMAGE;
  }

  override draw() {
    this.updatePosition();

    const previousFillStyle = this.canvas.canvasContext.fillStyle;

    this.canvas.canvasContext.fillStyle = this.COLOR;
    this.canvas.canvasContext.fillRect(
      this.horizontalPosition,
      this.verticalPosition,
      BlasterBullet.WIDTH,
      BlasterBullet.HEIGHT
    );

    this.canvas.canvasContext.fillStyle = previousFillStyle;
  }

  isBulletOffScreen(): boolean {
    const isAboveCanvas = this.verticalPosition <= -BlasterBullet.HEIGHT;
    const isBelowCanvas = this.verticalPosition >= this.canvas.height;
    return isAboveCanvas || isBelowCanvas;
  }

  private updatePosition() {
    if (this.isMovingUp) {
      this.moveUp(this.bulletSpeed);
    } else if (this.isMovingDown) {
      this.moveDown(this.bulletSpeed);
    }
  }
}
