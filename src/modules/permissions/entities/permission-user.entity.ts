import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('permission_user')
export class PermissionUser extends BaseEntity {
    @Column({ name: 'permission_id' })
    permissionId: number;

    @Column({ name: 'user_id' })
    userId: number;
}
