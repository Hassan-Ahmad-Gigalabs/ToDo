import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
  ) {}

  create(createTagDto: CreateTagDto) {
    return this.tagRepo.save(createTagDto);
  }

  async findAll() {
    const tags = await this.tagRepo.find();
    if (!tags) throw new NotFoundException('No Users found');
    return tags;
  }

  async findOne(id: number) {
    const tags = await this.tagRepo.findOneBy({ id });
    if (!tags) throw new NotFoundException('User not found');
    return tags;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    let updatedTag = { ...updateTagDto, id };
    const tag = await this.tagRepo.save(updatedTag);
    return tag;
  }

  async remove(id: number) {
    const tag = await this.tagRepo.findOneBy({ id });
    if (!tag) throw new NotFoundException('User not found');
    return this.tagRepo.remove(tag);
  }
}
