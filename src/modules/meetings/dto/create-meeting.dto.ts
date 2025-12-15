import { IsString, IsNotEmpty, IsDateString, IsInt, IsOptional, IsArray, IsEnum } from 'class-validator';

export class CreateMeetingDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsDateString()
  @IsNotEmpty()
  meetingDate: string;

  @IsString()
  @IsOptional()
  venue?: string;

  @IsInt()
  @IsNotEmpty()
  departmentId: number;

  @IsInt()
  @IsNotEmpty()
  meetingTypeId: number;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsString()
  @IsOptional()
  participants?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  departments?: number[];

  @IsString()
  @IsOptional()
  @IsEnum(['upcoming', 'held', 'cancelled'])
  status?: string;
}

