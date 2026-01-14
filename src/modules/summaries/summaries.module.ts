import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummariesController } from './summaries.controller';
import { SummariesService } from './summaries.service';
import { Summary } from './entities/summary.entity';
import { SummaryTask } from './entities/summary-task.entity';
import { SummaryReply } from './entities/summary-reply.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Summary, SummaryTask, SummaryReply])],
    controllers: [SummariesController],
    providers: [SummariesService],
    exports: [SummariesService],
})
export class SummariesModule { }
