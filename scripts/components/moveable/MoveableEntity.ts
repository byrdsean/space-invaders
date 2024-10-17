abstract class MoveableEntity {
  private readonly HEIGHT: number;
  private readonly WIDTH: number;

  verticalPosition: number;
  horizontalPosition: number;

  isMovingLeft: boolean = false;
  isMovingRight: boolean = false;
  isMovingUp: boolean = false;
  isMovingDown: boolean = false;

  protected readonly canvas: Canvas;

  constructor(
    initialVerticalPosition: number,
    initialHorizontalPosition: number,
    height: number,
    width: number
  ) {
    this.canvas = CanvasInstance.getInstance();
    this.HEIGHT = height;
    this.WIDTH = width;
    this.verticalPosition = initialVerticalPosition;
    this.horizontalPosition = initialHorizontalPosition;
  }

  startMovingLeft() {
    this.isMovingLeft = true;
    this.isMovingRight = false;
  }

  stopMovingLeft() {
    this.isMovingLeft = false;
  }

  startMovingRight() {
    this.isMovingRight = true;
    this.isMovingLeft = false;
  }

  stopMovingRight() {
    this.isMovingRight = false;
  }

  startMovingUp() {
    this.isMovingUp = true;
    this.isMovingDown = false;
  }

  stopMovingUp() {
    this.isMovingUp = false;
  }

  startMovingDown() {
    this.isMovingDown = true;
    this.isMovingUp = false;
  }

  stopMovingDown() {
    this.isMovingDown = false;
  }

  protected moveLeft(unitsToMove: number, minHorizontalPosition: number = 0) {
    const newPosition: number = this.horizontalPosition - unitsToMove;
    this.horizontalPosition =
      newPosition >= minHorizontalPosition
        ? newPosition
        : minHorizontalPosition;
  }

  protected moveRight(
    unitsToMove: number,
    maxWidth: number = this.canvas.width
  ) {
    const newPosition: number = this.horizontalPosition + unitsToMove;
    const maxRightPosition = maxWidth - this.WIDTH;
    this.horizontalPosition =
      newPosition <= maxRightPosition ? newPosition : maxRightPosition;
  }

  protected moveUp(unitsToMove: number) {
    this.verticalPosition = this.verticalPosition - unitsToMove;
  }

  protected moveDown(unitsToMove: number) {
    this.verticalPosition = this.verticalPosition + unitsToMove;
  }

  abstract draw(): void;
}
