import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBoardMemberDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    role?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    designation?: string;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    tenureStart?: string;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    tenureEnd?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    status?: string;
}
