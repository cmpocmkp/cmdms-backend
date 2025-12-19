import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional, IsInt, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DecisionStatus } from '../../../common/enums';

export class CreateMinuteDto {
  @ApiProperty({
    description: 'Meeting ID this minute belongs to',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  meetingId: number;

  @ApiPropertyOptional({
    description: 'Minute heading/title',
    example: 'Budget Allocation Discussion',
  })
  @IsString()
  @IsOptional()
  heading?: string;

  @ApiProperty({
    description: 'Issues discussed in the meeting',
    example: 'Budget shortfall in health department',
  })
  @IsString()
  @IsNotEmpty()
  issues: string;

  @ApiProperty({
    description: 'Decisions taken during the meeting',
    example: 'Approved additional budget allocation',
  })
  @IsString()
  @IsNotEmpty()
  decisions: string;

  @ApiProperty({
    description: 'Department/person responsible for implementation',
    example: 'Finance Department',
  })
  @IsString()
  @IsNotEmpty()
  responsibility: string;

  @ApiProperty({
    description: 'Timeline for implementation',
    example: '2024-03-15T00:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  timeline: string;

  @ApiPropertyOptional({
    description: 'Progress history of the decision',
    example: 'Initial review completed, awaiting final approval',
  })
  @IsString()
  @IsOptional()
  progressHistory?: string;

  @ApiPropertyOptional({
    description: 'Additional comments',
    example: 'Follow up meeting scheduled for next week',
  })
  @IsString()
  @IsOptional()
  comments?: string;

  @ApiPropertyOptional({
    description: 'Directions given by CM',
    example: 'Ensure implementation within specified timeline',
  })
  @IsString()
  @IsOptional()
  directions?: string;

  @ApiPropertyOptional({
    description: 'Current status of the decision',
    enum: DecisionStatus,
    example: DecisionStatus.ON_TARGET,
  })
  @IsEnum(DecisionStatus)
  @IsOptional()
  status?: DecisionStatus;

  @ApiProperty({
    description: 'Array of department IDs responsible for this decision',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  departments: number[];

  @ApiPropertyOptional({
    description: 'Sort order for displaying minutes',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Whether this minute is archived',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;
}

