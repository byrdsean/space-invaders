// @ts-ignore
class Player extends MoveableEntity {
  private readonly MAX_HEALTH = 100;

  private readonly MAX_VERTICAL_SPACES_TO_MOVE = 75;
  private readonly SPACES_TO_MOVE = 2;

  private readonly SPRITE_LOCATION = "./dist/images/player.png";
  private readonly SPRITE_MAX_HEIGHT = 50;

  private readonly healthManagerService: HealthManagerService;

  private isShooting: boolean = false;
  private blaster: Blaster;
  private sprite: HTMLImageElement;

  constructor() {
    super();

    const sprite = this.setSprite();
    this.sprite = sprite.image;
    this.HEIGHT = sprite.height;
    this.WIDTH = sprite.width;

    this.setStartingPosition();

    this.blaster = new Blaster(this.WIDTH);
    this.blaster.updateBlasterHorizontalPosition(this.horizontalPosition);
    this.blaster.updateBlasterVerticalPosition(this.verticalPosition);

    this.healthManagerService = new HealthManagerService(this.MAX_HEALTH);
  }

  reset() {
    super.reset();

    this.setStartingPosition();

    this.isShooting = false;

    this.blaster = new Blaster(this.WIDTH);
    this.blaster.updateBlasterHorizontalPosition(this.horizontalPosition);
    this.blaster.updateBlasterVerticalPosition(this.verticalPosition);
  }

  override draw() {
    this.updateHorizontalPosition();
    this.updateVerticalPosition();

    // TODO: remove comments
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

  private setSprite(): Sprite {
    const sprite = new Image();
    sprite.src = this.SPRITE_LOCATION;

    const maxHeight = Math.min(this.SPRITE_MAX_HEIGHT, sprite.height);
    const aspectRatio =
      maxHeight < sprite.height ? maxHeight / sprite.height : 1;
    const maxWidth = sprite.width * aspectRatio;

    return {
      image: sprite,
      width: maxWidth,
      height: maxHeight,
    };
  }

  private setStartingPosition() {
    this.verticalPosition = this.getStartingVerticalPosition(
      this.canvas.height
    );
    this.horizontalPosition = this.getStartingHorizontalPosition(
      this.canvas.height
    );

    console.log({
      verticalPosition: this.verticalPosition,
      horizontalPosition: this.horizontalPosition,
      canvasHeight: this.canvas.height,
      height: this.HEIGHT,
      width: this.WIDTH,
    });
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
