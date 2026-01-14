import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateSummaryTaskDto } from './create-summary-task.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateSummaryTaskDto extends PartialType(CreateSummaryTaskDto) {
    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    status?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    progress?: number;
}
