import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateTrackerActivityDto } from './create-tracker-activity.dto';

export class CreateTrackerDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    type: string;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    status?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    budget?: number; // In user details it shows number, not string

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    endDate?: string;

    @ApiProperty({ required: false, type: [Number] })
    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    departmentIds?: number[];

    @ApiProperty({ required: false, type: [CreateTrackerActivityDto] })
    @IsArray()
    @IsOptional()
    @Type(() => CreateTrackerActivityDto)
    activities?: CreateTrackerActivityDto[];
}
