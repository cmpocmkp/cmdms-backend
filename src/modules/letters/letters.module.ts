import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LettersController } from './letters.controller';
import { Letter } from './entities/letter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Letter])],
  controllers: [LettersController],
  exports: [TypeOrmModule],
})
export class LettersModule {}

