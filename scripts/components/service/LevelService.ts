class LevelService {
  private readonly COUNTDOWN_MAX = 3;
  private readonly COUNTDOWN_TIME_MILLISECONDS = 1000;
  private readonly BUFFER_SIZE_PIXELS = 20;
  private readonly FONT_COLOR = "white";
  private readonly NEXT_LEVEL_TITLE = "Next Level";
  private readonly STARTING_IN_TITLE = "Starting in";
  private readonly canvas: Canvas;

  private currentLevel = 0;
  private levels: number[] = [];

  private currentCountDown = this.COUNTDOWN_MAX;
  private startCountDownTime: number | undefined;

  constructor() {
    this.canvas = CanvasInstance.getInstance();
    this.canvas.canvasContext.fillStyle = this.FONT_COLOR;

    EnemyLevels.levels
      .map((level) => level.level)
      .sort()
      .forEach((level) => this.levels.push(level));
  }

  getCurrentLevel(): number {
    return this.currentLevel;
  }

  hasRemainingLevels(): boolean {
    return this.levels.length > 0;
  }

  isShowingNextLevelScreen(): boolean {
    return this.startCountDownTime !== undefined;
  }

  startNextLevel(): EnemyType[][] | undefined {
    if (!this.hasRemainingLevels()) return;

    this.currentLevel = this.levels.shift()!;
    this.startCountDownTime = Date.now();

    const enemiesForCurrentLevel = EnemyLevels.levels.find(
      (level) => level.level === this.currentLevel
    );
    return enemiesForCurrentLevel?.enemies;
  }

  drawNextLevelScreen() {
    if (!this.shouldRenderLevelScreen()) return;

    const nextLevelBoundingContext = this.drawNextLevelMessage();

    const countdownText = `${this.STARTING_IN_TITLE}: ${this.currentCountDown}`;
    this.drawText(
      countdownText,
      nextLevelBoundingContext.y +
        nextLevelBoundingContext.height +
        this.BUFFER_SIZE_PIXELS,
      FontHelper.FONT_SIZE
    );
  }

  private shouldRenderLevelScreen(): boolean {
    const currentTime = Date.now();
    const shouldDecrementCountDown =
      this.startCountDownTime &&
      currentTime - this.startCountDownTime >= this.COUNTDOWN_TIME_MILLISECONDS;

    if (shouldDecrementCountDown) {
      this.currentCountDown--;
      this.startCountDownTime = currentTime;
    }

    if (this.currentCountDown <= 0) {
      this.currentCountDown = this.COUNTDOWN_MAX;
      this.startCountDownTime = undefined;
      return false;
    }

    return true;
  }

  private drawNextLevelMessage(): BoundingContext {
    this.canvas.canvasContext.font = FontHelper.getFontFamily(
      FontHelper.TITLE_FONT_SIZE
    );

    const text = `${this.NEXT_LEVEL_TITLE}: ${this.currentLevel}`;
    const measuredText: TextMetrics =
      this.canvas.canvasContext.measureText(text);
    const xPosition = this.canvas.width / 2 - measuredText.width / 2;
    const yPosition = this.canvas.height / 2 - FontHelper.TITLE_FONT_SIZE / 2;

    this.canvas.canvasContext.fillText(text, xPosition, yPosition);

    return {
      x: xPosition,
      y: yPosition,
      width: measuredText.width,
      height: FontHelper.TITLE_FONT_SIZE,
    };
  }

  private drawText(text: string, startingYPosition: number, fontSize: number) {
    this.canvas.canvasContext.font = FontHelper.getFontFamily(fontSize);

    const measuredText: TextMetrics =
      this.canvas.canvasContext.measureText(text);
    const xPosition = this.canvas.width / 2 - measuredText.width / 2;

    this.canvas.canvasContext.fillText(text, xPosition, startingYPosition);
  }
}
