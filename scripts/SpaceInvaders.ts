class SpaceInvaders {
  private readonly ENEMY_SPACING = 5;
  private lastTimestamp = 0;
  private maxEnemies = 5;
  private bulletArray: BlasterBullet[] = [];
  private enemies: Enemy[] = [];

  private readonly canvas: Canvas;
  private readonly player: Player;
  private readonly keyboardControls: KeyboardControls;

  constructor() {
    this.canvas = CanvasInstance.getInstance();

    const playerVerticalPosition = Player.getInitialVerticalPosition(
      this.canvas.height
    );
    const playerHorizontalPosition = Player.getInitialHorizontalPosition(
      this.canvas.height
    );
    this.player = new Player(playerVerticalPosition, playerHorizontalPosition);

    this.keyboardControls = new KeyboardControls(this.player);
    this.keyboardControls.addKeyDownControls();
    this.keyboardControls.addKeyUpControls();
  }

  renderFrame(timestamp: number) {
    if (!this.shouldRenderFrame(timestamp)) return;

    this.canvas.canvasContext.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    this.player.draw();

    const nextShot: BlasterBullet | null = this.player.getNextShot();
    if (nextShot !== null) {
      this.bulletArray.push(nextShot);
    }

    this.renderEnemies();
    this.renderBullets();
  }

  private shouldRenderFrame(timestamp: number): boolean {
    const deltaTimeMilliseconds: number = Math.floor(
      timestamp - this.lastTimestamp
    );
    this.lastTimestamp = timestamp;
    return (
      Constants.MILLISECONDS_RENDER_MINIMUM <= deltaTimeMilliseconds &&
      deltaTimeMilliseconds <= Constants.MILLISECONDS_RENDER_MAXIMUM
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

  private renderEnemies() {
    if (this.enemies.length === 0) {
      const intRange = [...new Array(this.maxEnemies).keys()];
      intRange.forEach((index) => {
        const enemy = new Enemy(0, index * (Enemy.WIDTH + this.ENEMY_SPACING));
        this.enemies.push(enemy);
      });
    }
    this.enemies.forEach((enemy) => enemy.draw());
  }
}

const spaceInvaders = new SpaceInvaders();

function animate(timestamp: number) {
  spaceInvaders.renderFrame(timestamp);
  requestAnimationFrame(animate);
}

this.animate(0);
