import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Tag } from './tag.entity';

@Entity('taggables')
export class Taggable {
  @PrimaryColumn({ name: 'tag_id' })
  tagId: number;

  @PrimaryColumn({ name: 'taggable_type' })
  taggableType: string; // minute, directive, task, etc.

  @PrimaryColumn({ name: 'taggable_id' })
  taggableId: number;

  // Relations
  @ManyToOne(() => Tag, (tag) => tag.taggables)
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}

