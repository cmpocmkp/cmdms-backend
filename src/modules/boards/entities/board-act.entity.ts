import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Board } from './board.entity';
import { Department } from '../../departments/entities/department.entity';

@Entity('board_acts')
export class BoardAct extends AuditableEntity {
  @Column({ name: 'board_id' })
  boardId: number;

  @Column()
  name: string;

  @Column({ name: 'act_number', nullable: true })
  actNumber: string;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'implementation_status', default: 'pending' })
  implementationStatus: string; // pending, in_progress, implemented

  @Column({ name: 'responsible_department_id', nullable: true })
  responsibleDepartmentId: number;

  // Relations
  @ManyToOne(() => Board, (board) => board.acts)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'responsible_department_id' })
  responsibleDepartment: Department;
}

