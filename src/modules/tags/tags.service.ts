import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { Taggable } from './entities/taggable.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Taggable)
    private taggableRepository: Repository<Taggable>,
  ) {}

  async create(name: string, color?: string): Promise<Tag> {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const tag = this.tagRepository.create({ name, slug, color });
    return await this.tagRepository.save(tag);
  }

  async findAll(): Promise<Tag[]> {
    return await this.tagRepository.find();
  }

  async findOrCreate(name: string): Promise<Tag> {
    let tag = await this.tagRepository.findOne({ where: { name } });
    if (!tag) {
      tag = await this.create(name);
    }
    return tag;
  }

  async attachTag(tagId: number, taggableType: string, taggableId: number): Promise<Taggable> {
    const taggable = this.taggableRepository.create({
      tagId,
      taggableType,
      taggableId,
    });
    return await this.taggableRepository.save(taggable);
  }

  async getTagsForEntity(taggableType: string, taggableId: number): Promise<Tag[]> {
    const taggables = await this.taggableRepository.find({
      where: { taggableType, taggableId },
      relations: ['tag'],
    });
    return taggables.map(t => t.tag);
  }

  async removeTag(tagId: number, taggableType: string, taggableId: number): Promise<void> {
    await this.taggableRepository.delete({ tagId, taggableType, taggableId });
  }
}

