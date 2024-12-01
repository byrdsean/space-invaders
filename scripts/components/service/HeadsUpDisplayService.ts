class HeadsUpDisplayService {
  private readonly BUFFER_SIZE_PIXELS = 10;
  private readonly canvas: Canvas;
  private readonly drawMetricsService: DrawMetricsService;
  private readonly drawPlayerHealth: DrawPlayerHealth;

  constructor() {
    this.canvas = CanvasInstance.getInstance();
    this.drawMetricsService = new DrawMetricsService(this.BUFFER_SIZE_PIXELS);
    this.drawPlayerHealth = new DrawPlayerHealth();
  }

  draw(score: number, level: number, playerHealthPercentage: number) {
    this.canvas.canvasContext.save();

    const scoreBoundingContext = this.drawMetricsService.drawMetrics(
      score,
      level
    );

    this.drawPlayerHealth.drawPlayerHealth(
      scoreBoundingContext.x,
      scoreBoundingContext.y,
      playerHealthPercentage
    );

    this.canvas.canvasContext.restore();
  }
}
