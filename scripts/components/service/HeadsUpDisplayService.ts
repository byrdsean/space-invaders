class HeadsUpDisplayService {
  private readonly BUFFER_SIZE_PIXELS = 10;
  private readonly canvas: Canvas;
  private readonly drawScoreService: DrawScoreService;
  private readonly drawPlayerHealth: DrawPlayerHealth;

  constructor() {
    this.canvas = CanvasInstance.getInstance();
    this.drawScoreService = new DrawScoreService(this.BUFFER_SIZE_PIXELS);
    this.drawPlayerHealth = new DrawPlayerHealth();
  }

  draw(score: number, playerHealthPercentage: number) {
    this.canvas.canvasContext.save();

    const scoreBoundingContext = this.drawScoreService.drawScore(score);

    this.drawPlayerHealth.drawPlayerHealth(
      scoreBoundingContext.x,
      scoreBoundingContext.y + scoreBoundingContext.height,
      playerHealthPercentage
    );

    this.canvas.canvasContext.restore();
  }
}
