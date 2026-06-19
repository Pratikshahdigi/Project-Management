import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'super-secure-jwt-key';
  private readonly jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'super-secure-refresh-key';

  constructor(private readonly db: DatabaseService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const users = this.db.getTable('users');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.status === 'active');
    if (user && bcrypt.compareSync(pass, user.password_hash)) {
      const { password_hash, mfa_secret, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role, tenantId: user.tenant_id };
    
    // Generate JWT access & refresh tokens
    const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ sub: user.id }, this.jwtRefreshSecret, { expiresIn: '7d' });

    // In a production SQL system, we would hash the refresh token and save it in a user sessions table.
    // Here we save it directly inside the user model for simplicity.
    const userToUpdate = this.db.getTable('users').find(u => u.id === user.id);
    if (userToUpdate) {
      userToUpdate.refresh_token = refreshToken;
      this.db.update('users', user.id, userToUpdate);
    }

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        tenantId: user.tenant_id,
      },
    };
  }

  async generate2FASecret(userId: string) {
    const user = this.db.getTable('users').find(u => u.id === userId);
    if (!user) throw new BadRequestException('User not found');

    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(user.email, 'AgencyOS', secret);
    
    user.mfa_secret = secret;
    this.db.update('users', userId, user);

    const qrCodeUrl = await qrcode.toDataURL(otpAuthUrl);
    return { secret, qrCodeUrl };
  }

  async verify2FA(userId: string, code: string): Promise<boolean> {
    const user = this.db.getTable('users').find(u => u.id === userId);
    if (!user || !user.mfa_secret) return false;

    const isValid = authenticator.verify({ token: code, secret: user.mfa_secret });
    if (isValid) {
      user.mfa_enabled = true;
      this.db.update('users', userId, user);
      return true;
    }
    return false;
  }

  verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded: any = jwt.verify(refreshToken, this.jwtRefreshSecret);
      const user = this.db.getTable('users').find(u => u.id === decoded.sub && u.refresh_token === refreshToken);
      if (!user) {
        throw new UnauthorizedException('Token rotation failure or user session expired');
      }
      return this.login(user);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
