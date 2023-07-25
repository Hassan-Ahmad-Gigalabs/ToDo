import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveFileTaskDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  file: string;

  @Expose({ toPlainOnly: true })
  @Transform((value) => undefined)
  extraFields: undefined;
}
