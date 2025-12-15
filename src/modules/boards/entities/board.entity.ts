import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Department } from '../../departments/entities/department.entity';
import type { BoardMember } from './board-member.entity';
import type { BoardMeeting } from './board-meeting.entity';
import type { BoardAct } from './board-act.entity';

@Entity('boards')
export class Board extends AuditableEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'board_type' })
  boardType: string; // university, hospital, corporate, regulatory, advisory, district

  @Column({ name: 'parent_department_id', nullable: true })
  parentDepartmentId: number;

  @Column({ name: 'quorum_requirement', nullable: true })
  quorumRequirement: number;

  @Column({ name: 'meeting_frequency', nullable: true })
  meetingFrequency: string; // monthly, quarterly, bi-annually, annually

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  // Relations
  @ManyToOne(() => Department)
  @JoinColumn({ name: 'parent_department_id' })
  parentDepartment: Department;

  @OneToMany('BoardMember', 'board')
  members: BoardMember[];

  @OneToMany('BoardMeeting', 'board')
  meetings: BoardMeeting[];

  @OneToMany('BoardAct', 'board')
  acts: BoardAct[];
}

