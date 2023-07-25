import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UploadTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Expose({ toPlainOnly: true })
  @Transform((value) => undefined)
  extraFields: undefined;
}
