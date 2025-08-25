import { Module } from '@nestjs/common';
import { WorldBootstrapperService } from './world-bootstrapper.service';

@Module({
  providers: [WorldBootstrapperService],
  exports: [WorldBootstrapperService],
})
export class GameSessionModule {}
