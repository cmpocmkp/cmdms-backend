import { IsString, IsNotEmpty, IsDateString, IsOptional, IsArray, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDirectiveDto {
  @ApiProperty({
    description: 'Directive letter number/reference',
    example: 'CM/Dir/2024/001',
  })
  @IsString()
  @IsNotEmpty()
  letterNumber: string;

  @ApiProperty({
    description: 'Directive subject/title',
    example: 'Implementation of health reforms',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'Date when directive was issued',
    example: '2024-01-15T10:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  issueDate: string;

  @ApiProperty({
    description: 'Timeline for directive implementation',
    example: '2024-03-15T00:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  timeline: string;

  @ApiPropertyOptional({
    description: 'Additional comments or remarks',
    example: 'Urgent attention required',
  })
  @IsString()
  @IsOptional()
  comments?: string;

  @ApiProperty({
    description: 'Array of department IDs responsible for this directive',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  departments: number[];
}

