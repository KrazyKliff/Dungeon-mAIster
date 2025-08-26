import { PrimaryAttribute, SubAttribute, SubAttributeName, PrimaryAttributeName } from './attributes.model';
import { CharacterSkill } from './skills.model';

// The main interface for any character in the game
export interface Character {
  id: string;
  name: string;

  // Attributes
  subAttributes: Record<SubAttributeName, SubAttribute>;
  primaryAttributes: Record<PrimaryAttributeName, PrimaryAttribute>;

  // Skills
  skills: CharacterSkill[];

  // Derived Stats from the briefing
  level: number;
  hp: { current: number; max: number; };
  sp: { current: number; max: number; }; // Stamina Points
  ep: { current: number; max: number; }; // Energy Points
  defense: number;
  movementSpeed: number;
  initiative: number;
  carryingCapacity: number;

  // Bonuses from other sources (e.g., species)
  speciesHpBonus: number;
  speciesSpBonus: number;
  speciesEpBonus: number;
  speciesSpeedBonus: number;
  speciesCarryingBonus: number;

  // Inventory (to be defined in more detail later)
  inventory: unknown[];
}
