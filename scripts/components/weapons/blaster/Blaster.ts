class Blaster {
  private readonly BULLET_SPEED = 2;
  private readonly MAX_COOLDOWN_PERIOD_MILLISECONDS = 500;
  private readonly MIN_COOLDOWN_PERIOD_MILLISECONDS = 100;
  private readonly CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS = 25;

  private readonly ownerWidth: number;

  private verticalPosition: number = 0;
  private horizontalPosition: number = 0;
  private timeLastShotFired = 0;
  private cooldownPeriod = this.MAX_COOLDOWN_PERIOD_MILLISECONDS;
  private isShootingDown = false;

  constructor(ownerWidth: number) {
    this.ownerWidth = ownerWidth;
  }

  shoot(): BlasterBullet | null {
    const currentTime = Date.now();
    if (!this.shouldFire(currentTime)) return null;

    this.timeLastShotFired = currentTime;

    const bullet = new BlasterBullet(
      this.verticalPosition,
      this.horizontalPosition,
      this.BULLET_SPEED
    );

    if (this.isShootingDown) {
      bullet.startMovingDown();
    } else {
      bullet.startMovingUp();
    }

    return bullet;
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

  private shouldFire(currentTime: number): boolean {
    return currentTime - this.timeLastShotFired >= this.cooldownPeriod;
  }
}
