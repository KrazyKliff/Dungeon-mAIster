import { GameEntity, MapData } from '@dungeon-maister/data-models';

type Direction = 'up' | 'down' | 'left' | 'right';

export function moveEntity(
  entity: GameEntity,
  direction: Direction,
  mapData: MapData
): { x: number; y: number } {
  let { x, y } = entity;

  switch (direction) {
    case 'up':
      y -= 1;
      break;
    case 'down':
      y += 1;
      break;
    case 'left':
      x -= 1;
      break;
    case 'right':
      x += 1;
      break;
  }

  // Collision detection: Check if the new position is a wall (tile type 1)
  if (
    mapData[y] &&
    mapData[y][x] !== undefined &&
    mapData[y][x] === 0 // 0 is a floor tile
  ) {
    return { x, y }; // Return new position if valid
  }

  return { x: entity.x, y: entity.y }; // Return original position if invalid
}
