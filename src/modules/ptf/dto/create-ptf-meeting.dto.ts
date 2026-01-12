import { IsString, IsNotEmpty, IsOptional, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePtfMeetingDto {
    @ApiProperty({ example: '2024-01-25' })
    @IsDateString()
    @IsNotEmpty()
    date: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    venue?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    attendees?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    decisions?: string;

    @ApiPropertyOptional({ type: [Number] })
    @IsArray()
    @IsOptional()
    issueIds?: number[];
}
