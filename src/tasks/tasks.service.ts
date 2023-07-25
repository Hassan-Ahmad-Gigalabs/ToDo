import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import {
  CreateTaskType,
  UpdateTaskType,
  UploadTaskType,
} from './types/tasks.type';
import { RemoveFileTaskDto } from './dto/remove-file-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
  ) {}

  async removeFile(removeFileTaskDto: RemoveFileTaskDto) {
    const { id, file } = removeFileTaskDto;
    const task = await this.taskRepo.findOne({
      where: { id },
    });
    task.uploads = task.uploads.filter((f) => f != file);
    await this.taskRepo.save(task);
    return { file, message: 'File removed successfully' };
  }

  async upload(uploadTask: UploadTaskType) {
    const { id, name } = uploadTask;
    const task = await this.taskRepo.findOne({
      where: { id },
    });
    task.uploads.push(name);
    await this.taskRepo.save(task);
    return { file: name, message: 'File uploaded successfully' };
  }

  async create(createTaskDto: CreateTaskDto) {
    const {
      title,
      description,
      state,
      tags,
      assignees,
      startDate,
      endDate,
      parentId,
    } = createTaskDto;
    let body: CreateTaskType = {
      title,
      description,
      state,
      startDate,
      endDate,
    };

    if (tags && tags.length) {
      const queriedTags = await this.tagRepo
        .createQueryBuilder('tag')
        .where('tag.id IN (:...tags)', { tags })
        .getMany();
      body.tags = queriedTags;
    }

    if (assignees && assignees.length) {
      const queriedAssignees = await this.userRepo
        .createQueryBuilder('user')
        .where('user.id IN (:...assignees)', { assignees })
        .getMany();
      body.assignees = queriedAssignees;
    }

    if (parentId) {
      const parent = await this.taskRepo.findOne({
        where: { id: parentId },
        relations: {
          children: true,
        },
      });
      if (!parent) throw new BadRequestException('Parent task not found');
      body.parent = parent;
    }

    return this.taskRepo.save(body);
  }

  async findAll() {
    const tasks = await this.taskRepo.find({
      relations: {
        tags: true,
        assignees: true,
        children: true,
      },
    });
    if (!tasks) throw new NotFoundException('No Tasks found');
    return tasks;
  }

  async findOne(id: number) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: {
        tags: true,
        assignees: true,
        comments: true,
        children: true,
      },
    });
    if (!task) throw new NotFoundException('No Task found');
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const { tags, assignees, parentId } = updateTaskDto;

    let updatedTask: UpdateTaskType = { ...updateTaskDto, id };

    if (tags && tags.length) {
      const queriedTags = await this.tagRepo
        .createQueryBuilder('tag')
        .where('tag.id IN (:...tags)', { tags })
        .getMany();
      updatedTask.tags = queriedTags;
    }

    if (assignees && assignees.length) {
      const queriedAssignees = await this.userRepo
        .createQueryBuilder('user')
        .where('user.id IN (:...assignees)', { assignees })
        .getMany();
      updatedTask.assignees = queriedAssignees;
    }

    if (parentId) {
      const parent = await this.taskRepo.findOne({
        where: { id: parentId },
        relations: {
          children: true,
        },
      });
      if (!parent) throw new BadRequestException('Parent task not found');
      updatedTask.parent = parent;
    }

    const task = await this.taskRepo.save(updatedTask);
    return task;
  }

  async remove(id: number) {
    const task = await this.taskRepo.findOneBy({ id });
    if (!task) throw new NotFoundException('Task not found');
    return this.taskRepo.remove(task);
  }
}
