// @ts-ignore
class BlasterBullet extends MoveableEntity {
  private static DAMAGE = 5;
  private readonly COLOR = "red";

  private readonly bulletSpeed: number;

  constructor(
    initialVerticalPosition: number,
    initialHorizontalPosition: number,
    bulletSpeed: number
  ) {
    super(initialVerticalPosition, initialHorizontalPosition);
    this.bulletSpeed = bulletSpeed;

    // TODO: replace with const variables
    this.HEIGHT = 5;
    this.WIDTH = 5;
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
      this.WIDTH,
      this.HEIGHT
    );

    this.canvas.canvasContext.fillStyle = previousFillStyle;
  }

  isBulletOffScreen(): boolean {
    const isAboveCanvas = this.verticalPosition <= -this.HEIGHT;
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
