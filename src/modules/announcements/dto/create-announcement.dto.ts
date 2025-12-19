import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AnnouncementDetailDto {
  @ApiProperty({
    description: 'Detail title',
    example: 'Health Initiative Implementation',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detail description',
    example: 'Detailed implementation plan for the new health initiative',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Timeline for this detail',
    example: '2024-02-15T00:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  timeline: string;

  @ApiPropertyOptional({
    description: 'Main department responsible for this detail',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  mainDepartmentId?: number;

  @ApiPropertyOptional({
    description: 'Other departments involved in this detail',
    example: [2, 3],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  otherDepartmentIds?: number[];
}

export class CreateAnnouncementDto {
  @ApiProperty({
    description: 'Announcement title',
    example: 'New Health Policy Announcement',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Announcement date',
    example: '2024-01-15T10:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({
    description: 'Announcement type',
    example: 'policy',
    enum: ['press_release', 'policy', 'event', 'public', 'emergency'],
  })
  @IsString()
  @IsOptional()
  @IsEnum(['press_release', 'policy', 'event', 'public', 'emergency'])
  type?: string;

  @ApiProperty({
    description: 'Announcement description',
    example: 'Comprehensive health policy reforms for better healthcare access',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Announcement priority level',
    example: 'high',
    enum: ['low', 'normal', 'high', 'urgent'],
  })
  @IsString()
  @IsOptional()
  @IsEnum(['low', 'normal', 'high', 'urgent'])
  priority?: string;

  @ApiPropertyOptional({
    description: 'District ID where announcement applies',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  districtId?: number;

  @ApiPropertyOptional({
    description: 'Detailed breakdown of the announcement',
    type: [AnnouncementDetailDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnnouncementDetailDto)
  @IsOptional()
  details?: AnnouncementDetailDto[];
}

