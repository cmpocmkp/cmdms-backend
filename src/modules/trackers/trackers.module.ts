import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackersController } from './trackers.controller';
import { TrackersService } from './trackers.service';
import { Tracker } from './entities/tracker.entity';
import { TrackerActivity } from './entities/tracker-activity.entity';
import { TrackerReply } from './entities/tracker-reply.entity';
import { TrackerActivityReply } from './entities/tracker-activity-reply.entity';
import { Department } from '../departments/entities/department.entity';

@Module({
    imports: [TypeOrmModule.forFeature([
        Tracker,
        TrackerActivity,
        TrackerReply,
        TrackerActivityReply,
        Department
    ])],
    controllers: [TrackersController],
    providers: [TrackersService],
    exports: [TrackersService],
})
export class TrackersModule { }
