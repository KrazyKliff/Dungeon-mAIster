import { Injectable } from '@nestjs/common';
import { Location, updateLocationBlueprint } from '@dungeon-maister/core-data';
import { LlmOrchestratorService } from '@dungeon-maister/llm-orchestrator';

@Injectable()
export class WorldBootstrapperService {
  constructor(private readonly llmOrchestrator: LlmOrchestratorService) {}

  async bootstrapWorldLocations(): Promise<void> {
    console.log(
      '--- WORLD BOOTSTRAPPER: Starting Session-Zero World Weaving ---'
    );
    const keyLocations: Omit<Location, 'preGeneratedMapParameters'>[] = [
      {
        id: 'loc-001',
        name: 'Whispering Caverns',
        description: 'A dark, damp cave system.',
        biome: 'dungeon',
      },
    ];
    for (const location of keyLocations) {
      // Corrected console.log syntax
      console.log(`Bootstrapping location: ${location.name}...`);
      const mapParams = await this.llmOrchestrator.generateMapParameters();
      // const propParams =
      //   await this.llmOrchestrator.generateMapPropParameters(location.biome);
      const blueprint = { mapParams };
      updateLocationBlueprint(location.id, blueprint);
    }
    console.log(
      '--- WORLD BOOTSTRAPPER: World Weaving complete. Blueprints are cached. ---'
    );
  }
}
