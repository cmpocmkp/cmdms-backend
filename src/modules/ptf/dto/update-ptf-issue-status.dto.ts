import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IssueStatus } from '../../../common/enums';

export class UpdatePtfIssueStatusDto {
    @ApiProperty({ enum: IssueStatus })
    @IsEnum(IssueStatus)
    @IsNotEmpty()
    status: IssueStatus;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    remarks?: string;
}
