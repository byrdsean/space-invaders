class BlasterBullet extends MoveableEntity {
  private readonly BLASTER_BULLET_HEIGHT = 5;
  private readonly BLASTER_BULLET_WIDTH = 5;

  protected color = "red";
  protected bulletSpeed = 2;
  protected damage: number = 5;

  constructor(verticalPosition: number, horizontalPosition: number) {
    super();

    this.HEIGHT = this.BLASTER_BULLET_HEIGHT;
    this.WIDTH = this.BLASTER_BULLET_WIDTH;

    this.verticalPosition = verticalPosition;
    this.horizontalPosition = horizontalPosition;
  }

  getDamageAmount(): number {
    return this.damage;
  }

  override draw() {
    this.updatePosition();

    const previousFillStyle = this.canvas.canvasContext.fillStyle;

    this.canvas.canvasContext.fillStyle = this.color;
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
