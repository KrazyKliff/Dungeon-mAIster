import { Module } from '@nestjs/common';
import { WorldBootstrapperService } from './world-bootstrapper.service';
import { WorldStateService } from './world-state.service';
import { CoreDataModule } from '@dungeon-maister/core-data';

@Module({
  imports: [CoreDataModule],
  providers: [WorldBootstrapperService, WorldStateService],
  exports: [WorldBootstrapperService, WorldStateService],
})
export class GameSessionModule {}
