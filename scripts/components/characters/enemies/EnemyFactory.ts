class EnemyFactory {
  private static instance: EnemyFactory | null;

  private readonly weakEnemyStats: EnemyConfig = {
    maxHealth: 5,
    pointsForDefeating: 1,
    spriteLocation: "./dist/images/weak_alien.png",
    spriteWidth: 30,
    spriteHeight: 30,
  };

  private readonly mediumEnemyStats: EnemyConfig = {
    maxHealth: 15,
    pointsForDefeating: 3,
    spriteLocation: "./dist/images/medium_alien.png",
    spriteWidth: 30,
    spriteHeight: 30,
  };

  private readonly strongEnemyStats: EnemyConfig = {
    maxHealth: 30,
    pointsForDefeating: 6,
    spriteLocation: "./dist/images/strong_alien.png",
    spriteWidth: 30,
    spriteHeight: 30,
  };

  private constructor() {}

  static getInstance(): EnemyFactory {
    if (!this.instance) this.instance = new EnemyFactory();
    return this.instance;
  }

  buildNewEnemy(enemyType: EnemyType): Enemy {
    const enemyConfig = this.getConfigForEnemyType(enemyType);
    return new Enemy(enemyConfig);
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
