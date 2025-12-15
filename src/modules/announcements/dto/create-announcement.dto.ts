import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AnnouncementDetailDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  timeline: string;

  @IsInt()
  @IsOptional()
  mainDepartmentId?: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  otherDepartmentIds?: number[];
}

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  @IsEnum(['press_release', 'policy', 'event', 'public', 'emergency'])
  type?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  @IsEnum(['low', 'normal', 'high', 'urgent'])
  priority?: string;

  @IsInt()
  @IsOptional()
  districtId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnnouncementDetailDto)
  @IsOptional()
  details?: AnnouncementDetailDto[];
}

