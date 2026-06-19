import { Controller, Get, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Roles('CEO', 'Manager')
  @Get()
  async getAllLeaves(@Req() req: any) {
    return this.leavesService.findAll(req.user.tenantId);
  }

  @Get('my')
  async getMyLeaves(@Req() req: any) {
    return this.leavesService.findByUser(req.user.tenantId, req.user.sub);
  }

  @Post()
  async applyLeave(@Req() req: any, @Body() body: any) {
    return this.leavesService.create(req.user.tenantId, req.user.sub, body);
  }

  @Roles('CEO', 'Manager')
  @Post(':id/approve')
  async approveLeave(@Req() req: any, @Param('id') id: string) {
    return this.leavesService.approve(req.user.tenantId, id);
  }

  @Roles('CEO', 'Manager')
  @Post(':id/reject')
  async rejectLeave(@Req() req: any, @Param('id') id: string) {
    return this.leavesService.reject(req.user.tenantId, id);
  }
}
