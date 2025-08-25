import { Prop } from './prop.models';

export interface Tile {
  x: number;
  y: number;
  type: 'floor' | 'wall';
  isWalkable: boolean;
  prop?: Prop | null; // <-- ADDED PROP PROPERTY
}

export interface Grid {
  width: number;
  height: number;
  tiles: Tile[][];
}
