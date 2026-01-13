import { PartialType } from '@nestjs/swagger';
import { CreateKhushhalTaskDto } from './create-khushhal-task.dto';

export class UpdateKhushhalTaskDto extends PartialType(CreateKhushhalTaskDto) { }
