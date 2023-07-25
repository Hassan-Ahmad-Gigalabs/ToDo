import { User } from 'src/users/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  AfterLoad,
  AfterInsert,
} from 'typeorm';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  text: string;

  @Column({ type: 'int' })
  taskId: number;

  @ManyToOne(() => Task, (task) => task.comments)
  task: Task;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[];

  @ManyToOne(() => Comment, (comment) => comment.children)
  parent: Comment;

  @Column({ type: 'int', nullable: true })
  parentId: number | null;

  @Column({ type: 'int', default: 0 })
  numberOfChildren: number;

  @AfterLoad()
  @AfterInsert()
  updateNumberOfChildren() {
    this.numberOfChildren = this.children ? this.children.length : 0;
  }

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
