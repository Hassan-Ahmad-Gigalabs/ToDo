import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  AfterLoad,
  AfterInsert,
} from 'typeorm';
import { State } from '../types/tasks.type';

@Entity('task')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', default: 'backlog' })
  state: State;

  @Column({ type: 'varchar', array: true, length: 100, default: [] })
  uploads: string[];

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];

  @ManyToMany(() => User, (user) => user.tasks)
  assignees: User[];

  @ManyToMany(() => Tag, (tag) => tag.tasks)
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Task, (task) => task.parent)
  children: Task[];

  @ManyToOne(() => Task, (task) => task.children)
  parent: Task;

  @Column({ default: 0 })
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
