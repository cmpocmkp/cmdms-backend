import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackerActivityDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsNumber()
    departmentId: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    status?: number;
}
