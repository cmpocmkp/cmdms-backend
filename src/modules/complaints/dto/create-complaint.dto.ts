import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, IsEnum } from 'class-validator';

export class CreateComplaintDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  detail: string;

  @IsString()
  @IsNotEmpty()
  applicantName: string;

  @IsString()
  @IsOptional()
  applicantContact?: string;

  @IsString()
  @IsOptional()
  applicantCnic?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @IsNotEmpty()
  departmentId: number;

  @IsInt()
  @IsOptional()
  districtId?: number;

  @IsString()
  @IsOptional()
  diaryNumber?: string;

  @IsDateString()
  @IsNotEmpty()
  timeline: string;

  @IsString()
  @IsOptional()
  @IsEnum(['low', 'normal', 'high', 'urgent'])
  priority?: string;
}

