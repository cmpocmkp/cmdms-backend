import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IssueStatus } from '../../../common/enums';

export class CreatePtfIssueDto {
    @ApiProperty({ example: 'Lack of medicine in DHQ' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Detailed description of the issue...' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiPropertyOptional({ example: 'normal', enum: ['low', 'normal', 'high', 'urgent'] })
    @IsEnum(['low', 'normal', 'high', 'urgent'])
    @IsOptional()
    priority?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    source?: string;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    districtId?: number;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    date?: string;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    timeline?: string;

    @ApiPropertyOptional({ enum: IssueStatus, default: IssueStatus.NEW })
    @IsEnum(IssueStatus)
    @IsOptional()
    status?: IssueStatus;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    primaryDepartmentId?: number;

    @ApiPropertyOptional({ type: [Number] })
    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    supportingDepartments?: number[];

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    instructions?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    expectedOutcome?: string;
}
