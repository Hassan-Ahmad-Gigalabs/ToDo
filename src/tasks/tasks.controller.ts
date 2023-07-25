import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadTaskDto } from './dto/upload-task.dto';
import { UploadTaskType } from './types/tasks.type';
import { RemoveFileTaskDto } from './dto/remove-file-task.dto';
import { ApiTags } from '@nestjs/swagger';

let myDate: number;
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename(req, file, cb) {
          myDate = Date.now();
          cb(null, `${myDate}_${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|doc|xls|mp4)$/)) {
          cb(null, true);
        } else {
          cb(
            new HttpException(
              `Unsupported file type ${file.originalname}`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
    }),
  )
  async upload(@UploadedFile() file, @Body() uploadTaskDto: UploadTaskDto) {
    const body: UploadTaskType = {
      id: +uploadTaskDto.id,
      name: `${myDate}_${file.originalname}`,
    };
    return this.tasksService.upload(body);
  }

  @Patch('removeFile')
  async removeFile(@Body() removeFileTaskDto: RemoveFileTaskDto) {
    return this.tasksService.removeFile(removeFileTaskDto);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
