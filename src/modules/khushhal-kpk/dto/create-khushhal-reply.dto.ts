import { IsString, IsOptional, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateKhushhalReplyDto {
    @ApiProperty()
    @IsString()
    reply: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    departmentId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    attachments?: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isAdminReply?: boolean;
}
