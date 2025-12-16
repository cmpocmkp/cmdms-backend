import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PtfService } from './ptf.service';
import { PtfIssue } from './entities/ptf-issue.entity';
import { PtfHistory } from './entities/ptf-history.entity';
import { PtfResponse } from './entities/ptf-response.entity';
import { PtfMeeting } from './entities/ptf-meeting.entity';
import { PtfController } from './ptf.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PtfIssue, PtfHistory, PtfResponse, PtfMeeting])],
  controllers: [PtfController],
  providers: [PtfService],
  exports: [PtfService, TypeOrmModule],
})
export class PtfModule {}

