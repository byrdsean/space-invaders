// @ts-ignore
class Enemy extends MoveableEntity {
  public static HEIGHT = 25;
  public static WIDTH = 25;

  private readonly BASE_COLOR: ColorRGBA = {
    red: 117,
    green: 27,
    blue: 124,
    brightness: 1,
  };
  private readonly HALF_DAMAGE_COLOR: ColorRGBA = {
    red: 196,
    green: 14,
    blue: 64,
    brightness: 1,
  };
  private readonly DANGER_COLOR: ColorRGBA = {
    red: 255,
    green: 0,
    blue: 0,
    brightness: 1,
  };

  private readonly healthManagerService: HealthManagerService;
  private readonly blaster: Blaster;
  private readonly pointsForDefeating: number;

  private maxLeftPosition = 0;
  private maxRightPosition = 0;
  private nextVerticalPositonToMoveDown = 0;
  private movementSpeed = 1;
  private currentColor: ColorRGBA = this.BASE_COLOR;

  constructor(
    initialVerticalPosition: number,
    initialHorizontalPosition: number,
    maxLeftPosition: number,
    maxRightPosition: number,
    config: EnemyConfig
  ) {
    super(
      initialVerticalPosition,
      initialHorizontalPosition,
      Enemy.HEIGHT,
      Enemy.WIDTH
    );
    this.maxLeftPosition = maxLeftPosition;
    this.maxRightPosition = maxRightPosition;
    this.nextVerticalPositonToMoveDown = initialVerticalPosition;
    this.pointsForDefeating = config.pointsForDefeating;

    this.healthManagerService = new HealthManagerService(config.maxHealth);

    this.blaster = new Blaster(
      this.verticalPosition + Enemy.HEIGHT,
      initialHorizontalPosition,
      Enemy.WIDTH
    );
    this.blaster.shootDownwards();
  }

  override draw() {
    this.updatePosition();

    const previousFillStyle = this.canvas.canvasContext.fillStyle;

    this.canvas.canvasContext.fillStyle = this.getRGBAColor();
    this.canvas.canvasContext.fillRect(
      this.horizontalPosition,
      this.verticalPosition,
      Enemy.WIDTH,
      Enemy.HEIGHT
    );

    this.canvas.canvasContext.fillStyle = previousFillStyle;
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

    if (this.healthManagerService.getHealth() <= halfHealth) {
      this.currentColor = this.HALF_DAMAGE_COLOR;
    } else if (this.healthManagerService.getHealth() <= thirdHealth) {
      this.currentColor = this.DANGER_COLOR;
    }
  }

  getPointsForDefeating(): number {
    return this.pointsForDefeating;
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

    if (this.horizontalPosition + Enemy.WIDTH >= this.maxRightPosition) {
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
        this.verticalPosition + Enemy.HEIGHT
      );

      return;
    }

    this.stopMovingDown();

    if (this.horizontalPosition <= this.maxLeftPosition) {
      this.startMovingRight();
    }

    if (this.horizontalPosition + Enemy.WIDTH >= this.maxRightPosition) {
      this.startMovingLeft();
    }
  }

  private setNextVerticalPositionToMoveDown() {
    this.nextVerticalPositonToMoveDown += Enemy.HEIGHT;
  }

  private getRGBAColor() {
    return `rgba(${this.currentColor.red}, ${this.currentColor.green}, ${this.currentColor.blue}, ${this.currentColor.brightness})`;
  }
}
