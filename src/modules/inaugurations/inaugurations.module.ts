import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inauguration } from './entities/inauguration.entity';
import { InaugurationsService } from './inaugurations.service';
import { InaugurationsController } from './inaugurations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Inauguration])],
  controllers: [InaugurationsController],
  providers: [InaugurationsService],
  exports: [TypeOrmModule, InaugurationsService],
})
export class InaugurationsModule {}

