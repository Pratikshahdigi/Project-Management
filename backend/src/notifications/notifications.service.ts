import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly db: DatabaseService) {}

  findAll(tenantId: string, userId: string) {
    return this.db.getTable('notifications').filter(
      n => n.tenant_id === tenantId && n.user_id === userId
    );
  }

  create(tenantId: string, userId: string, message: string, type: string) {
    const newNotification = {
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      tenant_id: tenantId,
      user_id: userId,
      message,
      type,
      read: false,
      created_at: new Date().toISOString(),
    };
    this.db.insert('notifications', newNotification);
    return newNotification;
  }

  markAsRead(tenantId: string, id: string, userId: string) {
    const table = this.db.getTable('notifications');
    const notification = table.find(
      n => n.id === id && n.tenant_id === tenantId && n.user_id === userId
    );
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    notification.read = true;
    this.db.update('notifications', id, notification);
    return notification;
  }
}
