import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { PtfIssue } from './ptf-issue.entity';

@Entity('ptf_meetings')
export class PtfMeeting extends AuditableEntity {
  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  venue: string;

  @Column({ type: 'text', nullable: true })
  attendees: string;

  @Column({ type: 'text', nullable: true })
  decisions: string;

  // Relations
  @ManyToMany(() => PtfIssue)
  @JoinTable({
    name: 'ptf_meeting_issues',
    joinColumn: { name: 'ptf_meeting_id' },
    inverseJoinColumn: { name: 'ptf_issue_id' },
  })
  issues: PtfIssue[];
}

