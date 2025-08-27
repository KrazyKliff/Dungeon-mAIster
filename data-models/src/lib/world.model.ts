import { Faction } from './lore.model';

export interface FactionInfluence {
  factionId: string;
  influence: number;
}

export interface WorldState {
  factionInfluences: FactionInfluence[];
}
