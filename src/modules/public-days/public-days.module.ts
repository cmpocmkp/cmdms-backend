import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicDaysController } from './public-days.controller';
import { PublicDay } from './entities/public-day.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PublicDay])],
  controllers: [PublicDaysController],
  exports: [TypeOrmModule],
})
export class PublicDaysModule {}

