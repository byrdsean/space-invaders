class Player extends MoveableEntity {
  private readonly MAX_HEALTH = 100;

  private readonly MAX_VERTICAL_SPACES_TO_MOVE = 75;
  private readonly SPACES_TO_MOVE = 2;

  private readonly SPRITE_LOCATION = "./dist/images/player.png";
  private readonly SPRITE_HEIGHT = 50;
  private readonly SPRITE_WIDTH = 59;

  private readonly healthManagerService: HealthManagerService;

  private isShooting: boolean = false;
  private blaster: Blaster;
  private sprite: HTMLImageElement;

  constructor() {
    super();

    this.sprite = this.setSprite();

    this.setStartingPosition();

    this.blaster = new Blaster(
      this.WIDTH,
      this.horizontalPosition,
      this.verticalPosition
    );
    this.blaster.updateProjectTileType(ProjectileTypes.THREE_BLASTER_PULSE);

    this.healthManagerService = new HealthManagerService(this.MAX_HEALTH);
  }

  reset() {
    super.reset();

    this.setStartingPosition();

    this.isShooting = false;

    this.blaster = new Blaster(
      this.WIDTH,
      this.horizontalPosition,
      this.verticalPosition
    );
    this.blaster.updateProjectTileType(ProjectileTypes.THREE_BLASTER_PULSE);
  }

  override draw() {
    this.updateHorizontalPosition();
    this.updateVerticalPosition();

    this.canvas.canvasContext.drawImage(
      this.sprite,
      0,
      0,
      this.WIDTH,
      this.HEIGHT,
      this.horizontalPosition,
      this.verticalPosition,
      this.WIDTH,
      this.HEIGHT
    );
  }

  getNextShot(): BlasterBullet[] | null {
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

  private getStartingVerticalPosition(maxHeight: number): number {
    return maxHeight - this.HEIGHT;
  }

  private getStartingHorizontalPosition(maxWidth: number): number {
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

  private setSprite(): HTMLImageElement {
    const sprite = new Image();
    sprite.src = this.SPRITE_LOCATION;

    this.WIDTH = this.SPRITE_WIDTH;
    this.HEIGHT = this.SPRITE_HEIGHT;

    return sprite;
  }

  private setStartingPosition() {
    this.verticalPosition = this.getStartingVerticalPosition(
      this.canvas.height
    );
    this.horizontalPosition = this.getStartingHorizontalPosition(
      this.canvas.height
    );
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
