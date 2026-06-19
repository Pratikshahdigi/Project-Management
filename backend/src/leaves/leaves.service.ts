import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database.service';

@Injectable()
export class LeavesService {
  constructor(private readonly db: DatabaseService) {}

  findAll(tenantId: string) {
    return this.db.getTable('leaves').filter(l => l.tenant_id === tenantId);
  }

  findByUser(tenantId: string, userId: string) {
    const user = this.db.getTable('users').find(
      u => u.id === userId && u.tenant_id === tenantId
    );
    if (!user) throw new NotFoundException('User not found');

    const userLeaves = this.db.getTable('leaves').filter(
      l => l.user_id === userId && l.tenant_id === tenantId
    );

    return {
      leaves: userLeaves,
      leave_balance: user.leave_balance !== undefined ? user.leave_balance : 30,
    };
  }

  create(tenantId: string, userId: string, data: any) {
    if (!data.startDate || !data.endDate || !data.reason) {
      throw new BadRequestException('Start date, end date, and reason are required');
    }

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid start or end date');
    }

    if (end.getTime() < start.getTime()) {
      throw new BadRequestException('End date cannot be before start date');
    }

    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    const user = this.db.getTable('users').find(
      u => u.id === userId && u.tenant_id === tenantId
    );
    if (!user) throw new NotFoundException('User not found');

    const balance = user.leave_balance !== undefined ? user.leave_balance : 30;
    if (days > balance) {
      throw new BadRequestException(
        `Insufficient leave balance. You requested ${days} days, but only have ${balance} days remaining.`
      );
    }

    const newLeave = {
      id: `leave-${Date.now()}`,
      tenant_id: tenantId,
      user_id: userId,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      start_date: data.startDate,
      end_date: data.endDate,
      days,
      reason: data.reason,
      status: 'Pending',
      created_at: new Date().toISOString(),
    };

    this.db.insert('leaves', newLeave);
    return newLeave;
  }

  approve(tenantId: string, id: string) {
    const leave = this.db.getTable('leaves').find(
      l => l.id === id && l.tenant_id === tenantId
    );
    if (!leave) throw new NotFoundException('Leave request not found');

    if (leave.status !== 'Pending') {
      throw new BadRequestException(`Leave request has already been ${leave.status.toLowerCase()}`);
    }

    const user = this.db.getTable('users').find(
      u => u.id === leave.user_id && u.tenant_id === tenantId
    );
    if (!user) throw new NotFoundException('User associated with this leave not found');

    const currentBalance = user.leave_balance !== undefined ? user.leave_balance : 30;
    if (currentBalance < leave.days) {
      throw new BadRequestException('User has insufficient leave balance to approve this request');
    }

    // Deduct leave days
    user.leave_balance = currentBalance - leave.days;
    this.db.update('users', user.id, user);

    // Update status
    leave.status = 'Approved';
    this.db.update('leaves', leave.id, leave);

    return { leave, leave_balance: user.leave_balance };
  }

  reject(tenantId: string, id: string) {
    const leave = this.db.getTable('leaves').find(
      l => l.id === id && l.tenant_id === tenantId
    );
    if (!leave) throw new NotFoundException('Leave request not found');

    if (leave.status !== 'Pending') {
      throw new BadRequestException(`Leave request has already been ${leave.status.toLowerCase()}`);
    }

    leave.status = 'Rejected';
    this.db.update('leaves', leave.id, leave);

    return leave;
  }
}
