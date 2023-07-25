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
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
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

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  parentId: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  assignees: User[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tags: Tag[];

  @ApiProperty()
  @IsOptional()
  @IsISO8601()
  startDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsISO8601()
  endDate: Date;

  @Expose({ toPlainOnly: true })
  @Transform((value) => undefined)
  extraFields: undefined;
}
