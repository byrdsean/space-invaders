// @ts-ignore
class Player extends MoveableEntity {
  public static HEIGHT = 25;
  public static WIDTH = 25;
  private static COLOR = "green";
  private static MAX_HEALTH = 100;

  private readonly SPACES_TO_MOVE = 2;
  private readonly MAX_VERTICAL_SPACES_TO_MOVE = 75;
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
    this.updateHorizontalPosition();
    this.updateVerticalPosition();

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

  // TODO: will re-enable this as power-ups
  // increaseRateOfFire() {
  //   this.blaster.increaseRateOfFire();
  // }

  // TODO: will re-enable this as power-ups
  // decreaseRateOfFire() {
  //   this.blaster.decreaseRateOfFire();
  // }

  static getInitialVerticalPosition(maxHeight: number): number {
    return maxHeight - this.HEIGHT;
  }

  static getInitialHorizontalPosition(maxWidth: number): number {
    return Math.floor(maxWidth / 2 - this.WIDTH / 2);
  }

  private updateHorizontalPosition() {
    if (this.isMovingLeft) {
      this.moveLeft(this.SPACES_TO_MOVE);
    } else if (this.isMovingRight) {
      this.moveRight(this.SPACES_TO_MOVE);
    }

    if (this.isMovingLeft || this.isMovingRight) {
      this.blaster.updateBlasterHorizontalPosition(this.horizontalPosition);
    }
  }

  private updateVerticalPosition() {
    if (this.isMovingUp) {
      this.moveUp(this.SPACES_TO_MOVE);
    } else if (this.isMovingDown) {
      this.moveDown(this.SPACES_TO_MOVE);
    }

    if (this.isMovingUp || this.isMovingDown) {
      this.blaster.updateBlasterVerticalPosition(this.verticalPosition);
    }
  }

  protected override moveDown(unitsToMove: number) {
    const newVerticalPosition = this.verticalPosition + unitsToMove;
    const maxDownPosition = this.canvas.height - this.HEIGHT;
    this.verticalPosition = Math.min(newVerticalPosition, maxDownPosition);
  }

  protected override moveUp(unitsToMove: number) {
    const newVerticalPosition = this.verticalPosition - unitsToMove;
    const maxUpwardPosition =
      this.canvas.height - this.MAX_VERTICAL_SPACES_TO_MOVE;
    this.verticalPosition = Math.max(newVerticalPosition, maxUpwardPosition);
  }
}
