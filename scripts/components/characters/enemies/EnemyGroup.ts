class EnemyGroup {
  private readonly ENEMY_SPACING = 5;
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

    const maxEnemiesInARow = levelData.enemies
      .map((enemyList) => enemyList.length)
      .reduce((acc, length) => Math.max(acc, length), 0);

    levelData.enemies.forEach((row, rowIndex) => {
      const verticalPosition = rowIndex * (Enemy.HEIGHT + this.ENEMY_SPACING);
      const horizontalOffset = this.calculateRowOffset(row.length);

      row.forEach((_, colIndex) => {
        const horizontalPosition =
          colIndex * (Enemy.WIDTH + this.ENEMY_SPACING);

        const minLeftPositionToMove = this.calculateMinLeftPositionToMove(
          maxEnemiesInARow,
          row.length,
          colIndex
        );
        const maxRightPositionToMove = this.calculateMaxRightPositionToMove(
          maxEnemiesInARow,
          row.length,
          colIndex
        );

        const enemy = new Enemy(
          verticalPosition,
          horizontalPosition + horizontalOffset,
          minLeftPositionToMove,
          maxRightPositionToMove
        );
        enemy.startMovingLeft();

        this.enemies.push(enemy);
      });
    });
  }

  private calculateMaxRightPositionToMove(
    maxEnemiesInARow: number,
    rowLength: number,
    enemyIndex: number
  ): number {
    const spacesToRight =
      (maxEnemiesInARow - rowLength) / 2 + (rowLength - enemyIndex - 1);
    const maxRightPositionToMove =
      spacesToRight * Enemy.WIDTH +
      spacesToRight * this.ENEMY_SPACING +
      this.ENEMY_SPACING;
    return this.canvas.width - maxRightPositionToMove;
  }

  private calculateMinLeftPositionToMove(
    maxEnemiesInARow: number,
    rowLength: number,
    enemyIndex: number
  ): number {
    const spacesToLeft = (maxEnemiesInARow - rowLength) / 2 + enemyIndex;
    return (
      spacesToLeft * Enemy.WIDTH +
      spacesToLeft * this.ENEMY_SPACING +
      this.ENEMY_SPACING
    );
  }

  private calculateRowOffset(rowLength: number) {
    const maxWidthOfRow =
      rowLength * Enemy.WIDTH + (rowLength - 1) * this.ENEMY_SPACING;
    return Math.floor(this.canvas.width / 2) - Math.floor(maxWidthOfRow / 2);
  }
}
