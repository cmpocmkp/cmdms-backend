import { PartialType } from '@nestjs/swagger';
import { CreateBoardAgendaDto } from './create-board-agenda.dto';

export class UpdateBoardAgendaDto extends PartialType(CreateBoardAgendaDto) { }
