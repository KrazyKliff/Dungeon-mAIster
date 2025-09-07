import { Faction } from './lore.model';
import { Location } from './location.model';

export interface FactionInfluence {
  factionId: string;
  influence: number;
}

export interface WorldEvent {
  id: string;
  name: string;
  description: string;
  trigger: {
    factionId: string;
    threshold: number;
  };
}

export interface WorldState {
  factionInfluences: FactionInfluence[];
  activeEvents: WorldEvent[];
  locations: Location[];
}
