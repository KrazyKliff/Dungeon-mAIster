import { Module } from '@nestjs/common';
import { CoreDataModule } from '@dungeon-maister/core-data';
import { CharacterCreationGateway } from './character-creation/character-creation.gateway';
import { GameGateway } from './game/game.gateway';

@Module({
  imports: [CoreDataModule],
  providers: [CharacterCreationGateway, GameGateway],
})
export class AppModule {}
