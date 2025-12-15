import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, IsEnum, IsArray } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @IsString()
  @IsOptional()
  @IsEnum(['low', 'normal', 'high', 'urgent'])
  priority?: string;

  @IsString()
  @IsOptional()
  taskableType?: string;

  @IsInt()
  @IsOptional()
  taskableId?: number;

  @IsInt()
  @IsOptional()
  assignedTo?: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  departmentIds?: number[];
}

