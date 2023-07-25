import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNumber()
  taskId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  parentId: number;

  @Expose({ toPlainOnly: true })
  @Transform((value) => undefined)
  extraFields: undefined;
}
