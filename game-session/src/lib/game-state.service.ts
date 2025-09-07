import { Injectable } from '@nestjs/common';
import {
  GameState,
  Character,
  MapData,
  MapProp,
} from '@dungeon-maister/data-models';
import {
  generateMap,
  startCombat as startCombatRule,
  nextTurn as nextTurnRule,
} from '@dungeon-maister/rule-engine';

@Injectable()
export class GameStateService {
  private gameState: GameState | null = null;

  public getGameState(): GameState | null {
    return this.gameState;
  }

  public updateGameState(newState: GameState): void {
    this.gameState = newState;
  }

  public createInitialGameState(characters: Character[]): GameState {
    // TODO: This logic is moved from CharacterCreationGateway.
    // We need a better way to get map parameters.
    const { map, props } = generateMap(20, 15, {
      propDensity: 'medium',
      propThemes: ['ancient', 'ruined'],
      enemyCount: 5,
    });

    const entities = characters.map((character) => {
      let startPos = { x: 0, y: 0 };
      for (let y = 0; y < map.length; y++) {
        const x = map[y].indexOf(0);
        if (x > -1) {
          startPos = { x, y };
          break;
        }
      }
      return {
        id: character.id,
        name: character.name,
        x: startPos.x,
        y: startPos.y,
        isPlayer: true,
      };
    });

    const charactersRecord = characters.reduce((acc, character) => {
      acc[character.id] = character;
      return acc;
    }, {} as Record<string, Character>);

    const newGameState: GameState = {
      map,
      mapName: 'A Forgotten Goblin Outpost',
      mapDescription:
        'A dark and damp cave, littered with the bones of unfortunate adventurers.',
      props,
      entities,
      characters: charactersRecord,
      selectedEntityId: null,
      combat: null,
    };

    this.gameState = newGameState;
    return newGameState;
  }

  public startCombat() {
    if (!this.gameState) {
      return;
    }

    const combat = startCombatRule(
      this.gameState.entities,
      this.gameState.characters
    );

    this.updateGameState({
      ...this.gameState,
      combat,
    });
  }

  public nextTurn() {
    if (!this.gameState || !this.gameState.combat) {
      return;
    }

    const combat = nextTurnRule(this.gameState.combat);

    this.updateGameState({
      ...this.gameState,
      combat,
    });
  }
}
