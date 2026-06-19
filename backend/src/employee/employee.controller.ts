import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('consent')
  async getConsent(@Req() req: any) {
    return this.employeeService.getConsent(req.user.sub);
  }

  @Post('consent')
  async saveConsent(
    @Req() req: any,
    @Body('consentGiven') consentGiven: boolean,
  ) {
    // Standard mock IP fetching
    const ip = req.ip || '127.0.0.1';
    return this.employeeService.saveConsent(req.user.sub, consentGiven, ip);
  }

  @Post('clock-in')
  async clockIn(@Req() req: any) {
    return this.employeeService.clockIn(req.user.sub);
  }

  @Post('clock-out')
  async clockOut(@Req() req: any) {
    return this.employeeService.clockOut(req.user.sub);
  }

  @Post('break')
  async recordBreak(
    @Req() req: any,
    @Body('durationSeconds') durationSeconds: number,
  ) {
    return this.employeeService.recordBreak(req.user.sub, durationSeconds);
  }

  @Post('screenshot')
  async logScreenshot(@Req() req: any, @Body() body: any) {
    return this.employeeService.registerActivityScreenshot(req.user.sub, body);
  }

  @Get('logs')
  async getWorkLogs(@Req() req: any) {
    return this.employeeService.getWorkLogs(req.user.sub);
  }

  @Get('planner')
  async getDailyPlanner(@Req() req: any) {
    return this.employeeService.getDailyPlanner(req.user.sub);
  }

  @Get('eod-report')
  async getEODReport(@Req() req: any) {
    return this.employeeService.getEODReport(req.user.sub);
  }
}
