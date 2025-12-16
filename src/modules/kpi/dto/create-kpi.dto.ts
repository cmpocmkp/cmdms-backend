import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { KpiFrequency } from '../../../common/enums';

export class CreateKpiDto {
  @ApiProperty({
    example: 'Vaccination Coverage',
    description: 'KPI name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Percentage of population vaccinated',
    description: 'KPI description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 1,
    description: 'Department ID',
  })
  @IsNumber()
  departmentId: number;

  @ApiProperty({
    example: KpiFrequency.MONTHLY,
    enum: KpiFrequency,
    description: 'Data collection frequency',
  })
  @IsEnum(KpiFrequency)
  frequency: KpiFrequency;

  @ApiProperty({
    example: 90,
    description: 'Target value',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  target?: number;

  @ApiProperty({
    example: 'percentage',
    description: 'Unit of measurement',
    required: false,
  })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({
    example: true,
    description: 'Is KPI active',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class SubmitKpiDataDto {
  @ApiProperty({
    example: '2025-01-01',
    description: 'Data date',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    example: 85.5,
    description: 'Actual value',
  })
  @IsNumber()
  value: number;

  @ApiProperty({
    example: 'Data submitted by health department',
    description: 'Remarks',
    required: false,
  })
  @IsString()
  @IsOptional()
  remarks?: string;
}

