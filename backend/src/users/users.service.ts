import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  findAll(tenantId: string) {
    // Return all users for this tenant without exposing password_hash or mfa_secret
    const users = this.db.getTable('users').filter(u => u.tenant_id === tenantId);
    return users.map(({ password_hash, mfa_secret, refresh_token, ...safeUser }) => safeUser);
  }

  create(tenantId: string, data: any) {
    if (!data.email || !data.password || !data.firstName || !data.role) {
      throw new BadRequestException('Email, password, firstName, and role are required fields');
    }

    const emailLower = data.email.toLowerCase();
    const existing = this.db.getTable('users').find(u => u.email.toLowerCase() === emailLower);
    if (existing) {
      throw new BadRequestException('User with this email address already exists');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      tenant_id: tenantId,
      email: emailLower,
      password_hash: bcrypt.hashSync(data.password, 10),
      first_name: data.firstName,
      last_name: data.lastName || '',
      role: data.role,
      status: 'active',
      mfa_enabled: false,
      department: data.department || this.getDefaultDepartment(data.role),
      created_at: new Date().toISOString(),
    };

    this.db.insert('users', newUser);
    const { password_hash, ...safeUser } = newUser;
    return safeUser;
  }

  delete(tenantId: string, id: string) {
    if (id === 'user-ceo-id') {
      throw new BadRequestException('Primary CEO Administrator account cannot be deleted');
    }

    const user = this.db.getTable('users').find(u => u.id === id && u.tenant_id === tenantId);
    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    this.db.delete('users', id);
    return { success: true, message: 'User access successfully revoked' };
  }

  private getDefaultDepartment(role: string): string {
    if (role === 'CEO' || role === 'Admin') return 'Leadership';
    if (role === 'Manager') return 'Operations';
    if (role === 'Designer' || role === 'Video Editor') return 'Creative';
    if (role === 'Social Media Executive' || role === 'SEO Executive' || role === 'Google Ads Executive' || role === 'Meta Ads Executive') return 'Social Media';
    if (role === 'Sales Executive') return 'Sales';
    if (role === 'Client') return 'Client Portal';
    return 'General';
  }
}
