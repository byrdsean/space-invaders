class HeadsUpDisplayService {
  private readonly canvas: Canvas;
  private readonly drawScoreService: DrawScoreService;
  private readonly drawPlayerHealth: DrawPlayerHealth;

  constructor() {
    this.canvas = CanvasInstance.getInstance();
    this.drawScoreService = new DrawScoreService();
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
