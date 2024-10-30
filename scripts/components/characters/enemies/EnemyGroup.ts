class EnemyGroup {
  private readonly ENEMY_SPACING = 5;
  private readonly MAX_COOLDOWN_PERIOD_MILLISECONDS = 2500;
  private readonly MIN_COOLDOWN_PERIOD_MILLISECONDS = 500;
  private readonly CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS = 200;
  private readonly canvas: Canvas;

  private enemies: Enemy[] = [];
  private currentLevel = 1;
  private timeLastShotFired = 0;

  private cooldownPeriod = this.MAX_COOLDOWN_PERIOD_MILLISECONDS;

  constructor() {
    this.canvas = CanvasInstance.getInstance();
    this.addEnemies();
  }

  getEnemies(): Enemy[] {
    return [...this.enemies];
  }

  removeEnemy(index: number): Enemy | null {
    if (index < 0 || this.enemies.length <= index) return null;

    const newCoolDownPeriod =
      this.cooldownPeriod - this.CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS;

    this.cooldownPeriod =
      newCoolDownPeriod < this.MIN_COOLDOWN_PERIOD_MILLISECONDS
        ? this.MIN_COOLDOWN_PERIOD_MILLISECONDS
        : newCoolDownPeriod;

    return this.enemies.splice(index, 1)[0];
  }

  triggerEnemyToShoot(): BlasterBullet | null {
    if (this.enemies.length === 0) return null;

    const currentTime = Date.now();
    const shouldFire =
      currentTime - this.timeLastShotFired >= this.cooldownPeriod;

    if (!shouldFire) return null;

    this.timeLastShotFired = currentTime;

    const enemyIndex = MathHelper.getRandomInt(0, this.enemies.length);
    return this.enemies[enemyIndex].getNextShot();
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
