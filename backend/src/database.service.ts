import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly dbDir = path.join(__dirname, '..', 'db_data');
  private data: {
    tenants: any[];
    users: any[];
    clients: any[];
    client_health_ai: any[];
    tasks: any[];
    social_posts: any[];
    employee_work_logs: any[];
    employee_screens: any[];
    employee_consent: any[];
    sales_leads: any[];
    payroll_records: any[];
    audit_logs: any[];
    leaves: any[];
    notifications: any[];
  } = {
    tenants: [],
    users: [],
    clients: [],
    client_health_ai: [],
    tasks: [],
    social_posts: [],
    employee_work_logs: [],
    employee_screens: [],
    employee_consent: [],
    sales_leads: [],
    payroll_records: [],
    audit_logs: [],
    leaves: [],
    notifications: [],
  };

  onModuleInit() {
    if (!fs.existsSync(this.dbDir)) {
      fs.mkdirSync(this.dbDir, { recursive: true });
    }
    this.loadData();
    this.seedDefaults();
    
    // Ensure all users have leave_balance initialized to 30
    let updatedUsers = false;
    this.data.users.forEach(user => {
      if (user.leave_balance === undefined) {
        user.leave_balance = 30;
        updatedUsers = true;
      }
    });
    if (updatedUsers) {
      this.saveTable('users');
    }
  }

  private loadData() {
    for (const key of Object.keys(this.data)) {
      const filePath = path.join(this.dbDir, `${key}.json`);
      if (fs.existsSync(filePath)) {
        try {
          this.data[key] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
          console.error(`Failed to load ${key}.json:`, e);
          this.data[key] = [];
        }
      } else {
        this.saveTable(key);
      }
    }
  }

  public saveTable(tableName: string) {
    const filePath = path.join(this.dbDir, `${tableName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(this.data[tableName], null, 2), 'utf8');
  }

  private seedDefaults() {
    // Seed default tenant if empty
    if (this.data.tenants.length === 0) {
      const defaultTenant = {
        id: 'tenant-1111-1111-1111-1111',
        name: 'Enterprise Apex Agency',
        domain: 'agency.local',
      };
      this.data.tenants.push(defaultTenant);
      this.saveTable('tenants');
    }

    // Seed default CEO and staff if empty
    if (this.data.users.length === 0) {
      const bcrypt = require('bcrypt');
      const defaultUsers = [
        {
          id: 'user-ceo-id',
          tenant_id: 'tenant-1111-1111-1111-1111',
          email: 'ceo@agency.com',
          password_hash: bcrypt.hashSync('ceo123', 10),
          first_name: 'Alexander',
          last_name: 'Vance',
          role: 'CEO',
          status: 'active',
          mfa_enabled: false,
        },
        {
          id: 'user-designer-id',
          tenant_id: 'tenant-1111-1111-1111-1111',
          email: 'designer@agency.com',
          password_hash: bcrypt.hashSync('designer123', 10),
          first_name: 'Liam',
          last_name: 'Design',
          role: 'Designer',
          status: 'active',
          mfa_enabled: false,
        },
        {
          id: 'user-manager-id',
          tenant_id: 'tenant-1111-1111-1111-1111',
          email: 'manager@agency.com',
          password_hash: bcrypt.hashSync('manager123', 10),
          first_name: 'Olivia',
          last_name: 'Manager',
          role: 'Manager',
          status: 'active',
          mfa_enabled: false,
        },
        {
          id: 'user-tl-id',
          tenant_id: 'tenant-1111-1111-1111-1111',
          email: 'tl@agency.com',
          password_hash: bcrypt.hashSync('tl123', 10),
          first_name: 'Sarah',
          last_name: 'Lead',
          role: 'Team Leader',
          status: 'active',
          mfa_enabled: false,
        },
        {
          id: 'user-client-id',
          tenant_id: 'tenant-1111-1111-1111-1111',
          email: 'client@acme.com',
          password_hash: bcrypt.hashSync('client123', 10),
          first_name: 'John',
          last_name: 'Client',
          role: 'Client',
          status: 'active',
          mfa_enabled: false,
        }
      ];
      this.data.users = defaultUsers;
      this.saveTable('users');
    }

    // Seed default client profile mapping
    if (this.data.clients.length === 0) {
      const defaultClient = {
        id: 'client-acme-id',
        tenant_id: 'tenant-1111-1111-1111-1111',
        business_name: 'Acme Corporates Inc',
        contact_name: 'John Doe',
        mobile: '+1234567890',
        whatsapp: '+1234567890',
        email: 'john@acme.com',
        website: 'https://acme.com',
        facebook_page: 'https://facebook.com/acme',
        instagram_profile: 'https://instagram.com/acme',
        linkedin_company: 'https://linkedin.com/company/acme',
        youtube_channel: 'https://youtube.com/c/acme',
        google_business_profile: 'Acme Corp Google Business',
        meta_business_account: 'meta-acme-998',
        ad_account_ids: ['act_9812903', 'act_1092801'],
        monthly_package: 'Diamond Performance Tier',
        contract_start_date: '2026-01-01',
        contract_end_date: '2026-12-31',
        monthly_budget: 15000.00,
        lead_source: 'Google Search Ads',
        notes: 'Premium client expecting high content frequency and weekly AI summary updates.'
      };
      this.data.clients.push(defaultClient);
      this.saveTable('clients');

      // Seed default client health indicators
      const defaultHealth = {
        id: 'health-acme-id',
        client_id: 'client-acme-id',
        engagement_score: 90,
        response_score: 85,
        renewal_probability: 95,
        client_risk_score: 5,
        profitability_score: 80,
        growth_score: 90,
      };
      this.data.client_health_ai.push(defaultHealth);
      this.saveTable('client_health_ai');
    }

    // Seed default tasks
    if (this.data.tasks.length === 0) {
      this.data.tasks = [
        {
          id: 'task-1',
          tenant_id: 'tenant-1111-1111-1111-1111',
          client_id: 'client-acme-id',
          title: 'Design Hero Banner Graphic',
          description: 'Create high definition social media posts and landing page headers.',
          status: 'Todo',
          design_workflow: 'Assigned',
          priority: 'High',
          assignee_id: 'user-designer-id',
          reporter_id: 'user-manager-id',
          due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
          estimated_minutes: 180,
          actual_minutes: 0,
        },
        {
          id: 'task-2',
          tenant_id: 'tenant-1111-1111-1111-1111',
          client_id: 'client-acme-id',
          title: 'Optimize Google Ads Campaign',
          description: 'A/B test advertising headlines and prune low-performing search terms.',
          status: 'In_Progress',
          design_workflow: 'Assigned',
          priority: 'Urgent',
          assignee_id: 'user-manager-id',
          reporter_id: 'user-ceo-id',
          due_date: new Date(Date.now() + 86400000).toISOString(),
          estimated_minutes: 120,
          actual_minutes: 45,
        }
      ];
      this.saveTable('tasks');
    }
  }

  // Generic getter/setter APIs
  getTable(tableName: string): any[] {
    return this.data[tableName] || [];
  }

  insert(tableName: string, record: any): any {
    this.data[tableName].push(record);
    this.saveTable(tableName);
    return record;
  }

  update(tableName: string, id: string, updatedRecord: any): any {
    const table = this.data[tableName];
    const index = table.findIndex(r => r.id === id || r.client_id === id || r.user_id === id);
    if (index !== -1) {
      table[index] = { ...table[index], ...updatedRecord };
      this.saveTable(tableName);
      return table[index];
    }
    return null;
  }

  delete(tableName: string, id: string): boolean {
    const table = this.data[tableName];
    const initialLen = table.length;
    this.data[tableName] = table.filter(r => r.id !== id);
    this.saveTable(tableName);
    return this.data[tableName].length < initialLen;
  }
}
