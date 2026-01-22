import { Module } from '@nestjs/common';
import { DobController } from './DOBs.controller';

@Module({
  controllers: [DobController],
})
export class DobModule {}
