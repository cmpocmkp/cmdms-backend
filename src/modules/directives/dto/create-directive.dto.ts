import { IsString, IsNotEmpty, IsDateString, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreateDirectiveDto {
  @IsString()
  @IsNotEmpty()
  letterNumber: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsDateString()
  @IsNotEmpty()
  issueDate: string;

  @IsDateString()
  @IsNotEmpty()
  timeline: string;

  @IsString()
  @IsOptional()
  comments?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  departments: number[];
}

