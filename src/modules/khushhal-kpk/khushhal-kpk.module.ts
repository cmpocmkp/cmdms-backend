import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KhushhalKpkService } from './khushhal-kpk.service';
import { KhushhalTask } from './entities/khushhal-task.entity';
import { KhushhalProgress } from './entities/khushhal-progress.entity';
import { KhushhalReply } from './entities/khushhal-reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KhushhalTask, KhushhalProgress, KhushhalReply])],
  providers: [KhushhalKpkService],
  exports: [KhushhalKpkService, TypeOrmModule],
})
export class KhushhalKpkModule {}

