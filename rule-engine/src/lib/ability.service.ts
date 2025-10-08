import { Injectable } from '@nestjs/common';
import { Character, GameState } from '@dungeon-maister/data-models';

@Injectable()
export class AbilityService {
  public useAbility(character: Character, abilityId: string, targetId: string | undefined, gameState: GameState): GameState {
    // TODO: Implement ability logic
    console.log(`Character ${character.name} used ability ${abilityId} on target ${targetId}`);
    return gameState;
  }
}
