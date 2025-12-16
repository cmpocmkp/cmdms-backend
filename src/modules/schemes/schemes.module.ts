import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchemesService } from './schemes.service';
import { AnnualScheme } from './entities/annual-scheme.entity';
import { SchemeCosting } from './entities/scheme-costing.entity';
import { SchemeBudget } from './entities/scheme-budget.entity';
import { SchemeExpenditure } from './entities/scheme-expenditure.entity';
import { SchemeRevision } from './entities/scheme-revision.entity';
import { SchemesController } from './schemes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([
    AnnualScheme,
    SchemeCosting,
    SchemeBudget,
    SchemeExpenditure,
    SchemeRevision,
  ])],
  controllers: [SchemesController],
  providers: [SchemesService],
  exports: [SchemesService, TypeOrmModule],
})
export class SchemesModule {}

