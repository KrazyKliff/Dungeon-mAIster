import { Character } from './character.model';
import { GameMessage } from './message.model';

// A 2D array of numbers where 0 is a floor and 1 is a wall
export type MapData = number[][];

// Represents any object or character on the map
export interface GameEntity {
  id: string;
  name: string;
  x: number;
  y: number;
  isPlayer: boolean;
}

// The single source of truth for the entire game state
export interface GameState {
  map: MapData;
  entities: GameEntity[];
  characters: Record<string, Character>;
  selectedEntityId: string | null;
}
