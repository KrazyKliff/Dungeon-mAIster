import { PrimaryAttribute, SubAttribute, SubAttributeName, PrimaryAttributeName } from './attributes.model';
import { Skill } from './skills.model';

// The main interface for any character in the game
export interface Character {
  id: string;
  name: string;

  // Attributes
  subAttributes: Record<SubAttributeName, SubAttribute>;
  primaryAttributes: Record<PrimaryAttributeName, PrimaryAttribute>;

  // Skills
  skills: Skill[];

  // Derived Stats from the briefing
  level: number;
  hp: { current: number; max: number; };
  sp: { current: number; max: number; }; // Stamina Points
  ep: { current: number; max: number; }; // Energy Points
  defense: number;
  movementSpeed: number;

  // Inventory (to be defined in more detail later)
  inventory: unknown[];
}
