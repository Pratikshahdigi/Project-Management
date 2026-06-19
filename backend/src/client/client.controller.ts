import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ClientService } from './client.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Roles('CEO', 'Admin', 'Manager', 'Team Leader', 'Sales Executive')
  @Get()
  async getAll(@Req() req: any) {
    return this.clientService.findAll(req.user.tenantId);
  }

  @Roles('CEO', 'Admin', 'Manager', 'Sales Executive')
  @Post()
  async create(@Req() req: any, @Body() body: any) {
    return this.clientService.create(req.user.tenantId, body);
  }

  @Roles('CEO', 'Admin', 'Manager', 'Team Leader', 'Sales Executive')
  @Get(':id')
  async getOne(@Req() req: any, @Param('id') id: string) {
    return this.clientService.findOne(req.user.tenantId, id);
  }

  @Roles('CEO', 'Admin', 'Manager', 'Team Leader', 'Sales Executive', 'Client')
  @Get(':id/health')
  async getHealth(@Param('id') id: string) {
    return this.clientService.getHealth(id);
  }

  @Roles('CEO', 'Admin', 'Manager')
  @Put(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.clientService.update(req.user.tenantId, id, body);
  }

  @Roles('CEO', 'Admin')
  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string) {
    return this.clientService.delete(req.user.tenantId, id);
  }
}
