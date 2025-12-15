import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('files')
export class File extends BaseEntity {
  @Column({ name: 'original_name' })
  originalName: string;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'file_path' })
  filePath: string;

  @Column({ name: 'mime_type' })
  mimeType: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({ name: 'attachable_type', nullable: true })
  attachableType: string; // Model name

  @Column({ name: 'attachable_id', nullable: true })
  attachableId: number;

  @Column({ name: 'uploaded_by', nullable: true })
  uploadedBy: number;

  @Column({ name: 'is_public', default: false })
  isPublic: boolean;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by' })
  uploader: User;
}

