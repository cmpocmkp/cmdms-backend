import { PartialType } from '@nestjs/swagger';
import { CreatePtfIssueDto } from './create-ptf-issue.dto';

export class UpdatePtfIssueDto extends PartialType(CreatePtfIssueDto) { }
