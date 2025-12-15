import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional, IsInt, IsArray, IsBoolean } from 'class-validator';
import { DecisionStatus } from '../../../common/enums';

export class CreateMinuteDto {
  @IsInt()
  @IsNotEmpty()
  meetingId: number;

  @IsString()
  @IsOptional()
  heading?: string;

  @IsString()
  @IsNotEmpty()
  issues: string;

  @IsString()
  @IsNotEmpty()
  decisions: string;

  @IsString()
  @IsNotEmpty()
  responsibility: string;

  @IsDateString()
  @IsNotEmpty()
  timeline: string;

  @IsString()
  @IsOptional()
  progressHistory?: string;

  @IsString()
  @IsOptional()
  comments?: string;

  @IsString()
  @IsOptional()
  directions?: string;

  @IsEnum(DecisionStatus)
  @IsOptional()
  status?: DecisionStatus;

  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  departments: number[];

  @IsInt()
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;
}

