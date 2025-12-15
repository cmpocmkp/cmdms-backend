import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectivesService } from './directives.service';
import { DirectivesController } from './directives.controller';
import { Directive } from './entities/directive.entity';
import { DirectiveResponse } from './entities/directive-response.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Directive, DirectiveResponse])],
  controllers: [DirectivesController],
  providers: [DirectivesService],
  exports: [DirectivesService, TypeOrmModule],
})
export class DirectivesModule {}

