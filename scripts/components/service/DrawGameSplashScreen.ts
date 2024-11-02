class DrawGameSplashScreen {
  private readonly BUFFER_SIZE_PIXELS = 20;
  private readonly FONT_COLOR = "white";
  private readonly GAME_TITLE = "SPACE INVADERS";
  private readonly PRESS_ENTER = "Press ENTER to start";
  private readonly canvas: Canvas;

  constructor() {
    this.canvas = CanvasInstance.getInstance();
    this.canvas.canvasContext.fillStyle = this.FONT_COLOR;
  }

  drawSplashScreen() {
    const titleBoundingContext = this.drawTitle();

    this.drawText(
      this.PRESS_ENTER,
      titleBoundingContext.y +
        titleBoundingContext.height +
        this.BUFFER_SIZE_PIXELS,
      FontHelper.FONT_SIZE
    );
  }

  drawTitle(): BoundingContext {
    this.canvas.canvasContext.font = FontHelper.getFontFamily(
      FontHelper.TITLE_FONT_SIZE
    );

    const measuredText: TextMetrics = this.canvas.canvasContext.measureText(
      this.GAME_TITLE
    );
    const xPosition = this.canvas.width / 2 - measuredText.width / 2;
    const yPosition = this.canvas.height / 2 - FontHelper.TITLE_FONT_SIZE / 2;

    this.canvas.canvasContext.fillText(this.GAME_TITLE, xPosition, yPosition);

    return {
      x: xPosition,
      y: yPosition,
      width: measuredText.width,
      height: FontHelper.TITLE_FONT_SIZE,
    };
  }

  drawText(text: string, startingYPosition: number, fontSize: number) {
    this.canvas.canvasContext.font = FontHelper.getFontFamily(fontSize);

    const measuredText: TextMetrics =
      this.canvas.canvasContext.measureText(text);
    const xPosition = this.canvas.width / 2 - measuredText.width / 2;

    this.canvas.canvasContext.fillText(text, xPosition, startingYPosition);
  }
}
