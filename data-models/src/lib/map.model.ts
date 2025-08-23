// A 2D array of numbers where 0 is a floor and 1 is a wall
export type MapData = number[][];

// Represents any object or character on the map
export interface GameEntity {
  id: string;
  x: number;
  y: number;
  isPlayer: boolean;
}
