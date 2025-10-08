import { Injectable } from '@nestjs/common';
import { CoreDataService } from '@dungeon-maister/core-data';
import { GameState, MapParameters, Location, WorldEvent } from '@dungeon-maister/data-models';
import { askAI } from './llm.service';
import { Logger } from '@dungeon-maister/shared';

function extractJsonFromString(text: string): string | null {
  const jsonObjStart = text.indexOf('{');
  const jsonObjEnd = text.lastIndexOf('}');
  if (jsonObjStart !== -1 && jsonObjEnd !== -1 && jsonObjEnd > jsonObjStart) {
    return text.substring(jsonObjStart, jsonObjEnd + 1);
  }
  return null;
}

interface NarrativeContext {
  gameState: GameState;
  command: string;
  activeEvents: WorldEvent[];
  currentLocation: Location | null;
}

@Injectable()
export class LlmOrchestratorService {
  constructor(private readonly coreDataService: CoreDataService) {}

  public async generateNarrative(context: NarrativeContext): Promise<string> {
    try {
      const prompt = this.buildPrompt(context);
      const response = await askAI(prompt);
      
      // Validate response
      if (!response || response.trim().length === 0) {
        throw new Error('Empty response from LLM');
      }
      
      // Ensure response is reasonable length
      if (response.length > 5000) {
        return response.substring(0, 5000) + '...';
      }
      
      return response.trim();
    } catch (error) {
      Logger.error('Narrative generation failed:', error);
      return `The AI Game Master is currently unavailable. You attempt to "${context.command}" but the mystical forces seem disrupted. Please try again later.`;
    }
  }

  public async generateMapParameters(theme: string): Promise<MapParameters> {
    const prompt = `You are a game designer setting parameters for a level. The theme is "${theme}". Provide parameters for this level. - propDensity: 'low', 'medium', or 'high'. - propThemes: A JSON array of 3-5 thematic prop names (e.g., ["chest", "rubble"]). - enemyCount: A number between 2 and 5. Respond ONLY with a valid JSON object. Example: {"propDensity":"medium","propThemes":["rubble","broken cart","goblin skull"],"enemyCount":3}
`;
    try {
      const rawResponse = await askAI(prompt);
      Logger.info('--- RAW AI PARAMS RESPONSE START ---\n', rawResponse, '\n--- RAW AI PARAMS RESPONSE END ---'); // Replaced console.log
      const jsonString = extractJsonFromString(rawResponse);
      if (!jsonString) { throw new Error("No valid JSON object in AI response."); }
      const params = JSON.parse(jsonString);
      Logger.info('[ParamGen]: AI generated parameters:', params);
      return params;
    } catch (error) {
      Logger.error('[ParamGen]: Failed to get params from AI. Using defaults.', error);
      return { propDensity: 'low', propThemes: ['rock', 'pebble'], enemyCount: 1 };
    }
  }

  private buildPrompt(context: NarrativeContext): string {
    const { gameState, command, activeEvents, currentLocation } = context;
    const factions = this.coreDataService.getFactions();
    const beliefs = this.coreDataService.getBeliefs();
    const history = this.coreDataService.getHistory();

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

    if (activeEvents.length > 0) {
      prompt += '\n--- Active World Events ---\n';
      activeEvents.forEach(event => {
        prompt += `${event.name}: ${event.description}\n`;
      });
    }

    prompt += '\n--- Current Game State ---\n';
    if (currentLocation) {
      prompt += `The players are in a location called ${currentLocation.name}. ${currentLocation.description}\n`;
    } else {
      prompt += `The players are in a location called ${gameState.mapName}. ${gameState.mapDescription}\n`;
    }
    prompt += `The following characters are in the scene: ${Object.values(gameState.characters).map(c => c.name).join(', ')}\n`;
    prompt += `A player has just issued the following command: "${command}"\n`;
    prompt += `\nGenerate a. narrative response from the Game Master. The response should be engaging and move the story forward.`;

    return prompt;
  }
}
