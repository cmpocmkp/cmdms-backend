import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Tracker } from './tracker.entity';
import { Department } from '../../departments/entities/department.entity';
import { TrackerActivityReply } from './tracker-activity-reply.entity';

@Entity('tracker_activities')
export class TrackerActivity extends AuditableEntity {
    @Column({ name: 'tracker_id' })
    trackerId: number;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'department_id' })
    departmentId: number;

    @Column({ default: 1 })
    status: number;

    @Column({ default: 0 })
    progress: number;

    // Relations
    @ManyToOne(() => Tracker, (tracker) => tracker.activities, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tracker_id' })
    tracker: Tracker;

    @ManyToOne(() => Department)
    @JoinColumn({ name: 'department_id' })
    department: Department;

    @OneToMany(() => TrackerActivityReply, (reply) => reply.activity)
    replies: TrackerActivityReply[];
}
