class Enemy extends MoveableEntity {
  private readonly healthManagerService: HealthManagerService;
  private readonly blaster: Blaster;
  private readonly pointsForDefeating: number;

  private readonly spriteLocation: string;
  private sprite: HTMLImageElement;

  private maxLeftPosition = 0;
  private maxRightPosition = 0;
  private nextVerticalPositonToMoveDown = 0;
  private movementSpeed = 1;

  constructor(config: EnemyConfig) {
    super();

    this.pointsForDefeating = config.pointsForDefeating;

    this.spriteLocation = config.spriteLocation;
    this.sprite = this.setSprite(config.spriteWidth, config.spriteHeight);

    this.healthManagerService = new HealthManagerService(config.maxHealth);

    this.blaster = new Blaster(this.verticalPosition + this.HEIGHT);
    this.blaster.shootDownwards();
  }

  override draw() {
    this.updatePosition();

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

  getNextShot(): BlasterBullet | null {
    return this.blaster.shoot();
  }

  getHealth(): number {
    return this.healthManagerService.getHealth();
  }

  decrementHealth(removeValue: number) {
    this.healthManagerService.decrementHealth(removeValue);

    const halfHealth = Math.floor(this.healthManagerService.getMaxHealth() / 2);
    const thirdHealth = Math.floor(
      this.healthManagerService.getMaxHealth() / 3
    );
  }

  getPointsForDefeating(): number {
    return this.pointsForDefeating;
  }

  setMaxHorizontalBounds(maxLeftPosition: number, maxRightPosition: number) {
    this.maxLeftPosition = maxLeftPosition;
    this.maxRightPosition = maxRightPosition;
  }

  setStartingPosition(verticalPosition: number, horizontalPosition: number) {
    this.verticalPosition = verticalPosition;
    this.horizontalPosition = horizontalPosition;
    this.nextVerticalPositonToMoveDown = verticalPosition;

    this.blaster.updateBlasterHorizontalPosition(this.horizontalPosition);
    this.blaster.updateBlasterVerticalPosition(this.verticalPosition);
  }

  private updatePosition() {
    this.updateMoveLeft();
    this.updateMoveRight();
    this.updateMoveDown();
  }

  private updateMoveLeft() {
    if (!this.isMovingLeft) return;

    if (this.horizontalPosition <= this.maxLeftPosition) {
      this.stopMovingLeft();
      this.setNextVerticalPositionToMoveDown();
      this.startMovingDown();
    } else {
      this.moveLeft(this.movementSpeed, this.maxLeftPosition);
      this.blaster.updateBlasterHorizontalPosition(this.horizontalPosition);
    }
  }

  private updateMoveRight() {
    if (!this.isMovingRight) return;

    if (this.horizontalPosition + this.WIDTH >= this.maxRightPosition) {
      this.stopMovingRight();
      this.setNextVerticalPositionToMoveDown();
      this.startMovingDown();
    } else {
      this.moveRight(this.movementSpeed, this.maxRightPosition);
      this.blaster.updateBlasterHorizontalPosition(this.horizontalPosition);
    }
  }

  private updateMoveDown() {
    if (!this.isMovingDown) return;

    if (this.verticalPosition < this.nextVerticalPositonToMoveDown) {
      this.moveDown(this.movementSpeed);

      this.blaster.updateBlasterVerticalPosition(
        this.verticalPosition + this.HEIGHT
      );

      return;
    }

    this.stopMovingDown();

    if (this.horizontalPosition <= this.maxLeftPosition) {
      this.startMovingRight();
    }

    if (this.horizontalPosition + this.WIDTH >= this.maxRightPosition) {
      this.startMovingLeft();
    }
  }

  private setNextVerticalPositionToMoveDown() {
    this.nextVerticalPositonToMoveDown += this.HEIGHT;
  }

  private setSprite(width: number, height: number): HTMLImageElement {
    const sprite = new Image();
    sprite.src = this.spriteLocation;

    this.WIDTH = width;
    this.HEIGHT = height;

    return sprite;
  }
}
