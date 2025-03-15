class PulseBullet extends BlasterBullet {
  private readonly PULSE_SPEED = 7.5;
  private readonly PULSE_DAMAGE = 2;

  constructor(verticalPosition: number, horizontalPosition: number) {
    super(verticalPosition, horizontalPosition);

    this.color = "white";
    this.bulletSpeed = this.PULSE_SPEED;
    this.damage = this.PULSE_DAMAGE;
  }
}
