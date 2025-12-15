import { Entity, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { UserType } from '../../../common/enums';

@Entity('users')
export class User extends AuditableEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'department_id' })
  departmentId: number;

  @Column({ name: 'user_group_id', nullable: true })
  userGroupId: number;

  @Column({ name: 'manager_id', nullable: true })
  managerId: number;

  @Column({ type: 'enum', enum: UserType, nullable: true })
  type: UserType;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'must_change_password', default: false })
  mustChangePassword: boolean;

  @Column({ name: 'email_verified_at', type: 'timestamp', nullable: true })
  emailVerifiedAt: Date;

  @Column({ name: 'remember_token', nullable: true })
  @Exclude()
  rememberToken: string;

  // Relations will be added in core-modules todo
  // For now, we'll define them as placeholders

  permissions?: any[];
  role?: any;
  department?: any;
  userGroup?: any;
  manager?: User;
  subordinates?: User[];
}

