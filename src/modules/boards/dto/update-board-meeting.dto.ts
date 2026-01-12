import { PartialType } from '@nestjs/swagger';
import { CreateBoardMeetingDto } from './create-board-meeting.dto';

export class UpdateBoardMeetingDto extends PartialType(CreateBoardMeetingDto) { }
