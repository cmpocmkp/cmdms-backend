import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CreateSenateMeetingDto {
  @ApiProperty({ description: 'University name', example: 'University of Peshawar' })
  @IsString()
  @IsNotEmpty()
  universityName: string;

  @ApiProperty({ description: 'Meeting date', example: '2025-01-15' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({ description: 'Meeting venue' })
  @IsString()
  @IsOptional()
  venue?: string;

  @ApiPropertyOptional({ description: 'Meeting number', example: 'S-2025-01' })
  @IsString()
  @IsOptional()
  meetingNumber?: string;

  @ApiPropertyOptional({ description: 'Attendees list' })
  @IsString()
  @IsOptional()
  attendees?: string;

  @ApiPropertyOptional({ description: 'Was quorum met?', default: true })
  @IsBoolean()
  @IsOptional()
  quorumMet?: boolean;
}

