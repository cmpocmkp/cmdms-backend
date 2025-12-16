import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';
import { Taggable } from './entities/taggable.entity';
import { TagsController } from './tags.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Taggable])],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService, TypeOrmModule],
})
export class TagsModule {}

