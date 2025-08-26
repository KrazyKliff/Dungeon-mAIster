import {
  createBaselineCharacter,
  applyOrigin,
  applyLifeEvent,
  applyCareer,
} from './character-creation.service';
import { Character, Origin, LifeEvent, Career } from '@dungeon-maister/data-models';

describe('createBaselineCharacter', () => {
  it('should create a character with correct baseline stats according to the rules', () => {
    const newCharacter: Character = createBaselineCharacter('char-01', 'Baseline Bob');
    expect(newCharacter.subAttributes['Brute Force'].score).toBe(8);
    expect(newCharacter.primaryAttributes['VIG'].modifier).toBe(-1);
    expect(newCharacter.hp.max).toBe(9); // 10 + (getSubAttributeModifier(8) * 1) + 0
    expect(newCharacter.defense).toBe(9); // 10 + getSubAttributeModifier(8)
    expect(newCharacter.carryingCapacity).toBe(40); // 8 * 5 + 0
  });
});

describe('Life Path Functions', () => {
  let character: Character;

  beforeEach(() => {
    character = createBaselineCharacter('char-02', 'Life Path Larry');
  });

  it('should apply an origin and grant skills', () => {
    // Arrange
    const origin: Origin = {
      id: 'a_small_village',
      name: 'A Small Village',
      description: 'Grants proficiency in Persuasion and Labor.',
      skillProficiencies: ['persuasion', 'labor'],
    };

    // Act
    const updatedCharacter = applyOrigin(character, origin);

    // Assert
    expect(updatedCharacter.skills).toHaveLength(2);
    expect(updatedCharacter.skills.find(s => s.id === 'persuasion')).toBeDefined();
    expect(updatedCharacter.skills.find(s => s.id === 'labor')).toBeDefined();
  });

  it('should apply a life event and modify stats and skills', () => {
    // Arrange
    const lifeEvent: LifeEvent = {
      id: 'life_of_hardship',
      name: 'A Life of Hardship',
      description: '',
      statModifiers: [
        { subAttribute: 'Constitution', value: 2 },
        { subAttribute: 'Endurance', value: 1 },
        { subAttribute: 'Charm', value: -1 },
      ],
      skillProficiencies: ['fortitude', 'vigor'],
    };

    // Act
    const updatedCharacter = applyLifeEvent(character, lifeEvent);

    // Assert
    expect(updatedCharacter.subAttributes['Constitution'].score).toBe(10); // 8 + 2
    expect(updatedCharacter.subAttributes['Endurance'].score).toBe(9); // 8 + 1
    expect(updatedCharacter.subAttributes['Charm'].score).toBe(7); // 8 - 1
    expect(updatedCharacter.skills.find(s => s.id === 'fortitude')).toBeDefined();
    // Check if derived stats were recalculated
    expect(updatedCharacter.sp.max).toBe(4); // 5 + (getSubAttributeModifier(9) * 1) = 5 + (-1)
  });

  it('should apply a career and add gear', () => {
    // Arrange
    const career: Career = {
      id: 'city_guard',
      name: 'City Guard',
      description: '',
      statModifiers: [
        { subAttribute: 'Constitution', value: 1 },
        { subAttribute: 'Charm', value: 1 },
      ],
      skillProficiencies: ['guard', 'intimidation'],
      startingGear: ['Uniform', 'Cudgel or Spear', 'Manacles'],
    };

    // Act
    const updatedCharacter = applyCareer(character, career);
    
    // Assert
    expect(updatedCharacter.subAttributes['Constitution'].score).toBe(9); // 8 + 1
    expect(updatedCharacter.inventory).toHaveLength(3);
    expect(updatedCharacter.inventory[0]).toBe('Uniform');
  });

  it('should correctly accumulate bonuses from multiple life path choices', () => {
    // Arrange
    const origin: Origin = { id: 'o1', name: 'o1', description: '', skillProficiencies: ['skill1', 'skill2'] };
    const lifeEvent: LifeEvent = {
      id: 'le1', name: 'le1', description: '',
      statModifiers: [{ subAttribute: 'Brute Force', value: 2 }],
      skillProficiencies: ['skill3', 'skill4'],
    };
    const career: Career = {
      id: 'c1', name: 'c1', description: '',
      statModifiers: [{ subAttribute: 'Brute Force', value: 1 }],
      skillProficiencies: ['skill5', 'skill6'],
      startingGear: ['Item1'],
    };

    // Act
    let updatedCharacter = applyOrigin(character, origin);
    updatedCharacter = applyLifeEvent(updatedCharacter, lifeEvent);
    updatedCharacter = applyCareer(updatedCharacter, career);

    // Assert
    expect(updatedCharacter.subAttributes['Brute Force'].score).toBe(11); // 8 + 2 + 1
    expect(updatedCharacter.skills).toHaveLength(6);
    expect(updatedCharacter.inventory).toHaveLength(1);
    // Check derived stat based on final Brute Force score
    expect(updatedCharacter.carryingCapacity).toBe(55); // 11 * 5 + 0
  });
});
