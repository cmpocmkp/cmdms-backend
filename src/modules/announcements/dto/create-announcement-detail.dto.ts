import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, IsArray } from 'class-validator';

export class CreateAnnouncementDetailDto {
    @ApiProperty({ description: 'Detail title', example: 'Implementation Phase 1' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Detailed description' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'Timeline date', example: '2025-02-15' })
    @IsDateString()
    @IsNotEmpty()
    timeline: string;

    @ApiProperty({ description: 'Main department ID', example: 1 })
    @IsInt()
    @IsNotEmpty()
    mainDepartmentId: number;

    @ApiPropertyOptional({ description: 'Other department IDs', example: [2, 3] })
    @IsArray()
    @IsOptional()
    otherDepartmentIds?: number[];

    @ApiPropertyOptional({ description: 'Attachment URLs' })
    @IsArray()
    @IsOptional()
    attachments?: string[];
}
