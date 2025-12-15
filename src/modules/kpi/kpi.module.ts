import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KpiService } from './kpi.service';
import { Kpi } from './entities/kpi.entity';
import { KpiData } from './entities/kpi-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kpi, KpiData])],
  providers: [KpiService],
  exports: [KpiService, TypeOrmModule],
})
export class KpiModule {}

