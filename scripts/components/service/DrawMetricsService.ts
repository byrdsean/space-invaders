class DrawMetricsService {
  private readonly FONT_COLOR = "white";

  private readonly canvas: Canvas;
  private readonly fontFamily: string;
  private readonly bufferSize: number;

  constructor(bufferSize: number) {
    this.canvas = CanvasInstance.getInstance();
    this.fontFamily = FontHelper.getFontFamily(FontHelper.FONT_SIZE);
    this.bufferSize = bufferSize;
  }

  drawMetrics(score: number, level: number): BoundingContext {
    const scoreBoundingContext = this.writeText(
      `Score: ${score}`,
      this.bufferSize,
      FontHelper.FONT_SIZE + this.bufferSize
    );

    return this.writeText(
      `Level: ${level}`,
      scoreBoundingContext.x,
      FontHelper.FONT_SIZE + scoreBoundingContext.y
    );
  }

  private writeText(
    text: string,
    horizontalOffset: number,
    verticalOffset: number
  ): BoundingContext {
    this.drawTextToCanvas(text, horizontalOffset, verticalOffset);

    const measuredText = this.canvas.canvasContext.measureText(text);
    return {
      x: horizontalOffset,
      y: verticalOffset + this.bufferSize,
      width: measuredText.width,
      height: FontHelper.FONT_SIZE,
    };
  }

  private drawTextToCanvas(
    scoreText: string,
    horizontalOffset: number,
    verticalOffset: number
  ) {
    this.canvas.canvasContext.fillStyle = this.FONT_COLOR;
    this.canvas.canvasContext.font = this.fontFamily;
    this.canvas.canvasContext.fillText(
      scoreText,
      horizontalOffset,
      verticalOffset
    );
  }
}
