import { PartialType } from '@nestjs/swagger';
import { CreateBoardActDto } from './create-board-act.dto';

export class UpdateBoardActDto extends PartialType(CreateBoardActDto) { }
