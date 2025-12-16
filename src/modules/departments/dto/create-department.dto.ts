import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({
    example: 'Health Department',
    description: 'Department name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Responsible for health services',
    description: 'Department description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 1,
    description: 'Department type ID',
  })
  @IsNumber()
  departmentTypeId: number;

  @ApiProperty({
    example: 1,
    description: 'Parent department ID',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @ApiProperty({
    example: 1,
    description: 'District ID',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  districtId?: number;

  @ApiProperty({
    example: true,
    description: 'Is department active',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class CreateProvinceDto {
  @ApiProperty({ example: 'Khyber Pakhtunkhwa' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'KPK', required: false })
  @IsString()
  @IsOptional()
  code?: string;
}

export class CreateDistrictDto {
  @ApiProperty({ example: 'Peshawar' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  provinceId: number;
}

export class CreateDepartmentTypeDto {
  @ApiProperty({ example: 'Provincial' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Provincial level department', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

