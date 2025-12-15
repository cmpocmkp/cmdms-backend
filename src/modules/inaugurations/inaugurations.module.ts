import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inauguration } from './entities/inauguration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inauguration])],
  exports: [TypeOrmModule],
})
export class InaugurationsModule {}

