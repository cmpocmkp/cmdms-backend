import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Tracker } from './tracker.entity';
import { User } from '../../users/entities/user.entity';

@Entity('tracker_replies')
export class TrackerReply extends AuditableEntity {
    @Column({ name: 'tracker_id' })
    trackerId: number;

    @Column({ type: 'text' })
    content: string;

    @Column({ name: 'user_id' })
    userId: number;

    // Relations
    @ManyToOne(() => Tracker, (tracker) => tracker.replies, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tracker_id' })
    tracker: Tracker;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
