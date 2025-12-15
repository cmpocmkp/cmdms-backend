import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt } from 'class-validator';

export class CreateSectorialMeetingDto {
  @ApiProperty({ description: 'Sector name', example: 'Education' })
  @IsString()
  @IsNotEmpty()
  sector: string;

  @ApiProperty({ description: 'Meeting date', example: '2025-01-15' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({ description: 'Meeting venue', example: 'CM Secretariat' })
  @IsString()
  @IsOptional()
  venue?: string;

  @ApiPropertyOptional({ description: 'Meeting number', example: 'SM-2025-01' })
  @IsString()
  @IsOptional()
  meetingNumber?: string;

  @ApiPropertyOptional({ description: 'Meeting subject' })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiPropertyOptional({ description: 'Participants list' })
  @IsString()
  @IsOptional()
  participants?: string;

  @ApiPropertyOptional({ description: 'Chairperson name' })
  @IsString()
  @IsOptional()
  chairperson?: string;

  @ApiProperty({ description: 'Department ID', example: 1 })
  @IsInt()
  @IsNotEmpty()
  departmentId: number;
}

