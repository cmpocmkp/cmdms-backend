import { PartialType } from '@nestjs/swagger';
import {
  CreateDepartmentDto,
  CreateProvinceDto,
  CreateDistrictDto,
  CreateDepartmentTypeDto,
} from './create-department.dto';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
export class UpdateProvinceDto extends PartialType(CreateProvinceDto) {}
export class UpdateDistrictDto extends PartialType(CreateDistrictDto) {}
export class UpdateDepartmentTypeDto extends PartialType(
  CreateDepartmentTypeDto,
) {}

