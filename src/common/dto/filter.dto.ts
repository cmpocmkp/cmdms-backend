import { IsOptional, IsDateString, IsEnum, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DecisionStatus } from '../enums';

export class FilterDto {
  @ApiPropertyOptional({
    description: 'Filter by start date',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by end date',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by department ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  departmentId?: number;

  @ApiPropertyOptional({
    description: 'Filter by district ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  districtId?: number;

  @ApiPropertyOptional({
    description: 'Filter by decision status',
    enum: DecisionStatus,
    example: DecisionStatus.ON_TARGET,
  })
  @IsOptional()
  @IsEnum(DecisionStatus)
  status?: DecisionStatus;

  @ApiPropertyOptional({
    description: 'Search keyword for filtering',
    example: 'urgent',
  })
  @IsOptional()
  @IsString()
  keyword?: string;
}

