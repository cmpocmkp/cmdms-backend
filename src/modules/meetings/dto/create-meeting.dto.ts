import { IsString, IsNotEmpty, IsDateString, IsInt, IsOptional, IsArray, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMeetingDto {
  @ApiProperty({
    description: 'Meeting subject/title',
    example: 'Budget Review Meeting',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'Meeting date and time',
    example: '2024-01-15T10:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  meetingDate: string;

  @ApiPropertyOptional({
    description: 'Meeting venue/location',
    example: 'CM Secretariat, Peshawar',
  })
  @IsString()
  @IsOptional()
  venue?: string;

  @ApiProperty({
    description: 'Department ID organizing the meeting',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  departmentId: number;

  @ApiProperty({
    description: 'Meeting type ID',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  meetingTypeId: number;

  @ApiPropertyOptional({
    description: 'Meeting serial/reference number',
    example: 'CM/MTG/2024/001',
  })
  @IsString()
  @IsOptional()
  serialNumber?: string;

  @ApiPropertyOptional({
    description: 'List of participants',
    example: 'CM, Secretaries, Advisors',
  })
  @IsString()
  @IsOptional()
  participants?: string;

  @ApiPropertyOptional({
    description: 'Array of department IDs involved',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  departments?: number[];

  @ApiPropertyOptional({
    description: 'Meeting status',
    example: 'upcoming',
    enum: ['upcoming', 'held', 'cancelled'],
  })
  @IsString()
  @IsOptional()
  @IsEnum(['upcoming', 'held', 'cancelled'])
  status?: string;
}

