import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateTrackerDto } from './create-tracker.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateTrackerDto extends PartialType(CreateTrackerDto) {
    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    progress?: number;
}
