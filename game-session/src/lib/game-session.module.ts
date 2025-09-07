import { Module } from '@nestjs/common';
import { WorldBootstrapperService } from './world-bootstrapper.service';
import { WorldStateService } from './world-state.service';
import { CoreDataModule } from '@dungeon-maister/core-data';
import { GameStateService } from './game-state.service';
import {
  worldEventServiceProvider,
  locationServiceProvider,
} from '@dungeon-maister/rule-engine';

@Module({
  imports: [CoreDataModule],
  providers: [
    WorldBootstrapperService,
    WorldStateService,
    GameStateService,
    worldEventServiceProvider,
    locationServiceProvider,
  ],
  exports: [
    WorldBootstrapperService,
    WorldStateService,
    GameStateService,
    worldEventServiceProvider,
    locationServiceProvider,
  ],
})
export class GameSessionModule {}
