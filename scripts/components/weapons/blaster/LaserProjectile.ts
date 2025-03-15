class LaserProjectile extends BlasterBullet {
  private readonly LASER_WIDTH = 2;
  private readonly LASER_HEIGHT = 20;
  private readonly LASER_SPEED = 5;
  private readonly LASER_DAMAGE = 10;

  constructor(verticalPosition: number, horizontalPosition: number) {
    super(verticalPosition, horizontalPosition);

    this.color = "yellow";
    this.HEIGHT = this.LASER_HEIGHT;
    this.WIDTH = this.LASER_WIDTH;
    this.damage = this.LASER_DAMAGE;
    this.bulletSpeed = this.LASER_SPEED;
  }
}
