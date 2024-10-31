class SpaceInvaders {
  private readonly FPS = 60;

  private lastTimestamp = 0;
  private score = 0;
  private bulletArray: BlasterBullet[] = [];
  private enemyBulletArray: BlasterBullet[] = [];

  private readonly canvas: Canvas;
  private readonly player: Player;
  private readonly enemyGroup: EnemyGroup;
  private readonly keyboardControls: KeyboardControls;
  private readonly collisionDetector: CollisionDetectionService;
  private readonly headsUpDisplay: HeadsUpDisplayService;
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
    this.headsUpDisplay = new HeadsUpDisplayService();
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
    this.checkPlayerHit();
    this.headsUpDisplay.draw(this.score, this.player.getHealth());

    this.enemyGroup.getEnemies().forEach((enemy) => enemy.draw());
    this.addNextShot(
      this.enemyGroup.triggerEnemyToShoot(),
      this.enemyBulletArray
    );

    this.player.draw();
    this.addNextShot(this.player.getNextShot(), this.bulletArray);

    this.renderBullets(this.enemyBulletArray);
    this.renderBullets(this.bulletArray);
  }

  private addNextShot(
    nextShot: BlasterBullet | null,
    bullets: BlasterBullet[]
  ) {
    if (!nextShot) return;
    bullets.push(nextShot);
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

  private renderBullets(bullets: BlasterBullet[]) {
    let index = 0;
    while (index < bullets.length) {
      const currentBullet = bullets[index];
      if (!currentBullet.isBulletOffScreen()) {
        currentBullet.draw();
        index++;
      } else {
        bullets.splice(index, 1);
      }
    }
  }

  private checkPlayerHit() {
    if (this.enemyBulletArray.length === 0) return;

    let index = 0;
    while (index < this.enemyBulletArray.length) {
      const bullet = this.enemyBulletArray[index];
      const hasCollided = this.collisionDetector.hasCollided(bullet, this.player);

      if (hasCollided) {
        this.enemyBulletArray.splice(index, 1);
        this.player.decrementHealth(bullet.getDamageAmount());
      } else {
        index++;
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
