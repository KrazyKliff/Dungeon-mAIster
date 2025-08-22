import { Character } from '@dungeon-maister/data-models';

/**
 * Performs a d20 skill check against a DC.
 * For now, it's a simple placeholder.
 */
export function performSkillCheck(character: Character, skillId: string, dc: number): boolean {
  const roll = Math.floor(Math.random() * 20) + 1;
  
  // In the future, we will add character skill ranks and attribute modifiers here.
  const total = roll; 
  
  console.log(`- Player rolled a ${roll}. DC was ${dc}.`);
  
  return total >= dc;
}
