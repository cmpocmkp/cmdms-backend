import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Department } from '../../departments/entities/department.entity';
import { TrackerActivity } from './tracker-activity.entity';
import { TrackerReply } from './tracker-reply.entity';

@Entity('trackers')
export class Tracker extends AuditableEntity {
    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column()
    type: string; // 'intervention', 'tracker', etc.

    @Column({ default: 1 })
    status: number;

    @Column({ default: 0 })
    progress: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    budget: number;

    @Column({ type: 'date', name: 'start_date', nullable: true })
    startDate: string;

    @Column({ type: 'date', name: 'end_date', nullable: true })
    endDate: string;

    // Relations
    @ManyToMany(() => Department)
    @JoinTable({
        name: 'tracker_departments',
        joinColumn: { name: 'tracker_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'department_id', referencedColumnName: 'id' },
    })
    departments: Department[];

    @OneToMany(() => TrackerActivity, (activity) => activity.tracker)
    activities: TrackerActivity[];

    @OneToMany(() => TrackerReply, (reply) => reply.tracker)
    replies: TrackerReply[];
}
