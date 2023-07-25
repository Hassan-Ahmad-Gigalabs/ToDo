import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { Repository, IsNull, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentType, UpdateCommentType } from './types/comments.type';
import { User } from 'src/users/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const { text, userId, taskId, parentId } = createCommentDto;
    let body: CreateCommentType = {
      text,
    };

    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    if (!user) throw new BadRequestException('User not found');
    body.user = user;

    const task = await this.taskRepo.findOne({
      where: { id: taskId },
    });
    if (!task) throw new BadRequestException('Task not found');
    body.task = task;

    if (parentId) {
      const parent = await this.commentRepo.findOne({
        where: { id: parentId },
        relations: {
          children: true,
        },
      });
      if (!parent) throw new BadRequestException('Parent task not found');
      body.parent = parent;
    }

    return this.commentRepo.save(body);
  }

  async findAll(id: number, pageNumber: number, itemsPerPage: number) {
    const query: FindManyOptions<Comment> = {
      where: {
        parentId: IsNull(),
        taskId: id,
      },
      relations: {
        user: true,
      },
      order: {
        createdAt: 'DESC',
      },
    };
    if (pageNumber && itemsPerPage) {
      query.skip = (pageNumber - 1) * itemsPerPage;
      query.take = itemsPerPage;
    }
    const [comments, totalItems] = await this.commentRepo.findAndCount(query);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (!comments) throw new NotFoundException('No Comments found');
    return { data: comments, totalItems, totalPages };
  }

  async findOne(id: number) {
    const comments = await this.commentRepo.findOne({
      where: { id },
      relations: {
        user: true,
        children: true,
      },
    });
    if (!comments) throw new NotFoundException('No Comments found');
    return comments;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const { userId, taskId, parentId } = updateCommentDto;

    let updatedComment: UpdateCommentType = { ...updateCommentDto, id };

    if (userId) {
      const user = await this.userRepo.findOne({
        where: { id: userId },
      });
      if (!user) throw new BadRequestException('User not found');
      updatedComment.user = user;
    }

    if (taskId) {
      const task = await this.taskRepo.findOne({
        where: { id: taskId },
      });
      if (!task) throw new BadRequestException('Task not found');
      updatedComment.task = task;
    }

    if (parentId) {
      const parent = await this.commentRepo.findOne({
        where: { id: parentId },
        relations: {
          children: true,
        },
      });
      if (!parent) throw new BadRequestException('Parent task not found');
      updatedComment.parent = parent;
    }

    return await this.commentRepo.save(updatedComment);
  }

  async remove(id: number) {
    const comment = await this.commentRepo.findOneBy({ id });
    if (!comment) throw new NotFoundException('comment not found');
    return this.commentRepo.remove(comment);
  }
}
