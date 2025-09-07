import { Character } from './character.model';

export type MapData = number[][];
export interface MapProp { name: string; x: number; y: number; }
export interface GameEntity { id: string; name: string; x: number; y: number; isPlayer: boolean; }
export interface MapConfig { width: number; height: number; maxTunnels: number; maxLength: number; theme: string; }
export interface MapParameters { propDensity: 'low' | 'medium' | 'high'; propThemes: string[]; enemyCount: number; }
export interface CombatState {
  isActive: boolean;
  turn: number;
  order: string[]; // array of entity IDs
}

export interface GameState {
  map: MapData;
  mapName: string;
  mapDescription: string;
  entities: GameEntity[];
  props: MapProp[];
  characters: Record<string, Character>;
  selectedEntityId: string | null;
  combat: CombatState | null;
}
