// @ts-ignore
class Enemy extends MoveableEntity {
  public static HEIGHT = 25;
  public static WIDTH = 25;
  private static COLOR = "purple";

  maxLeftPosition = 0;
  maxRightPosition = 0;
  nextVerticalPositonToMoveDown = 0;
  movementSpeed = 1;

  constructor(
    initialVerticalPosition: number,
    initialHorizontalPosition: number,
    maxLeftPosition: number,
    maxRightPosition: number
  ) {
    super(
      initialVerticalPosition,
      initialHorizontalPosition,
      Enemy.HEIGHT,
      Enemy.WIDTH
    );
    this.maxLeftPosition = maxLeftPosition;
    this.maxRightPosition = maxRightPosition;
    this.nextVerticalPositonToMoveDown = initialVerticalPosition;
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
    this.updateMoveLeft();
    this.updateMoveRight();
    this.updateMoveDown();
  }

  private updateMoveLeft() {
    if (!this.isMovingLeft) return;

    if (this.horizontalPosition <= this.maxLeftPosition) {
      this.stopMovingLeft();
      this.setNextVerticalPositionToMoveDown();
      this.startMovingDown();
    } else {
      this.moveLeft(this.movementSpeed, this.maxLeftPosition);
    }
  }

  private updateMoveRight() {
    if (!this.isMovingRight) return;

    if (this.horizontalPosition + Enemy.WIDTH >= this.maxRightPosition) {
      this.stopMovingRight();
      this.setNextVerticalPositionToMoveDown();
      this.startMovingDown();
    } else {
      this.moveRight(this.movementSpeed, this.maxRightPosition);
    }
  }

  private updateMoveDown() {
    if (!this.isMovingDown) return;

    if (this.verticalPosition >= this.nextVerticalPositonToMoveDown) {
      this.stopMovingDown();

      if (this.horizontalPosition <= this.maxLeftPosition) {
        this.startMovingRight();
      }

      if (this.horizontalPosition + Enemy.WIDTH >= this.maxRightPosition) {
        this.startMovingLeft();
      }
    } else {
      this.moveDown(this.movementSpeed);
    }
  }

  private setNextVerticalPositionToMoveDown() {
    this.nextVerticalPositonToMoveDown += Enemy.HEIGHT;
  }
}
