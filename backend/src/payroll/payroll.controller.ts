import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Roles('CEO', 'Admin', 'HR', 'Accountant')
  @Get()
  async getRecords(@Req() req: any) {
    return this.payrollService.findAll(req.user.tenantId);
  }

  @Roles('CEO', 'Admin', 'HR', 'Accountant')
  @Post('generate')
  async generate(
    @Req() req: any,
    @Body('userId') userId: string,
    @Body('period') period: string,
    @Body('bonuses') bonuses: number,
    @Body('deductions') deductions: number,
  ) {
    return this.payrollService.generatePayslip(
      req.user.tenantId,
      userId,
      period,
      bonuses || 0,
      deductions || 0,
    );
  }

  @Roles('CEO', 'Admin', 'HR', 'Accountant')
  @Post(':id/send')
  async sendPayslip(@Req() req: any, @Param('id') id: string) {
    return this.payrollService.sendPayslipEmail(req.user.tenantId, id);
  }
}
