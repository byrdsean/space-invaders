abstract class MoveableEntity {
  protected readonly canvas: Canvas;
  protected readonly movementService: MovementService;

  constructor(
    initialVerticalPosition: number,
    initialHorizontalPosition: number,
    height: number,
    width: number
  ) {
    this.canvas = CanvasInstance.getInstance();
    this.movementService = new MovementService(
      height,
      width,
      this.canvas.height,
      this.canvas.width,
      initialVerticalPosition,
      initialHorizontalPosition
    );
  }

  abstract draw(): void;
}
