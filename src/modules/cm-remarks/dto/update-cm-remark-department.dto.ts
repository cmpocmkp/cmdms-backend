import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsInt } from 'class-validator';
import { DecisionStatus } from '../../../common/enums';

export class UpdateCMRemarkDepartmentDto {
    @ApiPropertyOptional({ description: 'Status', enum: DecisionStatus })
    @IsEnum(DecisionStatus)
    @IsOptional()
    status?: DecisionStatus;

    @ApiPropertyOptional({ description: 'Department specific remarks' })
    @IsString()
    @IsOptional()
    remarks?: string;
}
