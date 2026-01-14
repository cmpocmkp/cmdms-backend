import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { TrackerActivity } from './tracker-activity.entity';
import { User } from '../../users/entities/user.entity';

@Entity('tracker_activity_replies')
export class TrackerActivityReply extends AuditableEntity {
    @Column({ name: 'activity_id' })
    activityId: number;

    @Column({ type: 'text' })
    content: string;

    @Column({ name: 'user_id' })
    userId: number;

    // Relations
    @ManyToOne(() => TrackerActivity, (activity) => activity.replies, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'activity_id' })
    activity: TrackerActivity;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
