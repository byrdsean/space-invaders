// @ts-ignore
class Enemy extends MoveableEntity {
  public static HEIGHT = 25;
  public static WIDTH = 25;
  private static COLOR = "purple";

  constructor(
    initialVerticalPosition: number,
    initialHorizontalPosition: number
  ) {
    super(
      initialVerticalPosition,
      initialHorizontalPosition,
      Enemy.HEIGHT,
      Enemy.WIDTH
    );
  }

  override draw() {
    this.updatePosition();

    const previousFillStyle = this.canvas.canvasContext.fillStyle;

    this.canvas.canvasContext.fillStyle = Enemy.COLOR;
    this.canvas.canvasContext.fillRect(
      this.movementService.horizontalPosition,
      this.movementService.verticalPosition,
      Enemy.WIDTH,
      Enemy.HEIGHT
    );

    this.canvas.canvasContext.fillStyle = previousFillStyle;
  }

  private updatePosition() {
    if (this.movementService.isMovingLeft) {
      this.movementService.moveLeft(1);
    } else if (this.movementService.isMovingRight) {
      this.movementService.moveRight(1);
    }
  }
}
