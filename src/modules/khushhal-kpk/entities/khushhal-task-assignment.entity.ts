import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { KhushhalTask } from './khushhal-task.entity';
import { Department } from '../../departments/entities/department.entity';
import { DecisionStatus } from '../../../common/enums';

@Entity('khushhal_task_assignments')
export class KhushhalTaskAssignment extends BaseEntity {
    @Column({ name: 'khushhal_task_id' })
    khushhalTaskId: number;

    @Column({ name: 'department_id' })
    departmentId: number;

    @Column({ type: 'int', default: DecisionStatus.ON_TARGET })
    status: DecisionStatus;

    // Relations
    @ManyToOne(() => KhushhalTask, (task) => task.assignments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'khushhal_task_id' })
    khushhalTask: KhushhalTask;

    @ManyToOne(() => Department)
    @JoinColumn({ name: 'department_id' })
    department: Department;
}
