import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, IsEnum } from 'class-validator';

export class CreateLetterDto {
  @ApiProperty({ description: 'Letter number', example: 'LTR-2025-001' })
  @IsString()
  @IsNotEmpty()
  letterNumber: string;

  @ApiProperty({ description: 'Letter subject', example: 'Budget Allocation Request' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ description: 'Letter content/body' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Letter date', example: '2025-01-15' })
  @IsDateString()
  @IsNotEmpty()
  letterDate: string;

  @ApiPropertyOptional({ description: 'From department ID', example: 1 })
  @IsInt()
  @IsOptional()
  fromDepartmentId?: number;

  @ApiPropertyOptional({ description: 'To department ID', example: 2 })
  @IsInt()
  @IsOptional()
  toDepartmentId?: number;

  @ApiPropertyOptional({ description: 'Reference type', example: 'minute' })
  @IsString()
  @IsOptional()
  referenceType?: string;

  @ApiPropertyOptional({ description: 'Reference ID', example: 123 })
  @IsInt()
  @IsOptional()
  referenceId?: number;

  @ApiProperty({ 
    description: 'Letter type', 
    enum: ['official', 'notice', 'circular', 'memo'],
    example: 'official'
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['official', 'notice', 'circular', 'memo'])
  type: string;
}

