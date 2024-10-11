class CanvasInstance {
  private static GAME_SCREEN_ID = "game_screen";
  private static instance: Canvas | null;

  private constructor() {}

  public static getInstance(): Canvas {
    if (this.instance) return this.instance;

    const gameScreen: HTMLCanvasElement = document.getElementById(
      CanvasInstance.GAME_SCREEN_ID
    )! as HTMLCanvasElement;

    const boundedContext: DOMRect = gameScreen.getBoundingClientRect();
    const height = Math.floor(boundedContext.height) - Constants.BORDER_WIDTH;
    const width = Math.floor(boundedContext.width) - Constants.BORDER_WIDTH;

    gameScreen.height = height;
    gameScreen.width = width;

    this.instance = {
      canvasContext: gameScreen.getContext("2d")!,
      height: height,
      width: width,
    } as Canvas;

    return this.instance;
  }
}
