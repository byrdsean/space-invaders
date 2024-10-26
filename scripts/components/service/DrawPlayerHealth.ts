class DrawPlayerHealth {
  private readonly HEALTH_BAR_COLOR = "white";
  private readonly HEALTH_BAR_DIVET_COLOR = "yellow";
  private readonly HEALTH_BAR_DIVET_HEIGHT = 5;
  private readonly HEALTH_BAR_DIVET_WIDTH = 15;
  private readonly HEALTH_BAR_DIVET_BUFFER = 2;
  private readonly MAX_HEALTH_BAR_DIVETS = 20;
  private readonly BORDER_WIDTH_PIXELS = 1;
  private readonly canvas: Canvas;

  constructor() {
    this.canvas = CanvasInstance.getInstance();
  }

  drawPlayerHealth(
    startingX: number,
    startingY: number,
    playerHealthPercentage: number
  ): BoundingContext {
    const validatedPlayerHealth = this.validatePlayerHealthPercentage(
      playerHealthPercentage
    );

    const healthBarHeight =
      this.HEALTH_BAR_DIVET_HEIGHT * this.MAX_HEALTH_BAR_DIVETS +
      this.HEALTH_BAR_DIVET_BUFFER * this.MAX_HEALTH_BAR_DIVETS +
      this.HEALTH_BAR_DIVET_BUFFER * 2;

    const healthBarWidth =
      this.HEALTH_BAR_DIVET_WIDTH +
      this.HEALTH_BAR_DIVET_BUFFER * 2 +
      this.BORDER_WIDTH_PIXELS * 2;

    this.drawPlayerHealthDivets(startingX, startingY, validatedPlayerHealth);
    this.canvas.canvasContext.strokeStyle = this.HEALTH_BAR_COLOR;
    this.canvas.canvasContext.strokeRect(
      startingX,
      startingY,
      healthBarWidth,
      healthBarHeight
    );

    return {
      x: startingX,
      y: startingY,
      width: healthBarWidth,
      height: healthBarHeight,
    };
  }

  private validatePlayerHealthPercentage(
    playerHealthPercentage: number
  ): number {
    if (playerHealthPercentage < 0) return 0;
    if (playerHealthPercentage > 100) return 100;
    return playerHealthPercentage;
  }

  private drawPlayerHealthDivets(
    startingX: number,
    startingY: number,
    playerHealthPercentage: number
  ) {
    const numberRange = [...new Array(this.MAX_HEALTH_BAR_DIVETS).keys()];
    const numberOfDivetsToHide =
      this.MAX_HEALTH_BAR_DIVETS -
      Math.ceil(this.MAX_HEALTH_BAR_DIVETS * (playerHealthPercentage / 100));

    this.canvas.canvasContext.fillStyle = this.HEALTH_BAR_DIVET_COLOR;
    numberRange.forEach((index) =>
      this.drawHealthDivet(index, numberOfDivetsToHide, startingX, startingY)
    );
  }

  private drawHealthDivet(
    divetIndex: number,
    numberOfDivetsToHide: number,
    startingX: number,
    startingY: number
  ) {
    if (divetIndex < numberOfDivetsToHide) return;

    const xPosition =
      startingX + this.BORDER_WIDTH_PIXELS + this.HEALTH_BAR_DIVET_BUFFER;

    const yPosition =
      startingY +
      this.BORDER_WIDTH_PIXELS +
      this.HEALTH_BAR_DIVET_BUFFER +
      divetIndex *
        (this.HEALTH_BAR_DIVET_HEIGHT + this.HEALTH_BAR_DIVET_BUFFER);

    this.canvas.canvasContext.fillRect(
      xPosition,
      yPosition,
      this.HEALTH_BAR_DIVET_WIDTH,
      this.HEALTH_BAR_DIVET_HEIGHT
    );
  }
}
