import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getTasks(@Req() req: any) {
    return this.tasksService.findAll(
      req.user.tenantId,
      req.user.sub,
      req.user.role,
      req.user.email
    );
  }

  @Post()
  async createTask(@Req() req: any, @Body() body: any) {
    return this.tasksService.create(req.user.tenantId, req.user.sub, body);
  }

  @Put(':id')
  async updateTask(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.tasksService.update(req.user.tenantId, id, body, req.user.sub);
  }

  @Roles('CEO', 'Manager', 'Admin')
  @Delete(':id')
  async deleteTask(@Req() req: any, @Param('id') id: string) {
    return this.tasksService.delete(req.user.tenantId, id);
  }
}
