class HealthManagerService {
  private readonly MAX_HEALTH: number;
  private health: number = 0;

  constructor(maxHealth: number) {
    this.MAX_HEALTH = maxHealth;
    this.health = maxHealth;
  }

  getHealth(): number {
    return this.health;
  }

  decrementHealth(removeValue: number) {
    if (removeValue < 0) return;
    const updatedHealth = this.health - removeValue;
    this.health = updatedHealth < 0 ? 0 : updatedHealth;
  }
}
