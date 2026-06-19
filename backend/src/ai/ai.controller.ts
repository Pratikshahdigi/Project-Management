import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AIService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('query')
  async queryBrain(@Req() req: any, @Body('prompt') prompt: string) {
    return this.aiService.processBrainQuery(req.user.tenantId, prompt);
  }

  @Get('workload')
  async getWorkloadBalancer(@Req() req: any) {
    return this.aiService.balanceWorkload(req.user.tenantId);
  }

  @Get('burnout/:userId')
  async getBurnoutAnalysis(@Param('userId') userId: string) {
    return this.aiService.analyzeEmployeeBurnout(userId);
  }

  @Get('churn/:clientId')
  async getChurnPrediction(@Param('clientId') clientId: string) {
    return this.aiService.predictClientChurn(clientId);
  }

  @Get('revenue-forecast')
  async getRevenueForecast(@Req() req: any) {
    return this.aiService.forecastRevenue(req.user.tenantId);
  }

  @Post('content-predict')
  async predictContentPerformance(
    @Body('content') content: string,
    @Body('platforms') platforms: string[],
  ) {
    return this.aiService.predictContentPerformance(content, platforms || []);
  }

  @Post('sales-proposal')
  async generateSalesProposal(@Body('leadId') leadId: string) {
    const proposal = await this.aiService.generateSalesProposal(leadId);
    return { proposal };
  }
}
