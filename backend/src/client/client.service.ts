import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database.service';

@Injectable()
export class ClientService {
  constructor(private readonly db: DatabaseService) {}

  findAll(tenantId: string) {
    return this.db.getTable('clients').filter(c => c.tenant_id === tenantId);
  }

  findOne(tenantId: string, id: string) {
    const client = this.db.getTable('clients').find(c => c.id === id && c.tenant_id === tenantId);
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  create(tenantId: string, data: any) {
    const newClient = {
      id: `client-${Date.now()}`,
      tenant_id: tenantId,
      business_name: data.businessName,
      contact_name: data.contactName,
      mobile: data.mobile || '',
      whatsapp: data.whatsapp || '',
      email: data.email,
      website: data.website || '',
      facebook_page: data.facebookPage || '',
      instagram_profile: data.instagramProfile || '',
      linkedin_company: data.linkedinCompany || '',
      youtube_channel: data.youtubeChannel || '',
      google_business_profile: data.googleBusinessProfile || '',
      meta_business_account: data.metaBusinessAccount || '',
      ad_account_ids: data.adAccountIds || [],
      monthly_package: data.monthlyPackage || 'Standard',
      contract_start_date: data.contractStartDate || new Date().toISOString().split('T')[0],
      contract_end_date: data.contractEndDate || new Date(Date.now() + 86400000 * 365).toISOString().split('T')[0],
      monthly_budget: parseFloat(data.monthlyBudget) || 0.0,
      lead_source: data.leadSource || 'Direct',
      notes: data.notes || '',
    };

    this.db.insert('clients', newClient);

    // Initialize health scores (Client Health AI calculations)
    const initialHealth = {
      id: `health-${Date.now()}`,
      client_id: newClient.id,
      engagement_score: 80,
      response_score: 80,
      renewal_probability: 85,
      client_risk_score: 15,
      profitability_score: 75,
      growth_score: 80,
    };
    this.db.insert('client_health_ai', initialHealth);

    return newClient;
  }

  update(tenantId: string, id: string, data: any) {
    const client = this.findOne(tenantId, id);
    const updated = this.db.update('clients', id, { ...client, ...data });
    return updated;
  }

  getHealth(clientId: string) {
    const health = this.db.getTable('client_health_ai').find(h => h.client_id === clientId);
    if (!health) {
      // Create defaults on demand if missing
      const defaultHealth = {
        id: `health-${Date.now()}`,
        client_id: clientId,
        engagement_score: 75,
        response_score: 75,
        renewal_probability: 80,
        client_risk_score: 20,
        profitability_score: 70,
        growth_score: 75,
      };
      this.db.insert('client_health_ai', defaultHealth);
      return defaultHealth;
    }
    return health;
  }

  delete(tenantId: string, id: string) {
    this.findOne(tenantId, id); // validates exists
    this.db.delete('clients', id);
    // clean health
    const health = this.db.getTable('client_health_ai').find(h => h.client_id === id);
    if (health) {
      this.db.delete('client_health_ai', health.id);
    }
    return { success: true };
  }
}
