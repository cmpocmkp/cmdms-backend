import { PartialType } from '@nestjs/swagger';
import { CreatePtfMeetingDto } from './create-ptf-meeting.dto';

export class UpdatePtfMeetingDto extends PartialType(CreatePtfMeetingDto) { }
