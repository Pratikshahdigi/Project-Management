import { Controller, Get, Post, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('CEO', 'Manager', 'Admin')
  @Get()
  async getAllUsers(@Req() req: any) {
    return this.usersService.findAll(req.user.tenantId);
  }

  @Roles('CEO', 'Manager', 'Admin')
  @Post()
  async createUser(@Req() req: any, @Body() body: any) {
    return this.usersService.create(req.user.tenantId, body);
  }

  @Roles('CEO', 'Manager', 'Admin')
  @Delete(':id')
  async deleteUser(@Req() req: any, @Param('id') id: string) {
    return this.usersService.delete(req.user.tenantId, id);
  }
}
