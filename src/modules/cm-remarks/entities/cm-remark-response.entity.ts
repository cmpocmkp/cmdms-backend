import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { CmRemark } from './cm-remark.entity';
import { Department } from '../../departments/entities/department.entity';
import { User } from '../../users/entities/user.entity';
import { DecisionStatus } from '../../../common/enums';

@Entity('cm_remark_responses')
export class CMRemarkResponse extends BaseEntity {
    @Column({ name: 'cm_remark_id' })
    cmRemarkId: number;

    @Column({ name: 'department_id' })
    departmentId: number;

    @Column({ name: 'user_id' })
    userId: number;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'int', default: DecisionStatus.ONGOING })
    status: DecisionStatus;

    @Column({ type: 'json', nullable: true })
    attachments: string[];

    // Relations
    @ManyToOne(() => CmRemark, (remark) => remark.responses)
    @JoinColumn({ name: 'cm_remark_id' })
    cmRemark: CmRemark;

    @ManyToOne(() => Department)
    @JoinColumn({ name: 'department_id' })
    department: Department;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
