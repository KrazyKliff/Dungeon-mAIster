import { createBaselineCharacter } from './character-creation.service';
import { Character } from '@dungeon-maister/data-models';

describe('createBaselineCharacter', () => {
  it('should create a character with correct baseline stats according to the rules', () => {
    // Arrange: Define the inputs for our function
    const characterId = 'test-char-01';
    const characterName = 'Baseline Bob';

    // Act: Call the function we are testing
    const newCharacter: Character = createBaselineCharacter(
      characterId,
      characterName
    );

    // Assert: Check if the output matches our expectations
    
    // Check that Sub-Attributes start at a score of 8
    expect(newCharacter.subAttributes['Brute Force'].score).toBe(8);

    // Check that the modifier is calculated as (score - 10) / 2, rounded down
    expect(newCharacter.primaryAttributes['VIG'].modifier).toBe(-1); // Math.floor((8 - 10) / 2)

    // Check a Derived Stat (HP = 10 + (Vigor Modifier * Level))
    expect(newCharacter.hp.max).toBe(9); // 10 + (-1 * 1)
    
    // Check another Derived Stat (Defense = 10 + Agility Modifier)
    expect(newCharacter.defense).toBe(9); // 10 + (-1)
  });
});
