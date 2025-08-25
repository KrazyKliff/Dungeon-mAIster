import {
  Character,
  PrimaryAttributeName,
} from '@dungeon-maister/data-models';

/**
 * Creates a new, baseline character with default starting stats.
 * @param id A unique identifier for the character.
 * @param name The name of the character.
 * @returns A complete Character object.
 */
export function createBaselineCharacter(id: string, name: string): Character {
  const subAttributes: Character['subAttributes'] = {
    'Brute Force': { name: 'Brute Force', score: 8 },
    'Endurance': { name: 'Endurance', score: 8 },
    'Dexterity': { name: 'Dexterity', score: 8 },
    'Reflexes': { name: 'Reflexes', score: 8 },
    'Resilience': { name: 'Resilience', score: 8 },
    'Constitution': { name: 'Constitution', score: 8 },
    'Logic': { name: 'Logic', score: 8 },
    'Knowledge': { name: 'Knowledge', score: 8 },
    'Perception': { name: 'Perception', score: 8 },
    'Intuition': { name: 'Intuition', score: 8 },
    'Charm': { name: 'Charm', score: 8 },
    'Willpower': { name: 'Willpower', score: 8 },
  };

  const primaryAttributes: Character['primaryAttributes'] = {
    STR: { name: 'STR', score: (subAttributes['Brute Force'].score + subAttributes['Endurance'].score) / 2, modifier: 0 },
    AGI: { name: 'AGI', score: (subAttributes['Dexterity'].score + subAttributes['Reflexes'].score) / 2, modifier: 0 },
    VIG: { name: 'VIG', score: (subAttributes['Resilience'].score + subAttributes['Constitution'].score) / 2, modifier: 0 },
    INT: { name: 'INT', score: (subAttributes['Logic'].score + subAttributes['Knowledge'].score) / 2, modifier: 0 },
    INS: { name: 'INS', score: (subAttributes['Perception'].score + subAttributes['Intuition'].score) / 2, modifier: 0 },
    PRE: { name: 'PRE', score: (subAttributes['Charm'].score + subAttributes['Willpower'].score) / 2, modifier: 0 },
  };

  for (const key in primaryAttributes) {
    const attr = primaryAttributes[key as PrimaryAttributeName];
    attr.modifier = Math.floor((attr.score - 10) / 2);
  }
  
  const baselineCharacter: Character = {
    id,
    name,
    subAttributes,
    primaryAttributes,
    skills: [],
    level: 1,
    hp: { max: 10 + primaryAttributes.VIG.modifier * 1, current: 10 + primaryAttributes.VIG.modifier * 1 },
    sp: { max: 5 + primaryAttributes.VIG.modifier * 1, current: 5 + primaryAttributes.VIG.modifier * 1 },
    ep: { max: 5 + (primaryAttributes.INT.modifier + primaryAttributes.PRE.modifier) * 1, current: 5 + (primaryAttributes.INT.modifier + primaryAttributes.PRE.modifier) * 1 },
    defense: 10 + primaryAttributes.AGI.modifier,
    movementSpeed: 30 + primaryAttributes.AGI.modifier * 5,
    inventory: [],
  };

  return baselineCharacter;
}

