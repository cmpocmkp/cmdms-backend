import { IsNotEmpty, IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DecisionStatus } from '../../../common/enums';

export class CreateSectorialReplyDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty({ enum: DecisionStatus, default: DecisionStatus.ON_TARGET })
    @IsOptional()
    @IsEnum(DecisionStatus)
    status?: DecisionStatus;

    @ApiProperty({ type: [String], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    attachments?: string[];
}
