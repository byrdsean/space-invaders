class FontHelper {
  public static readonly FONT_SIZE = 12;
  public static readonly TITLE_FONT_SIZE = this.FONT_SIZE * 3;

  public static getFontFamily(fontSize: number): string {
    return `${fontSize}px PressStart2P, Arial`;
  }
}
