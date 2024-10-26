class Blaster {
  private readonly BULLET_SPEED = 2;
  private readonly MAX_COOLDOWN_PERIOD_MILLISECONDS = 500;
  private readonly MIN_COOLDOWN_PERIOD_MILLISECONDS = 100;
  private readonly CHANGE_COOLDOWN_PERIOD_STEP_MILLISECONDS = 25;

  private readonly ownerWidth: number;
  private verticalPosition: number;
  private horizontalPosition: number;

  private timeLastShotFired: number = 0;
  private cooldownPeriod = this.MAX_COOLDOWN_PERIOD_MILLISECONDS;
  private isShootingDown = false;

  constructor(
    initialVerticalPosition: number,
    ownerHorizontalPosition: number,
    ownerWidth: number
  ) {
    this.ownerWidth = ownerWidth;
    this.verticalPosition = initialVerticalPosition;

    this.horizontalPosition = 0;
    this.updateBlasterHorizontalPosition(ownerHorizontalPosition);
  }

  shoot(): BlasterBullet | null {
    const currentTime = Date.now();
    const shouldFire =
      currentTime - this.timeLastShotFired >= this.cooldownPeriod;

    if (!shouldFire) return null;

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
    const blasterHorizontalOffset = Math.floor(BlasterBullet.WIDTH / 2);

    this.horizontalPosition =
      ownerHorizontalPosition +
      Math.floor(this.ownerWidth / 2) -
      blasterHorizontalOffset;
  }

  updateBlasterVerticalPosition(ownerVerticalPosition: number) {
    this.verticalPosition = ownerVerticalPosition;
  }

  shootDownwards() {
    this.isShootingDown = true;
  }
}
