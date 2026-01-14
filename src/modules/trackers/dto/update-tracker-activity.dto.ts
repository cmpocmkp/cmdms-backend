import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateTrackerActivityDto } from './create-tracker-activity.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateTrackerActivityDto extends PartialType(CreateTrackerActivityDto) {
    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    progress?: number;
}
