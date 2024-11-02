// @ts-ignore
class Player extends MoveableEntity {
  public static HEIGHT = 25;
  public static WIDTH = 25;
  private static COLOR = "green";
  private static MAX_HEALTH = 100;

  private readonly healthManagerService: HealthManagerService;

  private isShooting: boolean = false;
  private blaster: Blaster;

  constructor(
    initialVerticalPosition: number,
    initialHorizontalPosition: number
  ) {
    super(
      initialVerticalPosition,
      initialHorizontalPosition,
      Player.HEIGHT,
      Player.WIDTH
    );
    this.blaster = new Blaster(
      this.verticalPosition,
      this.horizontalPosition,
      Player.WIDTH
    );
    this.healthManagerService = new HealthManagerService(Player.MAX_HEALTH);
  }

  reset() {
    this.isShooting = false;
    this.verticalPosition = Player.getInitialVerticalPosition(
      this.canvas.height
    );
    this.horizontalPosition = Player.getInitialHorizontalPosition(
      this.canvas.height
    );
    this.blaster = new Blaster(
      this.verticalPosition,
      this.horizontalPosition,
      Player.WIDTH
    );
  }

  override draw() {
    this.updatePosition();

    const previousFillStyle = this.canvas.canvasContext.fillStyle;

    this.canvas.canvasContext.fillStyle = Player.COLOR;
    this.canvas.canvasContext.fillRect(
      this.horizontalPosition,
      this.verticalPosition,
      Player.WIDTH,
      Player.HEIGHT
    );

    this.canvas.canvasContext.fillStyle = previousFillStyle;
  }

  getNextShot(): BlasterBullet | null {
    return this.isShooting ? this.blaster.shoot() : null;
  }

  getHealth(): number {
    return this.healthManagerService.getHealth();
  }

  decrementHealth(removeValue: number) {
    this.healthManagerService.decrementHealth(removeValue);
  }

  startShooting() {
    this.isShooting = true;
  }

  stopShooting() {
    this.isShooting = false;
  }

  increaseRateOfFire() {
    this.blaster.increaseRateOfFire();
  }

  decreaseRateOfFire() {
    this.blaster.decreaseRateOfFire();
  }

  static getInitialVerticalPosition(maxHeight: number): number {
    return maxHeight - this.HEIGHT;
  }

  static getInitialHorizontalPosition(maxWidth: number): number {
    return Math.floor(maxWidth / 2 - this.WIDTH / 2);
  }

  private updatePosition() {
    if (this.isMovingLeft) {
      this.moveLeft(1);
    } else if (this.isMovingRight) {
      this.moveRight(1);
    }

    if (this.isMovingLeft || this.isMovingRight) {
      this.blaster.updateBlasterHorizontalPosition(this.horizontalPosition);
    }
  }
}
