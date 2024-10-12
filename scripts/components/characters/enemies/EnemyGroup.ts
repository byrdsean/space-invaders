class EnemyGroup {
  private readonly ENEMY_SPACING = 5;
  private readonly BUFFER_FROM_CANVAS_BOUNDS = 10;
  private readonly canvas: Canvas;

  private enemies: Enemy[] = [];
  private currentLevel = 1;

  constructor() {
    this.canvas = CanvasInstance.getInstance();
    this.addEnemies();
  }

  getEnemies(): Enemy[] {
    return [...this.enemies];
  }

  private addEnemies() {
    const levelData = EnemyConstants.levels.find(
      (levelData) => levelData.level == this.currentLevel
    );

    if (!levelData) return;

    const maxLengthOfEnemyRows = levelData.enemies
      .map((enemyList) => enemyList.length)
      .reduce((acc, val) => Math.max(acc, val), 0);

    const groupHorizontalPosition =
      this.calculateRowOffset(maxLengthOfEnemyRows);

    const consoleTable = [] as any[];

    levelData.enemies.forEach((row, rowIndex) => {
      const verticalPosition = rowIndex * (Enemy.HEIGHT + this.ENEMY_SPACING);
      const horizontalOffset = this.calculateRowOffset(row.length);
      // const blocksFromBound = (maxLengthOfEnemyRows - row.length) / 2;

      const maxWidthOfRow =
        row.length * Enemy.WIDTH + (row.length - 1) * this.ENEMY_SPACING;
      // console.log({ maxWidthOfRow });

      row.forEach((col, colIndex) => {
        // const numberOfBlocksFromGroupBound =
        //   blockOffsetFromGroupBound + colIndex;

        // const distanceFromHorizontalOrigin =
        //   numberOfBlocksFromGroupBound * Enemy.WIDTH +
        //   Math.floor(blockOffsetFromGroupBound + colIndex) * this.ENEMY_SPACING;

        const horizontalPosition =
          colIndex * (Enemy.WIDTH + this.ENEMY_SPACING) + horizontalOffset;

        // const distanceToTravel = this.getDistanceToTravel(
        //   horizontalPosition,
        //   blocksFromBound
        // );

        // const test =
        //   this.canvas.width -
        //   maxWidthOfRow -
        //   horizontalPosition -
        //   groupHorizontalPosition;
        // console.log(test);

        const minBound = horizontalPosition - groupHorizontalPosition;

        const upperBoundSpace =
          ((maxLengthOfEnemyRows - row.length) / 2) * Enemy.WIDTH +
          Math.floor((maxLengthOfEnemyRows - row.length) / 2) *
            this.ENEMY_SPACING +
          (row.length - colIndex) * Enemy.WIDTH +
          (row.length - colIndex - 1) * this.ENEMY_SPACING;
        const maxBound = this.canvas.width - upperBoundSpace;

        // const maxBound =
        //   this.canvas.width -
        //   minBound -
        //   (Enemy.WIDTH * (row.length - colIndex) +
        //     this.ENEMY_SPACING * (row.length - colIndex - 1));

        consoleTable.push({
          r: rowIndex,
          c: colIndex,
          width: this.canvas.width,
          rowW: maxWidthOfRow,
          // buffer: this.BUFFER_FROM_CANVAS_BOUNDS,
          blockWidth: Enemy.WIDTH * (row.length - colIndex),
          spaceWidth: this.ENEMY_SPACING * (row.length - colIndex - 1),
          minBound,
          maxBound,
        });

        const enemy = new Enemy(
          verticalPosition,
          horizontalPosition,
          minBound,
          // this.canvas.width - this.BUFFER_FROM_CANVAS_BOUNDS
          maxBound
        );
        // enemy.startMovingLeft();
        // enemy.startMovingRight();

        this.enemies.push(enemy);
      });
    });

    console.table(consoleTable);
  }

  private calculateRowOffset(rowLength: number) {
    const maxWidthOfRow =
      rowLength * Enemy.WIDTH + (rowLength - 1) * this.ENEMY_SPACING;
    return Math.floor(this.canvas.width / 2) - Math.floor(maxWidthOfRow / 2);
  }

  // private getDistanceToTravel(
  //   horizontalPosition: number,
  //   blocksFromBound: number
  // ): test {
  //   const xDistance =
  //     horizontalPosition -
  //     blocksFromBound * Enemy.WIDTH -
  //     Math.floor(blocksFromBound) * this.ENEMY_SPACING -
  //     this.BUFFER_FROM_CANVAS_BOUNDS;
  //   return { xDistance };
  // }
}
