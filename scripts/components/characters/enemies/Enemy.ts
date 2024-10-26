// @ts-ignore
class Enemy extends MoveableEntity {
  public static HEIGHT = 25;
  public static WIDTH = 25;
  private static COLOR = "purple";

  private blaster: Blaster;

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

    this.blaster = new Blaster(
      this.verticalPosition + Enemy.HEIGHT,
      initialHorizontalPosition,
      Enemy.WIDTH
    );
    this.blaster.shootDownwards();
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

  getNextShot(): BlasterBullet | null {
    return this.blaster.shoot();
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
      this.blaster.updateBlasterHorizontalPosition(this.horizontalPosition);
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
      this.blaster.updateBlasterHorizontalPosition(this.horizontalPosition);
    }
  }

  private updateMoveDown() {
    if (!this.isMovingDown) return;

    if (this.verticalPosition < this.nextVerticalPositonToMoveDown) {
      this.moveDown(this.movementSpeed);

      this.blaster.updateBlasterVerticalPosition(
        this.verticalPosition + Enemy.HEIGHT
      );

      return;
    }

    this.stopMovingDown();

    if (this.horizontalPosition <= this.maxLeftPosition) {
      this.startMovingRight();
    }

    if (this.horizontalPosition + Enemy.WIDTH >= this.maxRightPosition) {
      this.startMovingLeft();
    }
  }

  private setNextVerticalPositionToMoveDown() {
    this.nextVerticalPositonToMoveDown += Enemy.HEIGHT;
  }
}
