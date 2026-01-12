import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBoardActDto {
    @ApiProperty({ example: 'Act Title' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    actNumber?: string;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    date?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ default: 'pending', enum: ['pending', 'in_progress', 'implemented'] })
    @IsString()
    @IsOptional()
    implementationStatus?: string;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    responsibleDepartmentId?: number;
}
