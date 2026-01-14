import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateSummaryTaskDto } from './create-summary-task.dto';

export class CreateSummaryDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    referenceNumber: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    subject: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsDateString()
    date: string;

    @ApiProperty()
    @IsNumber()
    initiatorDepartmentId: number;

    @ApiProperty({ required: false, enum: ['low', 'medium', 'high'] })
    @IsEnum(['low', 'medium', 'high'])
    @IsOptional()
    priority?: string;

    @ApiProperty({ required: false, type: [Number] })
    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    departmentIds?: number[];

    @ApiProperty({ required: false, type: [CreateSummaryTaskDto] })
    @IsArray()
    @IsOptional()
    @Type(() => CreateSummaryTaskDto)
    tasks?: CreateSummaryTaskDto[];
}
