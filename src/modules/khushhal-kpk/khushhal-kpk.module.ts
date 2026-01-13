import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KhushhalKpkService } from './khushhal-kpk.service';
import { KhushhalTask } from './entities/khushhal-task.entity';
import { KhushhalProgress } from './entities/khushhal-progress.entity';
import { KhushhalReply } from './entities/khushhal-reply.entity';
import { KhushhalTaskAssignment } from './entities/khushhal-task-assignment.entity';
import { KhushhalKpkController } from './khushhal-kpk.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KhushhalTask,
      KhushhalProgress,
      KhushhalReply,
      KhushhalTaskAssignment,
    ]),
  ],
  controllers: [KhushhalKpkController],
  providers: [KhushhalKpkService],
  exports: [KhushhalKpkService, TypeOrmModule],
})
export class KhushhalKpkModule { }
