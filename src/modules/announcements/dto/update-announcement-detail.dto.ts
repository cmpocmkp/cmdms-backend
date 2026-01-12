import { PartialType } from '@nestjs/swagger';
import { CreateAnnouncementDetailDto } from './create-announcement-detail.dto';

export class UpdateAnnouncementDetailDto extends PartialType(CreateAnnouncementDetailDto) { }
