import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { SocialService } from './social.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('social/posts')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Get()
  async getPosts(@Req() req: any) {
    // Tick the scheduler so that scheduled posts convert dynamically on view checks (simplifies offline testing)
    await this.socialService.tickSocialScheduler();
    return this.socialService.findAll(req.user.tenantId);
  }

  @Post()
  async createPost(@Req() req: any, @Body() body: any) {
    return this.socialService.create(req.user.tenantId, req.user.sub, body);
  }

  @Post(':id/approve')
  async approvePost(
    @Req() req: any,
    @Param('id') id: string,
    @Body('comments') comments: string,
  ) {
    return this.socialService.approveWorkflow(
      req.user.tenantId,
      id,
      req.user.sub,
      req.user.role,
      comments || '',
    );
  }

  @Post('tick')
  async runSchedulerTick() {
    await this.socialService.tickSocialScheduler();
    return { status: 'triggered_tick' };
  }
}
