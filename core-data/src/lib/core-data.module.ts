import { Module } from '@nestjs/common';
import { CoreDataService } from './core-data.service';

@Module({
  providers: [CoreDataService],
  exports: [CoreDataService],
})
export class CoreDataModule {}