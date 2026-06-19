import { Controller, Post, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid login credentials');
    }
    return this.authService.login(user);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refreshTokens(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/generate')
  async generate2FA(@Req() req: any) {
    return this.authService.generate2FASecret(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/verify')
  async verify2FA(@Req() req: any, @Body('code') code: string) {
    if (!code) {
      throw new UnauthorizedException('MFA verification code is required');
    }
    const success = await this.authService.verify2FA(req.user.sub, code);
    if (!success) {
      throw new UnauthorizedException('Invalid verification token');
    }
    return { success: true, message: '2FA enabled successfully' };
  }
}
