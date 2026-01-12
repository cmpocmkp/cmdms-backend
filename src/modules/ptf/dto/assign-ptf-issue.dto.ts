import { IsNumber, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignPtfIssueDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    primaryDepartmentId: number;

    @ApiPropertyOptional({ type: [Number], example: [2, 3] })
    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    supportingDepartments?: number[];
}
