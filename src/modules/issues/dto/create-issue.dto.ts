import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, IsEnum, IsArray } from 'class-validator';
import { IssueType } from '../../../common/enums';

export class CreateIssueDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(IssueType)
  @IsOptional()
  type?: IssueType;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsInt()
  @IsOptional()
  districtId?: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsDateString()
  @IsOptional()
  timeline?: string;

  @IsInt()
  @IsOptional()
  primaryDepartmentId?: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  supportingDepartments?: number[];
}

