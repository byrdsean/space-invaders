function getCanvas(): Canvas {
  const gameScreen: HTMLCanvasElement = document.getElementById(
    "game_screen"
  )! as HTMLCanvasElement;

  const boundedContext: DOMRect = gameScreen.getBoundingClientRect();
  const height = Math.floor(boundedContext.height) - Constants.BORDER_WIDTH;
  const width = Math.floor(boundedContext.width) - Constants.BORDER_WIDTH;

  gameScreen.height = height;
  gameScreen.width = width;

  return {
    canvasContext: gameScreen.getContext("2d")!,
    height: height,
    width: width,
  } as Canvas;
}
