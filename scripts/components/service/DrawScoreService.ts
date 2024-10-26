class DrawScoreService {
  private readonly FONT_SIZE_PIXELS = 12;
  private readonly FONT_COLOR = "white";

  private readonly canvas: Canvas;
  private readonly fontFamily: string;
  private readonly bufferSize: number;

  constructor(bufferSize: number) {
    this.canvas = CanvasInstance.getInstance();
    this.fontFamily = `${this.FONT_SIZE_PIXELS}px \"Press Start 2P\", Arial`;
    this.bufferSize = bufferSize;
  }

  drawScore(score: number): BoundingContext {
    const scoreText = `Score: ${score}`;
    this.drawTextToCanvas(scoreText);

    const measuredText = this.canvas.canvasContext.measureText(scoreText);
    return {
      x: this.bufferSize,
      y: this.FONT_SIZE_PIXELS + this.bufferSize,
      width: measuredText.width,
      height: this.FONT_SIZE_PIXELS,
    };
  }

  private drawTextToCanvas(scoreText: string) {
    this.canvas.canvasContext.fillStyle = this.FONT_COLOR;
    this.canvas.canvasContext.font = this.fontFamily;
    this.canvas.canvasContext.fillText(
      scoreText,
      this.bufferSize,
      this.FONT_SIZE_PIXELS + this.bufferSize
    );
  }
}
