import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AgendaItemDto {
  @ApiProperty({
    description: 'Agenda item description',
    example: 'Review quarterly financial reports',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Decision taken on this agenda item',
    example: 'Approved with minor revisions',
  })
  @IsString()
  @IsOptional()
  decision?: string;

  @ApiPropertyOptional({
    description: 'Timeline for implementation',
    example: '2024-03-15T00:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  timeline?: string;

  @ApiPropertyOptional({
    description: 'Primary department responsible',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  primaryDepartmentId?: number;

  @ApiPropertyOptional({
    description: 'Related departments involved',
    example: [2, 3],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  relatedDepartmentIds?: number[];
}

export class CreateBoardMeetingDto {
  @ApiProperty({
    description: 'Board ID this meeting belongs to',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  boardId: number;

  @ApiProperty({
    description: 'Meeting sequence/reference number',
    example: 'BM-2024-001',
  })
  @IsString()
  @IsNotEmpty()
  sequenceNumber: string;

  @ApiProperty({
    description: 'Meeting date and time',
    example: '2024-01-15T10:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({
    description: 'Meeting venue/location',
    example: 'Board Room, Main Building',
  })
  @IsString()
  @IsOptional()
  venue?: string;

  @ApiPropertyOptional({
    description: 'Type of board meeting',
    example: 'regular',
  })
  @IsString()
  @IsOptional()
  meetingType?: string;

  @ApiPropertyOptional({
    description: 'List of participants',
    example: 'Board members, department heads, secretary',
  })
  @IsString()
  @IsOptional()
  participants?: string;

  @ApiPropertyOptional({
    description: 'Department organizing the meeting',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  departmentId?: number;

  @ApiPropertyOptional({
    description: 'Agenda items for the meeting',
    type: [AgendaItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AgendaItemDto)
  @IsOptional()
  agendaItems?: AgendaItemDto[];
}

