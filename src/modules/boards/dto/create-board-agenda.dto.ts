import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DecisionStatus } from '../../../common/enums';

export class CreateBoardAgendaDto {
    @ApiProperty({ example: 'Discussion on budget' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    decision?: string;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    timeline?: string;

    @ApiPropertyOptional({ enum: DecisionStatus, default: DecisionStatus.ON_TARGET })
    @IsEnum(DecisionStatus)
    @IsOptional()
    status?: DecisionStatus;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    highlights?: string;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    primaryDepartmentId?: number;

    @ApiPropertyOptional({ type: [Number] })
    @IsArray()
    @IsOptional()
    relatedDepartmentIds?: number[];

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    comments?: string;

    @ApiPropertyOptional()
    @IsArray()
    @IsOptional()
    attachments?: string[];
}
