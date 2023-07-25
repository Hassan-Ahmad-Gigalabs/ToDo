import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import { Task } from '../entities/task.entity';

export type State =
  | 'backlog'
  | 'notStarted'
  | 'inProgress'
  | 'readyForTest'
  | 'testing'
  | 'completed'
  | 'onHold';

export type CreateTaskType = {
  id?: number;
  title: string;
  description: string;
  state: State;
  assignees?: User[];
  tags?: Tag[];
  parent?: Task;
  startDate: Date;
  endDate: Date;
};

export type UploadTaskType = {
  id: number;
  name: string;
};

export type UpdateTaskType = Partial<CreateTaskType>;
