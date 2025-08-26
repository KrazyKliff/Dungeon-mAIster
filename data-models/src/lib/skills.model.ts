import { SubAttributeName } from './attributes.model';

/**
 * The category of a skill, which often determines its source of power or general application.
 */
export type SkillCategory =
  | 'General'
  | 'Weapon'
  | 'Armor'
  | 'Martial Technique'
  | 'Psionic Discipline'
  | 'Arcane Prime'
  | 'Spirit Domain'
  | 'Expertise Field';

/**
 * The tier of a skill, representing its complexity and power level.
 * Tier 1: General skills, available to most characters.
 * Tier 2: Advanced skills, requiring dedicated training.
 * Tier 3: Specialized skills, representing true mastery.
 */
export type SkillTier = 1 | 2 | 3;

/**
 * Represents the definition of a skill, containing all its static data.
 * This information is loaded from content files.
 */
export interface SkillDefinition {
  id: string; // A unique identifier, e.g., 'athletics'
  name: string; // The display name, e.g., 'Athletics'
  description: string;
  category: SkillCategory;
  tier: SkillTier;
  governingSubAttribute: SubAttributeName;
  combatActions?: { name: string; description: string }[];
}

/**
 * Represents a skill that a character has learned.
 * This is what is stored on the character data model.
 */
export interface CharacterSkill {
  id:string; // Maps to a SkillDefinition's ID
  masteryTier: number; // The character's mastery level in this skill (1-10)
}
