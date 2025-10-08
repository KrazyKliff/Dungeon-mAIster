import {
  Character,
  PrimaryAttributeName,
  SubAttributeName,
  Career,
  LifeEvent,
  Origin,
  Devotion,
  SpeciesFeature,
  BirthSign,
  Item,
} from '@dungeon-maister/data-models';
import { InventoryService } from './inventory.service';

/** Helper to calculate a sub-attribute's modifier. */
function getSubAttributeModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Recalculates all of a character's derived stats.
 * This should be called any time a sub-attribute or a bonus changes.
 */
function recalculateDerivedStats(character: Character): Character {
  const { subAttributes, primaryAttributes, level } = character;

  // Recalculate Primary Attributes
  primaryAttributes.STR.score = (subAttributes['Brute Force'].score + subAttributes['Endurance'].score) / 2;
  primaryAttributes.AGI.score = (subAttributes['Dexterity'].score + subAttributes['Reflexes'].score) / 2;
  primaryAttributes.VIG.score = (subAttributes['Resilience'].score + subAttributes['Constitution'].score) / 2;
  primaryAttributes.INT.score = (subAttributes['Logic'].score + subAttributes['Knowledge'].score) / 2;
  primaryAttributes.INS.score = (subAttributes['Perception'].score + subAttributes['Intuition'].score) / 2;
  primaryAttributes.PRE.score = (subAttributes['Charm'].score + subAttributes['Willpower'].score) / 2;

  // Recalculate Modifiers
  for (const key in primaryAttributes) {
    const attr = primaryAttributes[key as PrimaryAttributeName];
    attr.modifier = Math.floor((attr.score - 10) / 2);
  }

  // Recalculate Derived Stats
  character.hp = {
    max: 10 + (getSubAttributeModifier(subAttributes['Resilience'].score) * level) + character.speciesHpBonus,
    current: 10 + (getSubAttributeModifier(subAttributes['Resilience'].score) * level) + character.speciesHpBonus,
  };
  character.sp = {
    max: 5 + (getSubAttributeModifier(subAttributes['Endurance'].score) * level) + character.speciesSpBonus,
    current: 5 + (getSubAttributeModifier(subAttributes['Endurance'].score) * level) + character.speciesSpBonus,
  };
  character.ep = {
    max: 5 + ((getSubAttributeModifier(subAttributes['Logic'].score) + getSubAttributeModifier(subAttributes['Willpower'].score)) * level) + character.speciesEpBonus,
    current: 5 + ((getSubAttributeModifier(subAttributes['Logic'].score) + getSubAttributeModifier(subAttributes['Willpower'].score)) * level) + character.speciesEpBonus,
  };
  character.defense = 10 + getSubAttributeModifier(subAttributes['Reflexes'].score);
  character.movementSpeed = 30 + (getSubAttributeModifier(subAttributes['Reflexes'].score) * 5) + character.speciesSpeedBonus;
  character.carryingCapacity = (subAttributes['Brute Force'].score * 5) + character.speciesCarryingBonus;
  character.initiative = getSubAttributeModifier(subAttributes['Reflexes'].score);

  return character;
}

/**
 * Creates a new, baseline character with default starting stats.
 */
export function createBaselineCharacter(id: string, name: string): Character {
  const subAttributes: Character['subAttributes'] = {
    'Brute Force': { name: 'Brute Force', score: 8 }, 'Endurance': { name: 'Endurance', score: 8 },
    'Dexterity': { name: 'Dexterity', score: 8 }, 'Reflexes': { name: 'Reflexes', score: 8 },
    'Resilience': { name: 'Resilience', score: 8 }, 'Constitution': { name: 'Constitution', score: 8 },
    'Logic': { name: 'Logic', score: 8 }, 'Knowledge': { name: 'Knowledge', score: 8 },
    'Perception': { name: 'Perception', score: 8 }, 'Intuition': { name: 'Intuition', score: 8 },
    'Charm': { name: 'Charm', score: 8 }, 'Willpower': { name: 'Willpower', score: 8 },
  };

  const primaryAttributes: Character['primaryAttributes'] = {
    STR: { name: 'STR', score: 0, modifier: 0 }, AGI: { name: 'AGI', score: 0, modifier: 0 },
    VIG: { name: 'VIG', score: 0, modifier: 0 }, INT: { name: 'INT', score: 0, modifier: 0 },
    INS: { name: 'INS', score: 0, modifier: 0 }, PRE: { name: 'PRE', score: 0, modifier: 0 },
  };
  
  const character: Character = {
    id, name, subAttributes, primaryAttributes,
    skills: [], level: 1, hp: { max: 0, current: 0 }, sp: { max: 0, current: 0 },
    ep: { max: 0, current: 0 }, defense: 0, movementSpeed: 0, initiative: 0, carryingCapacity: 0,
    speciesHpBonus: 0, speciesSpBonus: 0, speciesEpBonus: 0, speciesSpeedBonus: 0, speciesCarryingBonus: 0,
    inventory: InventoryService.createEmptyInventory(),
  };

  return recalculateDerivedStats(character);
}

function addSkill(character: Character, skillId: string) {
    if (!character.skills.find(s => s.id === skillId)) {
      character.skills.push({ id: skillId, masteryTier: 1 });
    }
}

export function applySpeciesFeature(character: Character, feature: SpeciesFeature): Character {
    feature.effects.forEach(effect => {
        if (effect.type === 'sub-attribute_bonus' && effect.subAttribute && effect.value) {
            character.subAttributes[effect.subAttribute].score += effect.value;
        } else if (effect.type === 'derived_stat_bonus' && effect.derivedStat && effect.value) {
            switch (effect.derivedStat) {
                case 'hp': character.speciesHpBonus += effect.value; break;
                case 'sp': character.speciesSpBonus += effect.value; break;
                case 'ep': character.speciesEpBonus += effect.value; break;
                case 'speed': character.speciesSpeedBonus += effect.value; break;
                case 'carrying': character.speciesCarryingBonus += effect.value; break;
            }
        }
    });
    return recalculateDerivedStats(character);
}

export function applyOrigin(character: Character, origin: Origin): Character {
    origin.skillProficiencies.forEach(skillId => addSkill(character, skillId));
    return character;
}

export function applyLifeEvent(character: Character, lifeEvent: LifeEvent): Character {
    lifeEvent.statModifiers.forEach(mod => {
        character.subAttributes[mod.subAttribute].score += mod.value;
    });
    lifeEvent.skillProficiencies.forEach(skillId => addSkill(character, skillId));
    return recalculateDerivedStats(character);
}

export function applyCareer(character: Character, career: Career): Character {
    career.statModifiers.forEach(mod => {
        character.subAttributes[mod.subAttribute].score += mod.value;
    });
    career.skillProficiencies.forEach(skillId => addSkill(character, skillId));
    career.startingGear.forEach(itemName => {
      const newItem: Item = {
        id: itemName.toLowerCase().replace(/\s/g, '_'),
        name: itemName,
        description: 'Starting equipment.',
      };
      character.inventory.items.push(newItem);
    });
    return recalculateDerivedStats(character);
}

export function applyDevotion(character: Character, devotion: Devotion): Character {
    character.subAttributes[devotion.bonus.subAttribute].score += devotion.bonus.value;
    return recalculateDerivedStats(character);
}

export function applyBirthSign(character: Character, birthSign: BirthSign): Character {
    birthSign.effects.forEach(effect => {
        if (effect.type === 'sub-attribute_bonus' && effect.subAttribute && effect.value) {
            character.subAttributes[effect.subAttribute].score += effect.value;
        }
    });
    return recalculateDerivedStats(character);
}
