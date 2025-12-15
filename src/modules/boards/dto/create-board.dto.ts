import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['university', 'hospital', 'corporate', 'regulatory', 'advisory', 'district'])
  boardType: string;

  @IsInt()
  @IsOptional()
  parentDepartmentId?: number;

  @IsInt()
  @IsOptional()
  quorumRequirement?: number;

  @IsString()
  @IsOptional()
  @IsEnum(['monthly', 'quarterly', 'bi-annually', 'annually'])
  meetingFrequency?: string;
}

