import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database.service';

@Injectable()
export class SocialService {
  constructor(private readonly db: DatabaseService) {}

  findAll(tenantId: string) {
    return this.db.getTable('social_posts').filter(p => p.tenant_id === tenantId);
  }

  findOne(tenantId: string, id: string) {
    const post = this.db.getTable('social_posts').find(p => p.id === id && p.tenant_id === tenantId);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  create(tenantId: string, userId: string, data: any) {
    const newPost = {
      id: `post-${Date.now()}`,
      tenant_id: tenantId,
      client_id: data.clientId,
      content: data.content,
      media_urls: data.mediaUrls || [],
      platforms: data.platforms || [],
      status: 'Draft',
      scheduled_time: data.scheduledTime || new Date(Date.now() + 86400000).toISOString(),
      created_by: userId,
      escalated_task_id: null,
      logs: `Post created in Draft by user ${userId}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.db.insert('social_posts', newPost);
    return newPost;
  }

  async approveWorkflow(tenantId: string, postId: string, userId: string, userRole: string, comments: string) {
    const post = this.findOne(tenantId, postId);

    // Designer submits design -> Pending Approval (TL)
    if (userRole === 'Designer' || userRole === 'Video Editor') {
      post.status = 'Pending_Approval';
      post.logs += `\n[${new Date().toISOString()}] Submitted for Team Lead review by Designer ${userId}. Comments: ${comments}`;
    }
    // TL reviews -> Manager Review
    else if (userRole === 'Team Leader') {
      post.logs += `\n[${new Date().toISOString()}] Approved by Team Leader ${userId}. Comments: ${comments}`;
      // Progress status
      post.status = 'Pending_Approval';
    }
    // Manager, CEO, Client, and Social roles can approve or request edit
    else if (userRole === 'Manager' || userRole === 'CEO' || userRole === 'Admin' || userRole === 'Client' || userRole.includes('Social') || userRole.includes('SEO') || userRole.includes('Ads')) {
      if (comments.toLowerCase().includes('edit') || comments.toLowerCase().includes('revision') || comments.toLowerCase().includes('reject')) {
        post.status = 'Draft';
        post.logs += `\n[${new Date().toISOString()}] Revision requested by ${userRole} ${userId}. Comments: ${comments}`;
      } else {
        post.status = 'Scheduled';
        post.logs += `\n[${new Date().toISOString()}] Fully approved by ${userRole} ${userId}. Scheduled for posting. Comments: ${comments}`;
      }
    } else {
      throw new BadRequestException('Insufficient role permissions to progress this approval step');
    }

    this.db.update('social_posts', postId, post);
    return post;
  }

  // Cron Simulation check called periodically (e.g. on page loads or background ticks)
  async tickSocialScheduler() {
    const posts = this.db.getTable('social_posts').filter(p => p.status === 'Scheduled');
    const now = new Date();

    for (const post of posts) {
      const scheduledDate = new Date(post.scheduled_time);
      if (scheduledDate <= now) {
        await this.publishToMetaAPI(post);
      }
    }
  }

  private async publishToMetaAPI(post: any) {
    post.logs += `\n[${new Date().toISOString()}] Initiating API dispatch to: ${post.platforms.join(', ')}`;
    
    // Simulate Meta API call (100% self-hosted local emulation)
    // If post contains "fail" or "error", let's simulate a failure to trigger escalation workflow
    const isMockFailure = post.content.toLowerCase().includes('fail') || post.content.toLowerCase().includes('error');
    
    if (isMockFailure) {
      post.status = 'Failed';
      post.logs += `\n[${new Date().toISOString()}] API Error: (OAuthException - Code 190) Invalid Meta Access Token or page restrictions.`;
      
      // Auto-escalation workflow:
      // 1. Create task for manager/team-leader
      const escalationTask = {
        id: `task-escalation-${Date.now()}`,
        tenant_id: post.tenant_id,
        client_id: post.client_id,
        title: `URGENT ESCALATION: Social Post Publish Failure`,
        description: `Social media post ID ${post.id} failed to publish to platforms: ${post.platforms.join(', ')}.\nError details logged inside post details.\nContent: "${post.content.substring(0, 60)}..."`,
        status: 'Todo',
        priority: 'Urgent',
        assignee_id: 'user-manager-id', // Escalates to Manager
        reporter_id: 'user-ceo-id',
        due_date: new Date(Date.now() + 3600000 * 2).toISOString(), // 2 hours deadline
        created_at: new Date().toISOString(),
      };
      this.db.insert('tasks', escalationTask);
      post.escalated_task_id = escalationTask.id;
      
      console.log(`[ALERT ESCALATION] Post publish failed. Team Leader and Manager notified. Escalation task created: ${escalationTask.id}`);
    } else {
      post.status = 'Published';
      post.published_time = new Date().toISOString();
      post.logs += `\n[${new Date().toISOString()}] API Publish Success! Meta Graph ID: meta_page_post_${Date.now()}`;
    }

    this.db.update('social_posts', post.id, post);
  }
}
