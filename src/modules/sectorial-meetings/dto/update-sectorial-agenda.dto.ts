import { PartialType } from '@nestjs/swagger';
import { CreateSectorialAgendaDto } from './create-sectorial-agenda.dto';

export class UpdateSectorialAgendaDto extends PartialType(CreateSectorialAgendaDto) { }
