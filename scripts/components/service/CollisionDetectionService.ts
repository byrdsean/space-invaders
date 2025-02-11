class CollisionDetectionService {
  constructor() {}

  hasCollided(object1: MoveableEntity, object2: MoveableEntity): boolean {
    if (!object1 || !object2) {
      return false;
    }

    if (
      object1.horizontalPosition + object1.getWidth() <
      object2.horizontalPosition
    ) {
      return false;
    }

    if (
      object2.horizontalPosition + object2.getWidth() <
      object1.horizontalPosition
    ) {
      return false;
    }

    if (
      object1.verticalPosition + object1.getHeight() <
      object2.verticalPosition
    ) {
      return false;
    }

    if (
      object2.verticalPosition + object2.getHeight() <
      object1.verticalPosition
    ) {
      return false;
    }

    return true;
  }
}
