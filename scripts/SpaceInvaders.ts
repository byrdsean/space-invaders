const bulletArray: BlasterBullet[] = [];
const enemies: Enemy[] = [];
// @ts-ignore
const canvas: Canvas = CanvasInstance.getInstance();
// @ts-ignore
const player: Player = new Player();
// @ts-ignore
const keyboardControls = new KeyboardControls(player);
let lastTimestamp = 0;
let maxEnemies = 5;
const enemySpacing = 5;

function shouldRenderFrame(timestamp: number): boolean {
  const deltaTimeMilliseconds: number = Math.floor(timestamp - lastTimestamp);
  lastTimestamp = timestamp;

  return (
    Constants.MILLISECONDS_RENDER_MINIMUM <= deltaTimeMilliseconds &&
    deltaTimeMilliseconds <= Constants.MILLISECONDS_RENDER_MAXIMUM
  );
}

function initNewGame() {
  player.reset();
  player.draw();
}

function renderBullets() {
  let index = 0;
  while (index < bulletArray.length) {
    const currentBullet = bulletArray[index];
    if (!currentBullet.isBulletOffScreen()) {
      currentBullet.draw();
      index++;
    } else {
      bulletArray.splice(index, 1);
    }
  }
}

function renderEnemies() {
  if (enemies.length === 0) {
    const intRange = [...Array.from(new Array(maxEnemies)).keys()];
    intRange.forEach((index) => {
      const enemy = new Enemy(0, index * (Enemy.WIDTH + enemySpacing));
      enemies.push(enemy);
    });
  }
  enemies.forEach((enemy) => enemy.draw());
}

function renderFrame(timestamp: number) {
  if (!shouldRenderFrame(timestamp)) {
    return;
  }

  canvas.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();

  const nextShot: BlasterBullet | null = player.getNextShot();
  if (nextShot !== null) {
    bulletArray.push(nextShot);
  }

  renderEnemies();
  renderBullets();
}

function animate(timestamp: number) {
  renderFrame(timestamp);
  requestAnimationFrame(animate);
}

initNewGame();
animate(0);
