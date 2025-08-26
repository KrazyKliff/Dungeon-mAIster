import { Module } from '@nestjs/common';
import { DataAccessService } from './data-access.service';
import { RulesProvider } from './rules-provider.service';

@Module({
  providers: [DataAccessService, RulesProvider],
  exports: [DataAccessService, RulesProvider],
})
export class CoreDataModule {}
