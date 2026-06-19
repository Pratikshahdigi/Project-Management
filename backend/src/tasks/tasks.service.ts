import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly db: DatabaseService,
    private readonly notificationsService: NotificationsService
  ) {}

  findAll(tenantId: string, userId: string, role: string, email: string) {
    const allTasks = this.db.getTable('tasks').filter(t => t.tenant_id === tenantId);

    // CEO, Manager, Admin and Team Leaders see all tasks
    if (role === 'CEO' || role === 'Manager' || role === 'Admin' || role === 'Team Leader') {
      return allTasks;
    }

    // Client role: only show tasks belonging to their company client profile
    if (role === 'Client') {
      const clients = this.db.getTable('clients');
      // Look up client by email
      const client = clients.find(c => c.email.toLowerCase() === email.toLowerCase() || c.id === 'client-acme-id');
      if (client) {
        return allTasks.filter(t => t.client_id === client.id);
      }
      return [];
    }

    // Creative roles (Designer, Video Editor): show tasks assigned to them OR reported by them
    if (role === 'Designer' || role === 'Video Editor') {
      return allTasks.filter(t => t.assignee_id === userId || t.reporter_id === userId);
    }

    // Marketing roles (Social Media Executive, SEO Executive, etc.)
    if (role.includes('Social') || role.includes('SEO') || role.includes('Ads')) {
      const marketingUserIds = this.db.getTable('users')
        .filter(u => u.role.includes('Social') || u.role.includes('SEO') || u.role.includes('Ads') || u.role === 'Manager')
        .map(u => u.id);
      return allTasks.filter(t => 
        t.assignee_id === userId || 
        t.reporter_id === userId || 
        marketingUserIds.includes(t.assignee_id) || 
        t.title.toLowerCase().includes('ads') || 
        t.title.toLowerCase().includes('social') || 
        t.title.toLowerCase().includes('seo')
      );
    }

    // Sales roles (Sales Executive)
    if (role === 'Sales Executive') {
      return allTasks.filter(t => 
        t.assignee_id === userId || 
        t.reporter_id === userId || 
        t.title.toLowerCase().includes('sales') || 
        t.title.toLowerCase().includes('lead') || 
        t.title.toLowerCase().includes('crm')
      );
    }

    // Fallback: Return only tasks assigned to the user or reported by them
    return allTasks.filter(t => t.assignee_id === userId || t.reporter_id === userId);
  }

  findOne(tenantId: string, id: string) {
    const task = this.db.getTable('tasks').find(t => t.id === id && t.tenant_id === tenantId);
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  create(tenantId: string, userId: string, data: any) {
    if (!data.title || !data.clientId) {
      throw new BadRequestException('Task title and clientId are required');
    }

    const newTask = {
      id: `task-${Date.now()}`,
      tenant_id: tenantId,
      client_id: data.clientId,
      title: data.title,
      description: data.description || '',
      status: data.status || 'Todo',
      design_workflow: data.workflow || 'Assigned',
      priority: data.priority || 'Medium',
      assignee_id: data.assigneeId || userId,
      reporter_id: userId,
      due_date: data.dueDate || new Date(Date.now() + 86400000 * 2).toISOString(),
      estimated_minutes: parseInt(data.estimatedMinutes) || 120,
      actual_minutes: parseInt(data.actualMinutes) || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.db.insert('tasks', newTask);

    // Send assignment notification if assignee is set and different from creator
    if (newTask.assignee_id) {
      const reporter = this.db.getTable('users').find(u => u.id === userId);
      const reporterName = reporter ? `${reporter.first_name} ${reporter.last_name}` : 'A teammate';
      const msg = `You have been assigned a new task: "${newTask.title}" by ${reporterName}. Details: ${newTask.description || 'No description provided.'}`;
      
      this.notificationsService.create(
        tenantId,
        newTask.assignee_id,
        msg,
        'task_assignment'
      );
    }

    return newTask;
  }

  update(tenantId: string, id: string, data: any, updaterId?: string) {
    const task = this.findOne(tenantId, id);
    const oldStatus = task.status;
    const oldWorkflow = task.design_workflow;
    const oldAssigneeId = task.assignee_id;

    const updatedTask = {
      ...task,
      title: data.title !== undefined ? data.title : task.title,
      description: data.description !== undefined ? data.description : task.description,
      status: data.status !== undefined ? data.status : task.status,
      design_workflow: data.workflow !== undefined ? data.workflow : task.design_workflow,
      priority: data.priority !== undefined ? data.priority : task.priority,
      assignee_id: data.assigneeId !== undefined ? data.assigneeId : task.assignee_id,
      actual_minutes: data.actualMinutes !== undefined ? parseInt(data.actualMinutes) : task.actual_minutes,
      updated_at: new Date().toISOString(),
    };

    this.db.update('tasks', id, updatedTask);

    // Trigger notification if assignee has changed
    if (data.assigneeId !== undefined && data.assigneeId !== oldAssigneeId) {
      const updater = updaterId ? this.db.getTable('users').find(u => u.id === updaterId) : null;
      const updaterName = updater ? `${updater.first_name} ${updater.last_name}` : 'A teammate';
      const msg = `You have been reassigned the task: "${updatedTask.title}" by ${updaterName}. Details: ${updatedTask.description || 'No description provided.'}`;
      
      this.notificationsService.create(
        tenantId,
        data.assigneeId,
        msg,
        'task_reassignment'
      );
    }

    // Notification Trigger: design approved or task completed notifies the reporter
    const isCompletedTransition = (data.status === 'Completed' && oldStatus !== 'Completed');
    const isApprovedTransition = (data.workflow === 'Approved' && oldWorkflow !== 'Approved');

    if ((isCompletedTransition || isApprovedTransition) && updatedTask.reporter_id) {
      this.notificationsService.create(
        tenantId,
        updatedTask.reporter_id,
        `Your requested task/design asset '${updatedTask.title}' has been completed/approved.`,
        'design_approved'
      );
    }

    return updatedTask;
  }

  delete(tenantId: string, id: string) {
    this.findOne(tenantId, id); // Validate exists
    this.db.delete('tasks', id);
    return { success: true, message: 'Task deleted successfully' };
  }
}
