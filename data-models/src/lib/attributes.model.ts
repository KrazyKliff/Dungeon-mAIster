// A type for the 12 granular sub-attribute names for type safety
export type SubAttributeName =
  | 'Brute Force' | 'Endurance' | 'Dexterity' | 'Reflexes'
  | 'Resilience' | 'Constitution' | 'Logic' | 'Knowledge'
  | 'Perception' | 'Intuition' | 'Charm' | 'Willpower';

// A type for the 6 primary attribute names for type safety
export type PrimaryAttributeName = 'STR' | 'AGI' | 'VIG' | 'INT' | 'INS' | 'PRE';

// Interface for a single sub-attribute
export interface SubAttribute {
  name: SubAttributeName;
  score: number; // The value from 1 to 20
}

// Interface for a single primary attribute
export interface PrimaryAttribute {
  name: PrimaryAttributeName;
  score: number; // The calculated average score
  modifier: number; // The modifier, calculated as (score - 10) / 2
}
