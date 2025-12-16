import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { DepartmentType } from './entities/department-type.entity';
import { District } from './entities/district.entity';
import { Province } from './entities/province.entity';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Department, DepartmentType, District, Province])],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  exports: [TypeOrmModule, DepartmentsService],
})
export class DepartmentsModule {}

