class Blaster {
  private readonly BULLET_SPEED = 5;
  private readonly MAX_COOLDOWN_PERIOD_MILLISECONDS = 500;
  private readonly MIN_COOLDOWN_PERIOD_MILLISECONDS = 100;
  private readonly CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS = 25;

  private readonly verticalPosition: number;

  private timeLastShotFired: number = 0;
  private cooldownPeriod = this.MAX_COOLDOWN_PERIOD_MILLISECONDS;

  constructor(initialVerticalPosition: number) {
    this.verticalPosition = initialVerticalPosition;
  }

  shoot(initialHorizontalPosition: number): BlasterBullet | null {
    const currentTime = Date.now();
    const shouldFire =
      currentTime - this.timeLastShotFired >= this.cooldownPeriod;

    if (!shouldFire) return null;

    this.timeLastShotFired = currentTime;

    return new BlasterBullet(
      this.verticalPosition,
      initialHorizontalPosition,
      this.BULLET_SPEED
    );
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

  getBlasterHorizontalOffset(): number {
    return Math.floor(BlasterBullet.WIDTH / 2);
  }
}
