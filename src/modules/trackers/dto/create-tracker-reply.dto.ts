import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackerReplyDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ required: false, type: [String] })
    @IsArray()
    @IsOptional()
    attachments?: string[];
}
