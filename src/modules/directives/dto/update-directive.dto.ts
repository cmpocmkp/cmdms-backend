import { PartialType } from '@nestjs/swagger';
import { CreateDirectiveDto } from './create-directive.dto';

export class UpdateDirectiveDto extends PartialType(CreateDirectiveDto) {}

