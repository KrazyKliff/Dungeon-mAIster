// A simple procedural generation algorithm (Drunkard's Walk)

interface MapConfig {
  width: number;
  height: number;
  maxTunnels: number;
  maxLength: number;
}

export function generateMap(config: MapConfig): number[][] {
  // Create a grid filled with walls (1)
  const map = Array.from({ length: config.height }, () =>
    Array(config.width).fill(1)
  );

  let currentRow = Math.floor(config.height / 2);
  let currentColumn = Math.floor(config.width / 2);
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Up, Down, Left, Right
  let randomDirection = directions[Math.floor(Math.random() * directions.length)];
  let tunnelLength = 0;

  for (let i = 0; i < config.maxTunnels; i++) {
    const tunnelMaxLength = Math.floor(Math.random() * config.maxLength);
    randomDirection = directions[Math.floor(Math.random() * directions.length)];

    while (tunnelLength < tunnelMaxLength) {
      if (
        (currentRow >= 0 && currentRow < config.height) &&
        (currentColumn >= 0 && currentColumn < config.width)
      ) {
        map[currentRow][currentColumn] = 0; // Carve a floor tile
        tunnelLength++;

        currentRow += randomDirection[0];
        currentColumn += randomDirection[1];
      } else {
        break; // Hit the edge of the map
      }
    }
    tunnelLength = 0;
  }
  return map;
}
