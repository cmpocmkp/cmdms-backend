import { IsOptional, IsDateString, IsEnum, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { DecisionStatus } from '../enums';

export class FilterDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  departmentId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  districtId?: number;

  @IsOptional()
  @IsEnum(DecisionStatus)
  status?: DecisionStatus;

  @IsOptional()
  @IsString()
  keyword?: string;
}

