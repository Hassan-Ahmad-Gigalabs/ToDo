import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from '../entities/comment.entity';

export type CreateCommentType = {
  id?: number;
  text: string;
  task?: Task;
  user?: User;
  parent?: Comment;
};

export type UpdateCommentType = Partial<CreateCommentType>;
