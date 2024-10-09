const bulletArray: BlasterBullet[] = [];
const canvas: Canvas = getCanvas();
const player: Player = new Player(canvas);
const keyboardControls = new KeyboardControls(player);
let lastTimestamp = 0;

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

  renderBullets();
}

function animate(timestamp: number) {
  renderFrame(timestamp);
  requestAnimationFrame(animate);
}

initNewGame();
animate(0);
