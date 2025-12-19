import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IssueType } from '../../../common/enums';

export class CreateIssueDto {
  @ApiProperty({
    description: 'Issue title/subject',
    example: 'Healthcare access in rural areas',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed issue description',
    example: 'Limited healthcare facilities in rural districts affecting thousands of residents',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Type of issue',
    enum: IssueType,
    example: IssueType.PUBLIC_COMPLAINT,
  })
  @IsEnum(IssueType)
  @IsOptional()
  type?: IssueType;

  @ApiPropertyOptional({
    description: 'Issue priority level',
    example: 'high',
    enum: ['low', 'normal', 'high', 'urgent'],
  })
  @IsString()
  @IsOptional()
  priority?: string;

  @ApiPropertyOptional({
    description: 'Source of the issue report',
    example: 'Public complaint',
  })
  @IsString()
  @IsOptional()
  source?: string;

  @ApiPropertyOptional({
    description: 'District ID where the issue is located',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  districtId?: number;

  @ApiPropertyOptional({
    description: 'Date when the issue was reported',
    example: '2024-01-15T10:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({
    description: 'Timeline for issue resolution',
    example: '2024-03-15T00:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  timeline?: string;

  @ApiPropertyOptional({
    description: 'Primary department responsible for the issue',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  primaryDepartmentId?: number;

  @ApiPropertyOptional({
    description: 'Supporting departments involved in resolution',
    example: [2, 3],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  supportingDepartments?: number[];
}

