class EnemyFactory {
  private static instance: EnemyFactory | null;

  private readonly weakEnemyStats: EnemyConfig = {
    maxHealth: 5,
    pointsForDefeating: 1,
  };

  private readonly mediumEnemyStats: EnemyConfig = {
    maxHealth: 15,
    pointsForDefeating: 3,
  };

  private readonly strongEnemyStats: EnemyConfig = {
    maxHealth: 30,
    pointsForDefeating: 6,
  };

  private constructor() {}

  static getInstance(): EnemyFactory {
    if (!this.instance) this.instance = new EnemyFactory();
    return this.instance;
  }

  buildNewEnemy(
    enemyType: EnemyType,
    startingVerticalPosition: number,
    startingHorizontalPosition: number,
    minLeftPositionToMove: number,
    maxRightPositionToMove: number
  ): Enemy {
    const enemyConfig = this.getConfigForEnemyType(enemyType);
    return new Enemy(
      startingVerticalPosition,
      startingHorizontalPosition,
      minLeftPositionToMove,
      maxRightPositionToMove,
      enemyConfig
    );
  }

  private getConfigForEnemyType(enemyType: EnemyType): EnemyConfig {
    switch (enemyType) {
      case EnemyType.MEDIUM:
        return this.mediumEnemyStats;
      case EnemyType.STRONG:
        return this.strongEnemyStats;
      case EnemyType.WEAK:
      default:
        return this.weakEnemyStats;
    }
  }
}
