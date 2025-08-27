import { Injectable } from '@nestjs/common';
import { DataAccessService } from '@dungeon-maister/core-data';
import { GameState } from '@dungeon-maister/data-models';
import { WorldStateService } from '@dungeon-maister/game-session';
import { askAI } from './llm.service';

@Injectable()
export class LlmOrchestratorService {
  constructor(
    private readonly dataAccess: DataAccessService,
    private readonly worldState: WorldStateService
  ) {}

  public async generateNarrative(gameState: GameState, command: string): Promise<string> {
    const prompt = this.buildPrompt(gameState, command);
    return await askAI(prompt);
  }

  private buildPrompt(gameState: GameState, command: string): string {
    const factions = this.dataAccess.getFactions();
    const beliefs = this.dataAccess.getBeliefs();
    const history = this.dataAccess.getHistory();

    let prompt = `The following is a scene from a tabletop roleplaying game.
The world is called The Shattered World. Here is some information about the world:
`;

    prompt += '\n--- Factions ---\n';
    factions.forEach(faction => {
      prompt += `${faction.name}: ${faction.description}\n`;
    });

    prompt += '\n--- Beliefs ---\n';
    beliefs.forEach(belief => {
      prompt += `${belief.name}: ${belief.description}\n`;
    });

    prompt += '\n--- History ---\n';
    history.forEach(event => {
      prompt += `${event.name}: ${event.description}\n`;
    });

    prompt += '\n--- Current Game State ---\n';
    prompt += `The players are in a location called ${gameState.map.name}. ${gameState.map.description}\n`;
    prompt += `The following characters are in the scene: ${Object.values(gameState.characters).map(c => c.name).join(', ')}\n`;
    prompt += `A player has just issued the following command: "${command}"\n`;
    prompt += `\nGenerate a narrative response from the Game Master. The response should be engaging and move the story forward.`;

    return prompt;
  }
}
