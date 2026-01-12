import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsEnum, IsOptional, IsArray } from 'class-validator';
import { DecisionStatus } from '../../../common/enums';

export class CreateCMRemarkResponseDto {
    @ApiProperty({ description: 'Response content', example: 'We are working on this.' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ description: 'Status', enum: DecisionStatus, example: DecisionStatus.ONGOING })
    @IsEnum(DecisionStatus)
    @IsNotEmpty()
    status: DecisionStatus;

    @ApiProperty({ description: 'Department ID', example: 1 })
    @IsInt()
    @IsNotEmpty()
    departmentId: number;

    @ApiPropertyOptional({ description: 'Attachment URLs' })
    @IsArray()
    @IsOptional()
    attachments?: string[];
}
