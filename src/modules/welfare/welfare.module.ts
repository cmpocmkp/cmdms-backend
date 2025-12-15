import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WelfareInitiative } from './entities/welfare-initiative.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WelfareInitiative])],
  exports: [TypeOrmModule],
})
export class WelfareModule {}

