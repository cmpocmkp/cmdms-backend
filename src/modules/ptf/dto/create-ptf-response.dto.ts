import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePtfResponseDto {
    @ApiProperty({ example: 'Action taken regarding...' })
    @IsString()
    @IsNotEmpty()
    response: string;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    departmentId?: number;
}
