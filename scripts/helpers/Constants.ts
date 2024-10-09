class Constants {
  public static readonly BORDER_WIDTH = 1;
  public static readonly FPS = 60;
  public static readonly MILLISECONDS_PER_FRAME = 1000 / this.FPS;
  public static readonly MILLISECONDS_RENDER_MINIMUM =
    Math.floor(this.MILLISECONDS_PER_FRAME) - 1;
  public static readonly MILLISECONDS_RENDER_MAXIMUM =
    Math.floor(this.MILLISECONDS_PER_FRAME) + 1;
}
