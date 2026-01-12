import { PartialType } from '@nestjs/swagger';
import { CreateCmRemarkDto } from './create-cm-remark.dto';

export class UpdateCmRemarkDto extends PartialType(CreateCmRemarkDto) { }
