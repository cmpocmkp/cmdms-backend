import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Summary } from './summary.entity';
import { User } from '../../users/entities/user.entity';

@Entity('summary_replies')
export class SummaryReply extends AuditableEntity {
    @Column({ name: 'summary_id' })
    summaryId: number;

    @Column({ type: 'text' })
    content: string;

    @Column({ name: 'user_id' })
    userId: number;

    // Relations
    @ManyToOne(() => Summary, (summary) => summary.replies, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'summary_id' })
    summary: Summary;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
