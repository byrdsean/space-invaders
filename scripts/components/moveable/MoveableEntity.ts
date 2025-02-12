abstract class MoveableEntity {
  protected HEIGHT: number = 0;
  protected WIDTH: number = 0;

  protected verticalPosition: number = 0;
  protected horizontalPosition: number = 0;

  protected isMovingLeft: boolean = false;
  protected isMovingRight: boolean = false;
  protected isMovingUp: boolean = false;
  protected isMovingDown: boolean = false;

  protected readonly canvas: Canvas;

  constructor() {
    this.canvas = CanvasInstance.getInstance();
  }

  getHeight(): number {
    return this.HEIGHT;
  }

  getWidth(): number {
    return this.WIDTH;
  }

  getVerticalPosition() {
    return this.verticalPosition;
  }

  getHorizontalPosition() {
    return this.horizontalPosition;
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

  protected reset() {
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.isMovingUp = false;
    this.isMovingDown = false;
  }

  abstract draw(): void;
}
