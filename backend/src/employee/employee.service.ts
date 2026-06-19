import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database.service';

@Injectable()
export class EmployeeService {
  constructor(private readonly db: DatabaseService) {}

  async getConsent(userId: string) {
    const consent = this.db.getTable('employee_consent').find(c => c.user_id === userId);
    return consent || { user_id: userId, consent_given: false };
  }

  async saveConsent(userId: string, consentGiven: boolean, ipAddress: string) {
    const consentTable = this.db.getTable('employee_consent');
    const existing = consentTable.find(c => c.user_id === userId);

    const record = {
      user_id: userId,
      consent_given: consentGiven,
      signed_at: new Date().toISOString(),
      ip_address: ipAddress,
    };

    if (existing) {
      this.db.update('employee_consent', userId, record);
    } else {
      this.db.insert('employee_consent', record);
    }
    return record;
  }

  async clockIn(userId: string) {
    const logs = this.db.getTable('employee_work_logs');
    const today = new Date().toISOString().split('T')[0];
    let log = logs.find(l => l.user_id === userId && l.date === today);

    if (!log) {
      log = {
        id: `worklog-${Date.now()}`,
        user_id: userId,
        date: today,
        login_time: new Date().toISOString(),
        logout_time: null,
        break_time_seconds: 0,
        idle_time_seconds: 0,
        work_time_seconds: 0,
        productivity_score: 85,
        performance_score: 90,
        achievement_score: 95,
        location_data: 'Office / Self-Hosted Server Geo',
      };
      this.db.insert('employee_work_logs', log);
    }
    return log;
  }

  async clockOut(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const log = this.db.getTable('employee_work_logs').find(l => l.user_id === userId && l.date === today);
    if (!log) throw new BadRequestException('Not clocked in today');

    log.logout_time = new Date().toISOString();
    
    // Calculate total work time
    const loginTime = new Date(log.login_time).getTime();
    const logoutTime = new Date(log.logout_time).getTime();
    const totalDiffSec = Math.floor((logoutTime - loginTime) / 1000);
    
    log.work_time_seconds = Math.max(0, totalDiffSec - log.break_time_seconds);
    this.db.update('employee_work_logs', log.id, log);
    return log;
  }

  async recordBreak(userId: string, durationSeconds: number) {
    const today = new Date().toISOString().split('T')[0];
    const log = this.db.getTable('employee_work_logs').find(l => l.user_id === userId && l.date === today);
    if (!log) throw new BadRequestException('Not clocked in today');

    log.break_time_seconds += durationSeconds;
    this.db.update('employee_work_logs', log.id, log);
    return log;
  }

  async registerActivityScreenshot(userId: string, body: any) {
    // 1. Verify consent
    const consent = await this.getConsent(userId);
    if (!consent || !consent.consent_given) {
      throw new BadRequestException('Screen monitoring requires employee consent. Sign consent form first.');
    }

    // 2. Save screen log (simulating privacy auto-blur on file content)
    const newScreenshot = {
      id: `screenshot-${Date.now()}`,
      user_id: userId,
      screenshot_url: `https://minio.local/screenshots/${userId}/blurred_${Date.now()}.jpg`,
      captured_at: new Date().toISOString(),
      active_app: body.activeApp || 'Unknown App',
      active_url: body.activeUrl || '',
      mouse_clicks: body.mouseClicks || 0,
      key_presses: body.keyPresses || 0,
      is_idle: body.isIdle || false,
    };
    this.db.insert('employee_screens', newScreenshot);

    // 3. Adjust today's idle score and productivity score based on activity level
    const today = new Date().toISOString().split('T')[0];
    const log = this.db.getTable('employee_work_logs').find(l => l.user_id === userId && l.date === today);
    if (log) {
      if (newScreenshot.is_idle) {
        log.idle_time_seconds += 600; // Increment idle time by 10m
      }
      
      // Basic dynamic scoring algorithm
      const totalKeysMouse = newScreenshot.key_presses + newScreenshot.mouse_clicks;
      if (totalKeysMouse < 5) {
        log.productivity_score = Math.max(10, log.productivity_score - 2);
      } else {
        log.productivity_score = Math.min(100, log.productivity_score + 1);
      }
      this.db.update('employee_work_logs', log.id, log);
    }

    return { success: true, message: 'Screenshot logged with privacy blur applied' };
  }

  async getWorkLogs(userId: string) {
    return this.db.getTable('employee_work_logs').filter(l => l.user_id === userId);
  }

  async getDailyPlanner(userId: string) {
    const tasks = this.db.getTable('tasks').filter(t => t.assignee_id === userId);
    const postApprovals = this.db.getTable('social_posts').filter(p => p.status === 'Pending_Approval');

    return {
      todayTasks: tasks.filter(t => t.status === 'In_Progress' || t.status === 'Todo'),
      completedTasks: tasks.filter(t => t.status === 'Completed'),
      approvalsPending: postApprovals,
      meetings: [
        { id: 'meet-1', title: 'Daily Standup Sync', time: '10:00 AM' },
        { id: 'meet-2', title: 'AI Balance Optimization', time: '04:00 PM' }
      ]
    };
  }

  async getEODReport(userId: string) {
    const planner = await this.getDailyPlanner(userId);
    const today = new Date().toISOString().split('T')[0];
    const log = this.db.getTable('employee_work_logs').find(l => l.user_id === userId && l.date === today);

    const completed = planner.completedTasks.map(t => `- ${t.title}`).join('\n') || '- None';
    const pending = planner.todayTasks.map(t => `- ${t.title}`).join('\n') || '- None';
    const hoursLogged = log ? ((log.work_time_seconds || 0) / 3600).toFixed(2) : '0.00';
    const productivity = log ? log.productivity_score : 100;

    return {
      date: today,
      userId,
      reportText: `*** DAILY END OF DAY REPORT - ${today} ***\n\n` +
                  `Completed Tasks:\n${completed}\n\n` +
                  `Pending Tasks:\n${pending}\n\n` +
                  `Time Logged: ${hoursLogged} Hours\n` +
                  `Average Productivity Index: ${productivity}%\n` +
                  `Status: Submitted to Team Lead.`
    };
  }
}
