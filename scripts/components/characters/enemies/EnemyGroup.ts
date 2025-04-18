interface MaxPositionsToMove {
  minLeftPositionToMove: number;
  maxRightPositionToMove: number;
}

class EnemyGroup {
  private readonly ENEMY_SPACING = 5;
  private readonly MAX_COOLDOWN_PERIOD_MILLISECONDS = 2500;
  private readonly MIN_COOLDOWN_PERIOD_MILLISECONDS = 500;
  private readonly CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS = 200;
  private readonly canvas: Canvas;

  private enemies: Enemy[] = [];
  private timeLastShotFired = 0;

  private cooldownPeriod = this.MAX_COOLDOWN_PERIOD_MILLISECONDS;

  constructor() {
    this.canvas = CanvasInstance.getInstance();
  }

  hasEnemies(): boolean {
    return this.enemies.length > 0;
  }

  getEnemies(): Enemy[] {
    return [...this.enemies];
  }

  removeEnemy(index: number): Enemy | null {
    if (index < 0 || this.enemies.length <= index) return null;

    const newCoolDownPeriod =
      this.cooldownPeriod - this.CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS;

    this.cooldownPeriod = Math.max(
      newCoolDownPeriod,
      this.MIN_COOLDOWN_PERIOD_MILLISECONDS
    );

    return this.enemies.splice(index, 1)[0];
  }

  addEnemies(enemies: EnemyType[][]) {
    if (!enemies || enemies.length === 0) return;

    const maxEnemiesInARow = enemies
      .map((enemyList) => enemyList.length)
      .reduce((acc, length) => Math.max(acc, length), 0);

    enemies.forEach((row, rowIndex) => {
      row.forEach((enemyType, colIndex) => {
        const enemy = EnemyFactory.getInstance().buildNewEnemy(enemyType);

        const { minLeftPositionToMove, maxRightPositionToMove } =
          this.getMaxPositionsToMove(
            maxEnemiesInARow,
            enemy.getWidth(),
            row.length,
            colIndex
          );
        enemy.setMaxHorizontalBounds(
          minLeftPositionToMove,
          maxRightPositionToMove
        );

        const verticalPosition =
          rowIndex * (enemy.getHeight() + this.ENEMY_SPACING);
        const horizontalOffset = this.calculateRowOffset(
          enemy.getWidth(),
          row.length
        );
        const horizontalPosition =
          colIndex * (enemy.getWidth() + this.ENEMY_SPACING);
        enemy.setStartingPosition(
          verticalPosition,
          horizontalPosition + horizontalOffset
        );

        enemy.startMovingLeft();

        this.enemies.push(enemy);
      });
    });
  }

  getNextShot(): BlasterBullet[] | null {
    if (this.enemies.length === 0) return null;

    const currentTime = Date.now();
    const shouldFire =
      currentTime - this.timeLastShotFired >= this.cooldownPeriod;

    if (!shouldFire) return null;

    this.timeLastShotFired = currentTime;

    const enemyIndex = MathHelper.getRandomInt(0, this.enemies.length);
    return this.enemies[enemyIndex].getNextShot();
  }

  private getMaxPositionsToMove(
    maxEnemiesInARow: number,
    enemyWidth: number,
    rowLength: number,
    enemyIndex: number
  ): MaxPositionsToMove {
    const minLeftPositionToMove = this.calculateMinLeftPositionToMove(
      maxEnemiesInARow,
      enemyWidth,
      rowLength,
      enemyIndex
    );
    const maxRightPositionToMove = this.calculateMaxRightPositionToMove(
      maxEnemiesInARow,
      enemyWidth,
      rowLength,
      enemyIndex
    );
    return { minLeftPositionToMove, maxRightPositionToMove };
  }

  private calculateMaxRightPositionToMove(
    maxEnemiesInARow: number,
    enemyWidth: number,
    rowLength: number,
    enemyIndex: number
  ): number {
    const spacesToRight =
      (maxEnemiesInARow - rowLength) / 2 + (rowLength - enemyIndex - 1);
    const maxRightPositionToMove =
      spacesToRight * enemyWidth +
      spacesToRight * this.ENEMY_SPACING +
      this.ENEMY_SPACING;
    return this.canvas.width - maxRightPositionToMove;
  }

  private calculateMinLeftPositionToMove(
    maxEnemiesInARow: number,
    enemyWidth: number,
    rowLength: number,
    enemyIndex: number
  ): number {
    const spacesToLeft = (maxEnemiesInARow - rowLength) / 2 + enemyIndex;
    return (
      spacesToLeft * enemyWidth +
      spacesToLeft * this.ENEMY_SPACING +
      this.ENEMY_SPACING
    );
  }

  private calculateRowOffset(enemyWidth: number, rowLength: number) {
    const maxWidthOfRow =
      rowLength * enemyWidth + (rowLength - 1) * this.ENEMY_SPACING;
    return Math.floor(this.canvas.width / 2) - Math.floor(maxWidthOfRow / 2);
  }
}
