import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Summary } from './summary.entity';
import { Department } from '../../departments/entities/department.entity';

@Entity('summary_tasks')
export class SummaryTask extends AuditableEntity {
    @Column({ name: 'summary_id' })
    summaryId: number;

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

    @Column({ type: 'date', nullable: true })
    timeline: string;

    @Column({ type: 'date', nullable: true })
    deadline: string;

    // Relations
    @ManyToOne(() => Summary, (summary) => summary.tasks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'summary_id' })
    summary: Summary;

    @ManyToOne(() => Department)
    @JoinColumn({ name: 'department_id' })
    department: Department;
}
