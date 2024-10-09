class BlasterBullet {
  public static HEIGHT = 5;
  public static WIDTH = 5;
  private readonly COLOR = "red";

  private readonly canvas: Canvas;
  private readonly movementService: MovementService;
  private readonly bulletSpeed: number;

  constructor(
    canvas: Canvas,
    initialVerticalPosition: number,
    initialHorizontalPosition: number,
    bulletSpeed: number
  ) {
    this.canvas = canvas;
    this.bulletSpeed = bulletSpeed;
    this.movementService = new MovementService(
      BlasterBullet.HEIGHT,
      BlasterBullet.WIDTH,
      this.canvas.height,
      this.canvas.width,
      initialVerticalPosition,
      initialHorizontalPosition
    );
    this.movementService.startMovingUp();
  }

  draw() {
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
