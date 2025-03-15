class Blaster {
  private readonly MAX_COOLDOWN_PERIOD_MILLISECONDS = 500;
  private readonly MIN_COOLDOWN_PERIOD_MILLISECONDS = 100;
  private readonly CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS = 25;

  private readonly ownerWidth: number;

  private verticalPosition: number = 0;
  private horizontalPosition: number = 0;
  private timeLastShotFired = 0;
  private cooldownPeriod = this.MAX_COOLDOWN_PERIOD_MILLISECONDS;
  private isShootingDown = false;
  private currentProjectile: ProjectileTypes;

  constructor(
    ownerWidth: number,
    ownerHorizontalPosition: number,
    ownerVerticalPosition: number
  ) {
    this.ownerWidth = ownerWidth;
    this.updateBlasterHorizontalPosition(ownerHorizontalPosition);
    this.updateBlasterVerticalPosition(ownerVerticalPosition);
    this.currentProjectile = ProjectileTypes.BLASTER;
  }

  shoot(): BlasterBullet[] | null {
    const currentTime = Date.now();
    if (!this.shouldFire(currentTime)) return null;

    this.timeLastShotFired = currentTime;

    const bullets = ProjectileFactory.getInstance().getProjectiles(
      this.currentProjectile,
      this.verticalPosition,
      this.horizontalPosition
    );

    if (this.isShootingDown) {
      bullets.forEach((bullet) => bullet.startMovingDown());
    } else {
      bullets.forEach((bullet) => bullet.startMovingUp());
    }

    return bullets;
  }

  increaseRateOfFire() {
    const newCoolDown =
      this.cooldownPeriod - this.CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS;

    this.cooldownPeriod =
      newCoolDown < this.MIN_COOLDOWN_PERIOD_MILLISECONDS
        ? this.MIN_COOLDOWN_PERIOD_MILLISECONDS
        : newCoolDown;
  }

  decreaseRateOfFire() {
    const newCoolDown =
      this.cooldownPeriod + this.CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS;

    this.cooldownPeriod =
      newCoolDown > this.MAX_COOLDOWN_PERIOD_MILLISECONDS
        ? this.MAX_COOLDOWN_PERIOD_MILLISECONDS
        : newCoolDown;
  }

  updateBlasterHorizontalPosition(ownerHorizontalPosition: number) {
    this.horizontalPosition =
      ownerHorizontalPosition + Math.floor(this.ownerWidth / 2);
  }

  updateBlasterVerticalPosition(ownerVerticalPosition: number) {
    this.verticalPosition = ownerVerticalPosition;
  }

  shootDownwards() {
    this.isShootingDown = true;
  }

  updateProjectTileType(newProjectileType: ProjectileTypes) {
    this.currentProjectile = newProjectileType;

    if (newProjectileType == ProjectileTypes.THREE_BLASTER_PULSE) {
      this.setFastestRateOfFire();
    } else {
      this.cooldownPeriod = this.MAX_COOLDOWN_PERIOD_MILLISECONDS;
    }
  }

  private shouldFire(currentTime: number): boolean {
    return currentTime - this.timeLastShotFired >= this.cooldownPeriod;
  }

  private setFastestRateOfFire() {
    this.cooldownPeriod = this.MIN_COOLDOWN_PERIOD_MILLISECONDS;
  }
}
