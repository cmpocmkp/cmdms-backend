import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { BoardAgenda } from './board-agenda.entity';
import { User } from '../../users/entities/user.entity';

@Entity('board_agenda_replies')
export class BoardAgendaReply extends AuditableEntity {
    @Column({ name: 'board_agenda_id' })
    boardAgendaId: number;

    @Column({ type: 'text' })
    reply: string;

    @ManyToOne(() => BoardAgenda, (agenda) => agenda.replies)
    @JoinColumn({ name: 'board_agenda_id' })
    boardAgenda: BoardAgenda;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    user: User;
}
