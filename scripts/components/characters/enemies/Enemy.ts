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
      this.horizontalPosition,
      this.verticalPosition,
      Enemy.WIDTH,
      Enemy.HEIGHT
    );

    this.canvas.canvasContext.fillStyle = previousFillStyle;
  }

  private updatePosition() {
    if (this.isMovingLeft) {
      this.moveLeft(1);
    } else if (this.isMovingRight) {
      this.moveRight(1);
    }
  }
}
