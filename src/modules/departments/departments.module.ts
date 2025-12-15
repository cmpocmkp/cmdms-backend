import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { DepartmentType } from './entities/department-type.entity';
import { District } from './entities/district.entity';
import { Province } from './entities/province.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Department, DepartmentType, District, Province])],
  exports: [TypeOrmModule],
})
export class DepartmentsModule {}

