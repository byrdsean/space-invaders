class CollisionDetectionService {
  constructor() {}

  hasCollided(object1: MoveableEntity, object2: MoveableEntity): boolean {
    if (!object1 || !object2) {
      return false;
    }

    if (
      object1.horizontalPosition + object1.WIDTH <
      object2.horizontalPosition
    ) {
      return false;
    }

    if (
      object2.horizontalPosition + object2.WIDTH <
      object1.horizontalPosition
    ) {
      return false;
    }

    if (object1.verticalPosition + object1.HEIGHT < object2.verticalPosition) {
      return false;
    }

    if (object2.verticalPosition + object2.HEIGHT < object1.verticalPosition) {
      return false;
    }

    return true;
  }
}
