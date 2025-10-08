import { Module } from '@nestjs/common';
import { WorldBootstrapperService } from './world-bootstrapper.service';
import { WorldStateService } from './world-state.service';
import { CoreDataModule } from '@dungeon-maister/core-data';
import { GameStateService } from './game-state.service';
import { RuleEngineModule } from '@dungeon-maister/rule-engine';

@Module({
  imports: [CoreDataModule, RuleEngineModule],
  providers: [WorldBootstrapperService, WorldStateService, GameStateService],
  exports: [WorldBootstrapperService, WorldStateService, GameStateService],
})
export class GameSessionModule {}
