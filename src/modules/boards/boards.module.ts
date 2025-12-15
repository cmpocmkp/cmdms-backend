import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entity';
import { BoardMember } from './entities/board-member.entity';
import { BoardMeeting } from './entities/board-meeting.entity';
import { BoardAgenda } from './entities/board-agenda.entity';
import { BoardAct } from './entities/board-act.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardMember, BoardMeeting, BoardAgenda, BoardAct])],
  providers: [BoardsService],
  exports: [BoardsService, TypeOrmModule],
})
export class BoardsModule {}

