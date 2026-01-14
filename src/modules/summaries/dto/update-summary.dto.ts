import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateSummaryDto } from './create-summary.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateSummaryDto extends PartialType(CreateSummaryDto) {
    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    status?: number;
}
