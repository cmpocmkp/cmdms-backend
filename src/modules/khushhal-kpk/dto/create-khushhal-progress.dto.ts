import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { KhushhalProgressStatus, KhushhalProgressType } from '../../../common/enums';

export class CreateKhushhalProgressDto {
    @ApiProperty()
    @IsString()
    description: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    date?: string;

    @ApiPropertyOptional({ enum: KhushhalProgressType })
    @IsOptional()
    @IsEnum(KhushhalProgressType)
    type?: KhushhalProgressType;

    @ApiPropertyOptional({ enum: KhushhalProgressStatus })
    @IsOptional()
    @IsEnum(KhushhalProgressStatus)
    status?: KhushhalProgressStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    metrics?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    departmentId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    attachments?: string[];
}
