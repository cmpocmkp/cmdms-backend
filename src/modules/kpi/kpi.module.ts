import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KpiService } from './kpi.service';
import { Kpi } from './entities/kpi.entity';
import { KpiData } from './entities/kpi-data.entity';
import { KpiController } from './kpi.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Kpi, KpiData])],
  controllers: [KpiController],
  providers: [KpiService],
  exports: [KpiService, TypeOrmModule],
})
export class KpiModule {}

