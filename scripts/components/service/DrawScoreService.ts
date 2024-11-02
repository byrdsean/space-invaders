class DrawScoreService {
  private readonly FONT_COLOR = "white";

  private readonly canvas: Canvas;
  private readonly fontFamily: string;
  private readonly bufferSize: number;

  constructor(bufferSize: number) {
    this.canvas = CanvasInstance.getInstance();
    this.fontFamily = FontHelper.getFontFamily(FontHelper.FONT_SIZE);
    this.bufferSize = bufferSize;
  }

  drawScore(score: number): BoundingContext {
    const scoreText = `Score: ${score}`;
    this.drawTextToCanvas(scoreText);

    const measuredText = this.canvas.canvasContext.measureText(scoreText);
    return {
      x: this.bufferSize,
      y: FontHelper.FONT_SIZE + this.bufferSize,
      width: measuredText.width,
      height: FontHelper.FONT_SIZE,
    };
  }

  private drawTextToCanvas(scoreText: string) {
    this.canvas.canvasContext.fillStyle = this.FONT_COLOR;
    this.canvas.canvasContext.font = this.fontFamily;
    this.canvas.canvasContext.fillText(
      scoreText,
      this.bufferSize,
      FontHelper.FONT_SIZE + this.bufferSize
    );
  }
}
