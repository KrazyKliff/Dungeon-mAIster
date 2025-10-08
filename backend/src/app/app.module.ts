import { Module } from '@nestjs/common';
import { CoreDataModule } from '@dungeon-maister/core-data';
import { CharacterCreationGateway } from './character-creation/character-creation.gateway';
import { GameGateway } from './game/game.gateway';
import { LlmOrchestratorService } from '@dungeon-maister/llm-orchestrator';
import { GameSessionModule } from '@dungeon-maister/game-session';
import { RuleEngineModule } from '@dungeon-maister/rule-engine';

@Module({
  imports: [CoreDataModule, GameSessionModule, RuleEngineModule],
  providers: [CharacterCreationGateway, GameGateway, LlmOrchestratorService],
})
export class AppModule {}
