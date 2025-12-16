import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WelfareInitiative } from './entities/welfare-initiative.entity';
import { WelfareService } from './welfare.service';
import { WelfareController } from './welfare.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WelfareInitiative])],
  controllers: [WelfareController],
  providers: [WelfareService],
  exports: [TypeOrmModule, WelfareService],
})
export class WelfareModule {}

