class MovementService {
  private readonly HEIGHT: number;
  private readonly WIDTH: number;

  private readonly CANVAS_HEIGHT: number;
  private readonly CANVAS_WIDTH: number;

  verticalPosition: number;
  horizontalPosition: number;

  isMovingLeft: boolean = false;
  isMovingRight: boolean = false;
  isMovingUp: boolean = false;
  isMovingDown: boolean = false;

  constructor(
    height: number,
    width: number,
    canvasHeight: number,
    canvasWidth: number,
    initialVerticalPosition: number,
    initialHorizontalPosition: number
  ) {
    this.HEIGHT = height;
    this.WIDTH = width;
    this.CANVAS_HEIGHT = canvasHeight;
    this.CANVAS_WIDTH = canvasWidth;
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

  moveLeft(unitsToMove: number) {
    const newPosition: number = this.horizontalPosition - unitsToMove;
    this.horizontalPosition = newPosition >= 0 ? newPosition : 0;
  }

  moveRight(unitsToMove: number) {
    const newPosition: number = this.horizontalPosition + unitsToMove;
    const maxRightPosition = this.CANVAS_WIDTH - this.WIDTH;
    this.horizontalPosition =
      newPosition <= maxRightPosition ? newPosition : maxRightPosition;
  }

  moveUp(unitsToMove: number) {
    this.verticalPosition = this.verticalPosition - unitsToMove;
  }

  moveDown(unitsToMove: number) {
    this.verticalPosition = this.verticalPosition + unitsToMove;
  }
}
