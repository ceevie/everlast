import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { TenantId } from '../common/decorators/tenant.decorator';
import { CreateTaskDTO } from '@everlast/types';

@Controller('tasks')
@UseGuards(TenantGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(
    @TenantId() tenantId: string,
    @Query('leadId') leadId?: string // Optionaler Query Param
  ) {
    return this.tasksService.findAll(tenantId, leadId);
  }

  @Post()
  create(@TenantId() tenantId: string, @Body() createTaskDto: any) {
    return this.tasksService.create(tenantId, createTaskDto);
  }

  @Patch(':id')
  async update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() data: any
  ) {
    const task = await this.tasksService.update(tenantId, id, data);
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }
}
