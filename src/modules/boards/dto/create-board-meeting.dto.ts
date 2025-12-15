import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AgendaItemDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  decision?: string;

  @IsDateString()
  @IsOptional()
  timeline?: string;

  @IsInt()
  @IsOptional()
  primaryDepartmentId?: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  relatedDepartmentIds?: number[];
}

export class CreateBoardMeetingDto {
  @IsInt()
  @IsNotEmpty()
  boardId: number;

  @IsString()
  @IsNotEmpty()
  sequenceNumber: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  venue?: string;

  @IsString()
  @IsOptional()
  meetingType?: string;

  @IsString()
  @IsOptional()
  participants?: string;

  @IsInt()
  @IsOptional()
  departmentId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AgendaItemDto)
  @IsOptional()
  agendaItems?: AgendaItemDto[];
}

