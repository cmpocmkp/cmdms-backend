import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinutesService } from './minutes.service';
import { MinutesController } from './minutes.controller';
import { Minute } from './entities/minute.entity';
import { Reply } from './entities/reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Minute, Reply])],
  controllers: [MinutesController],
  providers: [MinutesService],
  exports: [MinutesService, TypeOrmModule],
})
export class MinutesModule {}

