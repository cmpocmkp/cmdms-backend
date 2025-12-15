import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';

export class CreatePublicDayDto {
  @ApiProperty({ description: 'Public day date', example: '2025-01-15' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({ description: 'Location', example: 'DC Office Peshawar' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: 'District ID', example: 1 })
  @IsInt()
  @IsOptional()
  districtId?: number;

  @ApiPropertyOptional({ description: 'Total applications received', example: 50, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  totalApplications?: number;

  @ApiPropertyOptional({ description: 'Number resolved on spot', example: 35, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  resolvedCount?: number;

  @ApiPropertyOptional({ description: 'Additional remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;
}

