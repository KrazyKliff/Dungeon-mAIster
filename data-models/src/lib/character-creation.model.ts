import { PrimaryAttributeName, SubAttributeName } from './attributes.model';

// --- Step 2: Species Mosaic ---

export type KingdomName = 'Mammal' | 'Reptile/Amphibian' | 'Avian' | 'Aquatic' | 'Plant' | 'Insect';

export interface Kingdom {
  id: KingdomName;
  name: KingdomName;
  description: string;
  primarySubStats: [SubAttributeName, SubAttributeName];
}

export interface SpeciesFeature {
  id: string;
  name: string;
  description: string;
  category: string; // e.g., 'Eyes', 'Ears', 'Evo. Advantage'
  effects: {
    type: 'sub-attribute_bonus' | 'skill_bonus' | 'special' | 'derived_stat_bonus';
    subAttribute?: SubAttributeName;
    skillId?: string; // e.g. 'perception'
    derivedStat?: 'hp' | 'sp' | 'ep' | 'speed' | 'carrying';
    value?: number;
    description?: string; // For special effects like "Pack Tactics"
  }[];
}

// --- Step 3: Background Path ---

export interface Origin {
  id: string;
  name: string;
  description: string;
  skillProficiencies: [string, string]; // Skill IDs
}

export interface LifeEvent {
  id: string;
  name: string;
  description: string;
  statModifiers: { subAttribute: SubAttributeName; value: number }[];
  skillProficiencies: [string, string]; // Skill IDs
}

export interface Career {
  id: string;
  name: string;
  description: string;
  statModifiers: { subAttribute: SubAttributeName; value: number }[];
  skillProficiencies: [string, string]; // Advanced Skill IDs
  startingGear: string[]; // Array of item names/IDs
}

// --- Step 4: Devotion ---

export interface Prerequisite {
    type: 'attribute';
    attribute: PrimaryAttributeName;
    value: number;
}

export interface Devotion {
  id: string;
  name: string;
  description: string;
  kingdom: KingdomName;
  bonus: { subAttribute: SubAttributeName; value: number };
  benefit: string;
  prerequisite?: Prerequisite;
}

// --- Step 5: Personality ---

export interface Personality {
  id: string;
  name: string;
  description: string;
  bonus: { subAttribute: SubAttributeName; value: number };
}

// --- Step 6: Birth Sign ---

export interface BirthSign {
  id: string;
  name: string;
  rollRange: [number, number];
  description: string;
  effects: {
    type: 'sub-attribute_bonus' | 'skill_proficiency';
    subAttribute?: SubAttributeName;
    value?: number;
    skillTier?: 'General' | 'Advanced'; // For Apprentice/Journeyman
    skillId?: string; // For specific skill choices
  }[];
}
