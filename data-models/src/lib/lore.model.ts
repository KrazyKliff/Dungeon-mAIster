export type Boon = {
  attribute: string;
  bonus: number;
};

export interface Belief {
  name: string;
  description: string;
  tenet?: string;
  prerequisite?: string;
  boon?: Boon;
}

export interface Faction {
  id: string;
  name: string;
  description: string;
  type: 'Commonwealth' | 'Unaligned' | 'Heresy';
  capital?: string;
  leader?: string;
  locations?: string[];
}

export interface LocationDetails {
  id:string;
  name: string;
  description: string;
  factionId?: string;
  biome: string;
}

export interface HistoricalEvent {
  name: string;
  description: string;
  era: 'Ancient' | 'The Great Shattering' | 'Age of Rediscovery';
}

export interface ChaosTouchedBeast {
  name: string;
  description: string;
  mutations: string[];
}

export interface Dragonstone {
  name: string;
  description: string;
  properties: string[];
}

export interface ArcanePrime {
  name: string;
  description: string;
  associatedAttribute: string;
}

export interface SpiritDomain {
  name: string;
  description: string;
  associatedAttribute: string;
}
