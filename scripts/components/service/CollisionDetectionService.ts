class CollisionDetectionService {
  constructor() {}

  hasCollided(object1: MoveableEntity, object2: MoveableEntity): boolean {
    if (!object1 || !object2) {
      return false;
    }

    if (
      object1.getHorizontalPosition() + object1.getWidth() <
      object2.getHorizontalPosition()
    ) {
      return false;
    }

    if (
      object2.getHorizontalPosition() + object2.getWidth() <
      object1.getHorizontalPosition()
    ) {
      return false;
    }

    if (
      object1.getVerticalPosition() + object1.getHeight() <
      object2.getVerticalPosition()
    ) {
      return false;
    }

    if (
      object2.getVerticalPosition() + object2.getHeight() <
      object1.getVerticalPosition()
    ) {
      return false;
    }

    return true;
  }
}
