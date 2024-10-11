class EnemyGroup {
  private readonly ENEMY_SPACING = 5;
  private readonly BUFFER_FROM_CANVAS_BOUNDS = 10;
  private readonly canvas: Canvas;

  private enemies: Enemy[] = [];
  private currentLevel = 1;

  constructor() {
    this.canvas = CanvasInstance.getInstance();
    this.addEnemies();
  }

  getEnemies(): Enemy[] {
    return [...this.enemies];
  }

  private addEnemies() {
    const levelData = EnemyConstants.levels.find(
      (levelData) => levelData.level == this.currentLevel
    );

    if (!levelData) return;

    levelData.enemies.forEach((row, rowIndex) => {
      const verticalPosition = rowIndex * (Enemy.HEIGHT + this.ENEMY_SPACING);
      const horizontalOffset = this.calculateRowOffset(row.length);

      row.forEach((col, colIndex) => {
        const horizontalPosition =
          colIndex * (Enemy.WIDTH + this.ENEMY_SPACING);

        const enemy = new Enemy(
          verticalPosition,
          horizontalPosition + horizontalOffset,
          this.BUFFER_FROM_CANVAS_BOUNDS,
          this.canvas.width - this.BUFFER_FROM_CANVAS_BOUNDS
        );
        enemy.startMovingLeft();

        this.enemies.push(enemy);
      });
    });
  }

  private calculateRowOffset(rowLength: number) {
    const maxWidthOfRow =
      rowLength * Enemy.WIDTH + (rowLength - 1) * this.ENEMY_SPACING;
    return Math.floor(this.canvas.width / 2) - Math.floor(maxWidthOfRow / 2);
  }
}
