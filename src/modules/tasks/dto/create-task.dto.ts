import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Review budget proposal',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Review and approve the annual budget proposal for 2024',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Task due date',
    example: '2024-02-15T17:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @ApiPropertyOptional({
    description: 'Task priority level',
    example: 'high',
    enum: ['low', 'normal', 'high', 'urgent'],
  })
  @IsString()
  @IsOptional()
  @IsEnum(['low', 'normal', 'high', 'urgent'])
  priority?: string;

  @ApiPropertyOptional({
    description: 'Type of entity this task is related to',
    example: 'Meeting',
  })
  @IsString()
  @IsOptional()
  taskableType?: string;

  @ApiPropertyOptional({
    description: 'ID of the entity this task is related to',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  taskableId?: number;

  @ApiPropertyOptional({
    description: 'User ID this task is assigned to',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  assignedTo?: number;

  @ApiPropertyOptional({
    description: 'Array of department IDs this task involves',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  departmentIds?: number[];
}

