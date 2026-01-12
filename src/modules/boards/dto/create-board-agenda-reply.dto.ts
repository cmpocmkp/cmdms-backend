import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardAgendaReplyDto {
    @ApiProperty({ example: 'This point is valid and we agree.' })
    @IsString()
    @IsNotEmpty()
    reply: string;
}
