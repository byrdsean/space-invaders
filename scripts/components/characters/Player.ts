// @ts-ignore
class Player extends MoveableEntity {
  private static MAX_HEALTH = 100;

  private readonly SPACES_TO_MOVE = 2;
  private readonly MAX_VERTICAL_SPACES_TO_MOVE = 75;
  private readonly healthManagerService: HealthManagerService;

  private isShooting: boolean = false;
  private blaster: Blaster;

  private readonly SPRITE_LOCATION = "./images/player.png";
  private readonly SPRITE_MAX_HEIGHT = 25;
  private sprite: HTMLImageElement;

  constructor(
    initialVerticalPosition: number,
    initialHorizontalPosition: number
  ) {
    super(initialVerticalPosition, initialHorizontalPosition);

    const sprite = this.setSprite();
    this.sprite = sprite.image;
    this.HEIGHT = sprite.height;
    this.WIDTH = sprite.width;

    this.blaster = new Blaster(
      this.verticalPosition,
      this.horizontalPosition,
      this.WIDTH
    );
    this.healthManagerService = new HealthManagerService(Player.MAX_HEALTH);
  }

  reset() {
    this.isShooting = false;
    this.verticalPosition = this.getInitialVerticalPosition(this.canvas.height);
    this.horizontalPosition = this.getInitialHorizontalPosition(
      this.canvas.height
    );
    this.blaster = new Blaster(
      this.verticalPosition,
      this.horizontalPosition,
      this.WIDTH
    );
  }

  override draw() {
    this.updateHorizontalPosition();
    this.updateVerticalPosition();

    this.canvas.canvasContext.drawImage(
      this.sprite,
      0, //source x position
      0, //source y position
      this.sprite.width, //source width
      this.sprite.height, //source height
      this.horizontalPosition, //destination x position
      this.verticalPosition, //destination y position
      this.WIDTH, //destiination width
      this.HEIGHT //destination height
    );
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

  private getInitialVerticalPosition(maxHeight: number): number {
    return maxHeight - this.HEIGHT;
  }

  private getInitialHorizontalPosition(maxWidth: number): number {
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

  private setSprite(): Sprite {
    const sprite = new Image();
    sprite.src = this.SPRITE_LOCATION;

    const maxHeight = Math.min(this.SPRITE_MAX_HEIGHT, sprite.height);
    const maxWidth =
      maxHeight < sprite.height
        ? sprite.width * (maxHeight / sprite.height)
        : sprite.width;

    return {
      image: sprite,
      width: maxWidth,
      height: maxHeight,
    };
  }
}
