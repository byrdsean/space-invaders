class KeyboardControls {
  private readonly player: Player;

  constructor(player: Player) {
    this.player = player;
    this.addKeyDownControls();
    this.addKeyUpControls();
  }

  addKeyDownControls() {
    window.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "ArrowLeft":
          this.player.startMovingLeft();
          break;
        case "ArrowRight":
          this.player.startMovingRight();
          break;
        case "Space":
          this.player.startShooting();
          break;
      }
    });
  }

  addKeyUpControls() {
    window.addEventListener("keyup", (e) => {
      switch (e.code) {
        case "ArrowLeft":
          this.player.stopMovingLeft();
          break;
        case "ArrowRight":
          this.player.stopMovingRight();
          break;
        case "ArrowUp":
          this.player.increaseRateOfFire();
          break;
        case "ArrowDown":
          this.player.decreaseRateOfFire();
          break;
        case "Space":
          this.player.stopShooting();
          break;
      }
    });
  }
}
