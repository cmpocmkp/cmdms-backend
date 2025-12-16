import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
  ) {}

  async create(createDto: any, userId: number): Promise<File> {
    const file = this.filesRepository.create({ ...createDto, uploadedBy: userId });
    return await this.filesRepository.save(file) as unknown as File;
  }

  async findAll(): Promise<File[]> {
    return await this.filesRepository.find({ relations: ['uploader'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<File> {
    const file = await this.filesRepository.findOne({ where: { id }, relations: ['uploader'] });
    if (!file) throw new NotFoundException(`File ${id} not found`);
    return file;
  }

  async findByAttachable(type: string, id: number): Promise<File[]> {
    return await this.filesRepository.find({ where: { attachableType: type, attachableId: id } });
  }

  async remove(id: number): Promise<void> {
    const file = await this.findOne(id);
    await this.filesRepository.remove(file);
  }
}

