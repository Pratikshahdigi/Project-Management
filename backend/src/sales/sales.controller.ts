import { Controller, Get, Post, Put, Body, Param, Req, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get('leads')
  async getLeads(@Req() req: any) {
    return this.salesService.findAll(req.user.tenantId);
  }

  @Post('leads')
  async createLead(@Req() req: any, @Body() body: any) {
    return this.salesService.create(req.user.tenantId, body);
  }

  @Put('leads/:id/stage')
  async updateStage(
    @Param('id') id: string,
    @Body('stage') stage: string,
    @Body('probability') probability?: number,
  ) {
    return this.salesService.updateStage(id, stage, probability);
  }

  @Get('performance')
  async getPerformance(@Req() req: any) {
    return this.salesService.getSalesPerformance(req.user.tenantId);
  }
}
