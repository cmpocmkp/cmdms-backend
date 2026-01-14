import { IsNumber, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTrackerDto {
    @ApiProperty({ type: [Number] })
    @IsArray()
    @IsNumber({}, { each: true })
    @IsNotEmpty()
    departmentIds: number[];
}
