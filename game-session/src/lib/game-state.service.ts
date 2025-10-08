import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  GameState,
  Character,
} from '@dungeon-maister/data-models';
import {
  generateMap,
  startCombat as startCombatRule,
  nextTurn as nextTurnRule,
} from '@dungeon-maister/rule-engine';
import { DatabaseService } from '@dungeon-maister/database';

@Injectable()
export class GameStateService implements OnModuleDestroy {
  private gameState: GameState | null = null;
  private sessionId: string | null = null;
  private databaseService: DatabaseService;

  constructor() {
    // In a real NestJS app, DatabaseService would be injected.
    // For now, we instantiate it directly.
    this.databaseService = new DatabaseService();
  }

  onModuleDestroy() {
    this.databaseService.close();
  }

  public getGameState(): GameState | null {
    return this.gameState;
  }

  public async updateGameState(newState: GameState): Promise<void> {
    this.gameState = newState;
    await this.saveGameState();
  }

  private _createInitialGameState(characters: Character[]): GameState {
    const { map, props } = generateMap(20, 15, {
      propDensity: 'medium',
      propThemes: ['ancient', 'ruined'],
      enemyCount: 5,
    });

    const entities = characters.map((character, index) => {
      // Simple placement logic, find first available floor tile
      let startPos = { x: 1 + index, y: 1 };
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

    return {
      map,
      mapName: 'A Forgotten Goblin Outpost',
      mapDescription: 'A dark, damp cave littered with bones.',
      props,
      entities,
      characters: charactersRecord,
      selectedEntityId: null,
      combat: null,
    };
  }

  public async createNewGameSession(name: string, characters: Character[]): Promise<string> {
    const sessionId = `session-${Date.now()}`;
    const newGameState = this._createInitialGameState(characters);
    
    await this.databaseService.saveGameSession(sessionId, name, newGameState);
    
    this.sessionId = sessionId;
    this.gameState = newGameState;
    
    return sessionId;
  }

  public async loadGameSession(sessionId: string): Promise<GameState | null> {
    const loadedState = await this.databaseService.loadGameSession(sessionId);
    if (loadedState) {
      this.sessionId = sessionId;
      this.gameState = loadedState;
    }
    return loadedState;
  }

  public async saveGameState(): Promise<void> {
    if (this.sessionId && this.gameState) {
      await this.databaseService.saveGameSession(this.sessionId, 'Auto-save', this.gameState);
    }
  }

  public async startCombat() {
    if (!this.gameState) return;

    const combat = startCombatRule(
      this.gameState.entities,
      this.gameState.characters
    );

    await this.updateGameState({ ...this.gameState, combat });
  }

  public async nextTurn() {
    if (!this.gameState || !this.gameState.combat) return;

    const combat = nextTurnRule(this.gameState.combat);

    await this.updateGameState({ ...this.gameState, combat });
  }
}
