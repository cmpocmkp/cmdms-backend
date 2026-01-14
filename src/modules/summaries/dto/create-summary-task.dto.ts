import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSummaryTaskDto {
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
    @IsDateString()
    @IsOptional()
    timeline?: string;

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    deadline?: string;
}
