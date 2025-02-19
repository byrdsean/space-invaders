// @ts-ignore
class BlasterBullet extends MoveableEntity {
  private static DAMAGE = 5;
  private readonly COLOR = "red";

  private readonly BULLET_HEIGHT = 5;
  private readonly BULLET_WIDTH = 5;

  private readonly bulletSpeed: number;

  constructor(
    verticalPosition: number,
    horizontalPosition: number,
    bulletSpeed: number
  ) {
    super();

    this.HEIGHT = this.BULLET_HEIGHT;
    this.WIDTH = this.BULLET_WIDTH;

    this.verticalPosition = verticalPosition;
    this.horizontalPosition = horizontalPosition;
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
