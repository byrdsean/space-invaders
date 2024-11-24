class SpaceInvaders {
  private readonly FPS = 60;

  private readonly canvas: Canvas;
  private readonly player: Player;
  private readonly enemyGroup: EnemyGroup;

  private readonly keyboardControls: KeyboardControls;
  private readonly collisionDetector: CollisionDetectionService;
  private readonly headsUpDisplay: HeadsUpDisplayService;
  private readonly gameSplashScreen: DrawGameSplashScreen;

  private readonly renderMaximumMilliseconds: number;
  private readonly renderMinimumMilliseconds: number;

  private lastTimestamp = 0;
  private score = 0;
  private bulletArray: BlasterBullet[] = [];
  private enemyBulletArray: BlasterBullet[] = [];
  private gameStarted: Boolean = false;

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

    this.keyboardControls = new KeyboardControls(this.player, () => {
      this.startGame();
    });
    this.keyboardControls.addKeyDownControls();
    this.keyboardControls.addKeyUpControls();

    this.collisionDetector = new CollisionDetectionService();
    this.headsUpDisplay = new HeadsUpDisplayService();
    this.gameSplashScreen = new DrawGameSplashScreen();
  }

  renderFrame(timestamp: number) {
    if (!this.shouldRenderFrame(timestamp)) return;

    const ctx = this.canvas.canvasContext;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.gameStarted) {
      this.renderGamePlay();
    } else {
      this.gameSplashScreen.drawSplashScreen();
    }
  }
  renderGamePlay() {
    this.removeCollidedBulletsAndEnemies();
    this.checkPlayerHit();

    this.enemyGroup.getEnemies().forEach((enemy) => enemy.draw());
    this.addNextShot(this.enemyGroup.getNextShot(), this.enemyBulletArray);

    this.player.draw();
    this.addNextShot(this.player.getNextShot(), this.bulletArray);

    this.showAndRemoveBullets(this.enemyBulletArray);
    this.showAndRemoveBullets(this.bulletArray);

    this.headsUpDisplay.draw(this.score, this.player.getHealth());
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

  private showAndRemoveBullets(bullets: BlasterBullet[]) {
    [...bullets].forEach((bullet, index) => {
      if (!bullet.isBulletOffScreen()) {
        bullet.draw();
      } else {
        bullets.splice(index, 1);
      }
    });
  }

  private checkPlayerHit() {
    if (this.enemyBulletArray.length === 0) return;

    [...this.enemyBulletArray].forEach((bullet, index) => {
      const hasCollided = this.collisionDetector.hasCollided(
        bullet,
        this.player
      );
      if (hasCollided) {
        this.enemyBulletArray.splice(index, 1);
        this.player.decrementHealth(bullet.getDamageAmount());
      }
    });
  }

  private removeCollidedBulletsAndEnemies() {
    if (this.bulletArray.length === 0) return;

    [...this.bulletArray].forEach((bullet, index) => {
      if (this.getCollidedEnemies(bullet)) {
        this.bulletArray.splice(index, 1);
      }
    });
  }

  private getCollidedEnemies(bullet: BlasterBullet): boolean {
    let isCollisionDetected = false;

    this.enemyGroup.getEnemies().forEach((enemy, index) => {
      if (!this.collisionDetector.hasCollided(bullet, enemy)) return;

      isCollisionDetected = true;
      enemy.decrementHealth(bullet.getDamageAmount());

      if (enemy.getHealth() <= 0) {
        const defeatedEnemy = this.enemyGroup.removeEnemy(index)!;
        this.score += defeatedEnemy.getPointsForDefeating();
      }
    });

    return isCollisionDetected;
  }

  private startGame() {
    this.gameStarted = true;
  }
}

const spaceInvaders = new SpaceInvaders();

function animate(timestamp: number) {
  spaceInvaders.renderFrame(timestamp);
  requestAnimationFrame(animate);
}

animate(0);
