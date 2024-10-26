class DrawScoreService {
  private readonly FONT_SIZE_PIXELS = 12;
  private readonly BUFFER_SIZE_PIXELS = 10;
  private readonly FONT_COLOR = "white";
  private readonly canvas: Canvas;
  private readonly fontFamily;

  constructor() {
    this.canvas = CanvasInstance.getInstance();
    this.fontFamily = `${this.FONT_SIZE_PIXELS}px \"Press Start 2P\", Arial`;
  }

  drawScore(score: number): BoundingContext {
    const scoreText = `Score: ${score}`;
    this.drawTextToCanvas(scoreText);

    const measuredText = this.canvas.canvasContext.measureText(scoreText);
    return {
      x: this.BUFFER_SIZE_PIXELS,
      y: this.FONT_SIZE_PIXELS + this.BUFFER_SIZE_PIXELS,
      width: measuredText.width,
      height: this.FONT_SIZE_PIXELS,
    };
  }

  private drawTextToCanvas(scoreText: string) {
    this.canvas.canvasContext.fillStyle = this.FONT_COLOR;
    this.canvas.canvasContext.font = this.fontFamily;
    this.canvas.canvasContext.fillText(
      scoreText,
      this.BUFFER_SIZE_PIXELS,
      this.FONT_SIZE_PIXELS + this.BUFFER_SIZE_PIXELS
    );
  }
}
