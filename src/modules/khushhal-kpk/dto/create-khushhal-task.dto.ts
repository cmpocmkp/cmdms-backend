import { IsString, IsOptional, IsEnum, IsDateString, IsArray, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DecisionStatus } from '../../../common/enums';

export class CreateKhushhalTaskDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    subjectTasks?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    progressSoFar?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    expectedOutcomes?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    timelineNote?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    timelineDate?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    actionByNote?: string;

    @ApiPropertyOptional({ enum: DecisionStatus, default: DecisionStatus.ON_TARGET })
    @IsOptional()
    @IsEnum(DecisionStatus)
    status?: DecisionStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    departmentIds?: number[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isArchived?: boolean;
}
