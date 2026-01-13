import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { SectorialAgenda } from './sectorial-agenda.entity';
import { DecisionStatus } from '../../../common/enums';

@Entity('sectorial_agenda_replies')
export class SectorialAgendaReply extends AuditableEntity {
    @Column({ name: 'sectorial_agenda_id' })
    sectorialAgendaId: number;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'int', default: DecisionStatus.ON_TARGET })
    status: DecisionStatus;

    @Column({ type: 'json', nullable: true })
    attachments: string[];

    @ManyToOne(() => SectorialAgenda, (agenda) => agenda.replies)
    @JoinColumn({ name: 'sectorial_agenda_id' })
    sectorialAgenda: SectorialAgenda;
}
