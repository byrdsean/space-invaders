class GameOverSplashScreen {
  private readonly FONT_COLOR = "white";
  private readonly GAME_OVER_MESSAGE = "Game over";
  private readonly canvas: Canvas;

  constructor() {
    this.canvas = CanvasInstance.getInstance();
    this.canvas.canvasContext.fillStyle = this.FONT_COLOR;
  }

  drawSplashScreen() {
    this.drawTitle();
  }

  private drawTitle() {
    this.canvas.canvasContext.font = FontHelper.getFontFamily(
      FontHelper.TITLE_FONT_SIZE
    );

    const measuredText: TextMetrics = this.canvas.canvasContext.measureText(
      this.GAME_OVER_MESSAGE
    );
    const xPosition = this.canvas.width / 2 - measuredText.width / 2;
    const yPosition = this.canvas.height / 2 - FontHelper.TITLE_FONT_SIZE / 2;

    this.canvas.canvasContext.fillText(
      this.GAME_OVER_MESSAGE,
      xPosition,
      yPosition
    );
  }
}
