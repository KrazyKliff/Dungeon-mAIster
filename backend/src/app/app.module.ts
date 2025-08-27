import { Module } from '@nestjs/common';
import { CoreDataModule } from '@dungeon-maister/core-data';
import { CharacterCreationGateway } from './character-creation/character-creation.gateway';
import { GameGateway } from './game/game.gateway';
import { LlmOrchestratorService } from '@dungeon-maister/llm-orchestrator';
import { GameSessionModule } from '@dungeon-maister/game-session';

@Module({
  imports: [CoreDataModule, GameSessionModule],
  providers: [CharacterCreationGateway, GameGateway, LlmOrchestratorService],
})
export class AppModule {}
