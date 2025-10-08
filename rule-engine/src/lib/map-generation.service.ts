import { MapData, MapProp, MapParameters} from '@dungeon-maister/data-models';
import { Logger } from '@dungeon-maister/shared'; // Added import

export function generateMap(width: number, height: number, params: MapParameters): { map: MapData; props: MapProp[] } {
  const map = Array.from({ length: height }, () => Array(width).fill(1));
  let currentRow = Math.floor(height / 2);
  let currentColumn = Math.floor(width / 2);
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (let i = 0; i < (width * height); i++) {
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    const newRow = currentRow + randomDirection[0];
    const newCol = currentColumn + randomDirection[1];
    if (newRow > 0 && newRow < height - 1 && newCol > 0 && newCol < width - 1) {
      currentRow = newRow;
      currentColumn = newCol;
      map[currentRow][currentColumn] = 0;
    }
  }

  const floorTiles: Array<{ x: number, y: number }> = []; // Explicitly typed
  map.forEach((row, y) => row.forEach((tile, x) => { if (tile === 0) floorTiles.push({x, y}); }));

  const props: MapProp[] = [];
  const propCount = params.propDensity === 'high' ? 7 : params.propDensity === 'medium' ? 5 : 3;
  for (let i = 0; i < propCount && floorTiles.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * floorTiles.length);
    const tile = floorTiles.splice(randomIndex, 1)[0];
    const propName = params.propThemes[Math.floor(Math.random() * params.propThemes.length)];
    props.push({ name: propName, x: tile.x, y: tile.y });
  }
  Logger.info('[MapGen]: Deterministically placed props:', props);
  return { map, props };
}