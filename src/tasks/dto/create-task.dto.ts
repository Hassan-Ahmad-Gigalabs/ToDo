import {
  IsArray,
  IsEmail,
  IsISO8601,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { State } from '../types/tasks.type';
import { User } from 'src/users/entities/user.entity';
import { Tag } from 'src/tags/entities/tag.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([
    'backlog',
    'notStarted',
    'inProgress',
    'readyForTest',
    'testing',
    'completed',
    'onHold',
  ])
  state: State;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  parentId: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  assignees: User[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tags: Tag[];

  @IsNotEmpty()
  @IsISO8601()
  startDate: Date;

  @IsNotEmpty()
  @IsISO8601()
  endDate: Date;

  @Expose({ toPlainOnly: true })
  @Transform((value) => undefined)
  extraFields: undefined;
}
