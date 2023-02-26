import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-satus.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  getTasks(tasksFilterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const tasks = this.taskRepository.getTasks(tasksFilterDto, user);
    return tasks;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const foundedTask = await this.taskRepository.findOne({
      where: { id, user },
    });
    if (!foundedTask) {
      throw new NotFoundException('Task not found');
    }
    return foundedTask;
  }

  async deleteById(id: string, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, user });

    if (!result.affected) {
      throw new NotFoundException('Task not found for removing');
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }
}
