// @ts-ignore
class Enemy extends MoveableEntity {
  public static HEIGHT = 25;
  public static WIDTH = 25;
  private static COLOR = "purple";

  private readonly minHorizontalBound: number;
  private readonly maxHorizontalBound: number;

  lastVerticalPosition: number = 0;

  constructor(
    initialVerticalPosition: number,
    initialHorizontalPosition: number,
    minHorizontalBound: number,
    maxHorizontalBound: number
  ) {
    super(
      initialVerticalPosition,
      initialHorizontalPosition,
      Enemy.HEIGHT,
      Enemy.WIDTH
    );
    this.minHorizontalBound = minHorizontalBound;
    this.maxHorizontalBound = maxHorizontalBound;
    this.lastVerticalPosition = initialVerticalPosition;
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
    this.checkLeftMovement();
    this.checkRightMovement();
    this.checkDownMovement();
  }

  private checkLeftMovement() {
    if (!this.isMovingLeft) return;

    if (this.minHorizontalBound <= this.horizontalPosition - 1) {
      this.moveLeft(1);
    } else {
      this.startMovingRight();
      this.startMovingDown();
    }
  }

  private checkRightMovement() {
    if (!this.isMovingRight) return;

    const nextPosition = this.horizontalPosition + Enemy.WIDTH + 1;
    if (nextPosition <= this.maxHorizontalBound) {
      this.moveRight(1);
    } else {
      this.startMovingLeft();
      this.startMovingDown();
    }
  }

  private checkDownMovement() {
    if (!this.isMovingDown) return;

    if (this.verticalPosition - this.lastVerticalPosition >= Enemy.HEIGHT) {
      this.stopMovingDown();
      this.lastVerticalPosition = this.verticalPosition;
    } else {
      this.moveDown(1);
    }
  }
}
