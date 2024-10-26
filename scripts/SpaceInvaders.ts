class SpaceInvaders {
  private readonly FPS = 60;

  private lastTimestamp = 0;
  private bulletArray: BlasterBullet[] = [];

  private readonly canvas: Canvas;
  private readonly player: Player;
  private readonly enemyGroup: EnemyGroup;
  private readonly keyboardControls: KeyboardControls;
  private readonly collisionDetector: CollisionDetectionService;
  private readonly renderMaximumMilliseconds: number;
  private readonly renderMinimumMilliseconds: number;

  constructor() {
    const millisecondsPerFrame = 1000 / this.FPS;
    this.renderMaximumMilliseconds = Math.floor(millisecondsPerFrame) + 1;
    this.renderMinimumMilliseconds = Math.floor(millisecondsPerFrame) - 1;

    this.canvas = CanvasInstance.getInstance();

    const playerVerticalPosition = Player.getInitialVerticalPosition(
      this.canvas.height
    );
    const playerHorizontalPosition = Player.getInitialHorizontalPosition(
      this.canvas.height
    );
    this.player = new Player(playerVerticalPosition, playerHorizontalPosition);
    this.enemyGroup = new EnemyGroup();

    this.keyboardControls = new KeyboardControls(this.player);
    this.keyboardControls.addKeyDownControls();
    this.keyboardControls.addKeyUpControls();

    this.collisionDetector = new CollisionDetectionService();
  }

  renderFrame(timestamp: number) {
    if (!this.shouldRenderFrame(timestamp)) return;

    this.canvas.canvasContext.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    this.removeCollidedBulletsAndEnemies();

    this.enemyGroup.getEnemies().forEach((enemy) => enemy.draw());
    this.player.draw();

    const nextShot: BlasterBullet | null = this.player.getNextShot();
    if (nextShot !== null) {
      this.bulletArray.push(nextShot);
    }
    this.renderBullets();
  }

  private shouldRenderFrame(timestamp: number): boolean {
    const deltaTimeMilliseconds: number = Math.floor(
      timestamp - this.lastTimestamp
    );
    this.lastTimestamp = timestamp;
    return (
      this.renderMinimumMilliseconds <= deltaTimeMilliseconds &&
      deltaTimeMilliseconds <= this.renderMaximumMilliseconds
    );
  }

  private renderBullets() {
    let index = 0;
    while (index < this.bulletArray.length) {
      const currentBullet = this.bulletArray[index];
      if (!currentBullet.isBulletOffScreen()) {
        currentBullet.draw();
        index++;
      } else {
        this.bulletArray.splice(index, 1);
      }
    }
  }

  private removeCollidedBulletsAndEnemies() {
    if (this.bulletArray.length === 0) return;

    let index = 0;
    while (index < this.bulletArray.length) {
      const removedEnemies = this.removeCollidedEnemy(this.bulletArray[index]);
      if (0 < removedEnemies.length) {
        this.bulletArray.splice(index, 1);
      } else {
        index++;
      }
    }
  }

  private removeCollidedEnemy(bullet: BlasterBullet): Enemy[] {
    let index = 0;
    const removedEnemies = [] as Enemy[];
    while (index < this.enemyGroup.getEnemies().length) {
      const hasCollided = this.collisionDetector.hasCollided(
        bullet,
        this.enemyGroup.getEnemies()[index]
      );
      if (hasCollided) {
        const removedEnemy = this.enemyGroup.removeEnemy(index)!;
        removedEnemies.push(removedEnemy);
      } else {
        index++;
      }
    }
    return removedEnemies;
  }
}

const spaceInvaders = new SpaceInvaders();

function animate(timestamp: number) {
  spaceInvaders.renderFrame(timestamp);
  requestAnimationFrame(animate);
}

this.animate(0);
