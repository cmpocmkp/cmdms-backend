import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Department } from '../../departments/entities/department.entity';
import { SummaryTask } from './summary-task.entity';
import { SummaryReply } from './summary-reply.entity';

@Entity('summaries')
export class Summary extends AuditableEntity {
    @Column({ name: 'reference_number' })
    referenceNumber: string;

    @Column()
    subject: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'date' })
    date: string;

    @Column({ name: 'initiator_department_id' })
    initiatorDepartmentId: number;

    @Column({ default: 1 })
    status: number; // 1=Pending, 2=In-Progress, 3=Completed

    @Column({ default: 'medium' })
    priority: string;

    // Relations
    @ManyToOne(() => Department)
    @JoinColumn({ name: 'initiator_department_id' })
    initiatorDepartment: Department;

    @OneToMany(() => SummaryTask, (task) => task.summary)
    tasks: SummaryTask[];

    @OneToMany(() => SummaryReply, (reply) => reply.summary)
    replies: SummaryReply[];
}
