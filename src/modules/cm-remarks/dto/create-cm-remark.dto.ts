import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional, IsArray, IsInt, IsEnum } from 'class-validator';

export class CreateCmRemarkDto {
  @ApiProperty({ description: 'Remark title', example: 'Infrastructure Development Priority' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Detailed remark', example: 'Focus on rural road development...' })
  @IsString()
  @IsNotEmpty()
  remark: string;

  @ApiProperty({ description: 'Date of remark', example: '2025-01-15' })
  @IsDateString()
  @IsNotEmpty()
  remarkDate: string;

  @ApiPropertyOptional({ description: 'Implementation timeline', example: '2025-06-30' })
  @IsDateString()
  @IsOptional()
  timeline?: string;

  @ApiPropertyOptional({ description: 'Priority level', enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' })
  @IsString()
  @IsOptional()
  @IsEnum(['low', 'normal', 'high', 'urgent'])
  priority?: string;

  @ApiPropertyOptional({ description: 'Context/background information' })
  @IsString()
  @IsOptional()
  context?: string;

  @ApiProperty({ description: 'Assigned department IDs', type: [Number], example: [1, 2, 3] })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  departmentIds: number[];
}

