class ProjectileFactory {
  private static instance: ProjectileFactory | null;
  private readonly THREE_BLASTER_PULSE_GAP = 10;

  private constructor() {}

  static getInstance(): ProjectileFactory {
    if (this.instance) return this.instance;
    this.instance = new ProjectileFactory();
    return this.instance;
  }

  getProjectiles(
    projectileType: ProjectileTypes,
    verticalPosition: number,
    horizontalPosition: number
  ): BlasterBullet[] {
    switch (projectileType) {
      case ProjectileTypes.LASER:
        return [new LaserProjectile(verticalPosition, horizontalPosition)];
      case ProjectileTypes.THREE_BLASTER_PULSE:
        return this.buildThreeBlasterPulseBullets(
          verticalPosition,
          horizontalPosition
        );
      default:
        return [new BlasterBullet(verticalPosition, horizontalPosition)];
    }
  }

  private buildThreeBlasterPulseBullets(
    verticalPosition: number,
    horizontalPosition: number
  ): BlasterBullet[] {
    const leftBullet = new PulseBullet(
      verticalPosition,
      horizontalPosition - this.THREE_BLASTER_PULSE_GAP
    );

    const middleBullet = new PulseBullet(verticalPosition, horizontalPosition);

    const rightBullet = new PulseBullet(
      verticalPosition,
      horizontalPosition + this.THREE_BLASTER_PULSE_GAP
    );

    return [leftBullet, middleBullet, rightBullet];
  }
}
