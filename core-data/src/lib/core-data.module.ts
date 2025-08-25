import { Module } from '@nestjs/common';
import { DataAccessService } from './data-access.service';

@Module({
  providers: [DataAccessService],
  exports: [DataAccessService],
})
export class CoreDataModule {}
