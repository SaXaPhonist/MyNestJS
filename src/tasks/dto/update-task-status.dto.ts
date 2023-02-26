import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-satus.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
