import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database.service';

@Injectable()
export class SalesService {
  constructor(private readonly db: DatabaseService) {}

  findAll(tenantId: string) {
    return this.db.getTable('sales_leads').filter(l => l.tenant_id === tenantId);
  }

  create(tenantId: string, data: any) {
    const newLead = {
      id: `lead-${Date.now()}`,
      tenant_id: tenantId,
      company_name: data.companyName,
      contact_name: data.contactName,
      email: data.email,
      phone: data.phone || '',
      stage: data.stage || 'Lead',
      expected_revenue: parseFloat(data.expectedRevenue) || 0.0,
      probability: data.probability || 10,
      source: data.source || 'Website Query',
      assigned_sales_rep: data.assignedSalesRep || 'user-ceo-id',
      notes: data.notes || '',
    };
    this.db.insert('sales_leads', newLead);
    return newLead;
  }

  updateStage(id: string, stage: string, probability?: number) {
    const leads = this.db.getTable('sales_leads');
    const lead = leads.find(l => l.id === id);
    if (!lead) throw new NotFoundException('Lead not found');

    lead.stage = stage;
    if (probability !== undefined) {
      lead.probability = probability;
    } else {
      // Default probability mapping by pipeline tier
      switch (stage) {
        case 'Lead': lead.probability = 10; break;
        case 'Qualified': lead.probability = 25; break;
        case 'Meeting': lead.probability = 50; break;
        case 'Proposal': lead.probability = 70; break;
        case 'Negotiation': lead.probability = 85; break;
        case 'Won': lead.probability = 100; break;
        case 'Lost': lead.probability = 0; break;
      }
    }

    this.db.update('sales_leads', id, lead);
    return lead;
  }

  getSalesPerformance(tenantId: string) {
    const leads = this.findAll(tenantId);
    const totalCount = leads.length;
    const wonCount = leads.filter(l => l.stage === 'Won').length;
    const lostCount = leads.filter(l => l.stage === 'Lost').length;
    
    const conversionRate = totalCount > 0 ? ((wonCount / (totalCount - lostCount || 1)) * 100).toFixed(1) : '0.0';
    
    const pipelineRevenue = leads
      .filter(l => l.stage !== 'Won' && l.stage !== 'Lost')
      .reduce((sum, l) => sum + (l.expected_revenue * (l.probability / 100)), 0);

    const wonRevenue = leads
      .filter(l => l.stage === 'Won')
      .reduce((sum, l) => sum + l.expected_revenue, 0);

    return {
      totalLeads: totalCount,
      conversionRate: parseFloat(conversionRate),
      weightedPipelineValue: pipelineRevenue,
      actualWonRevenue: wonRevenue,
      stageCounts: {
        Lead: leads.filter(l => l.stage === 'Lead').length,
        Qualified: leads.filter(l => l.stage === 'Qualified').length,
        Meeting: leads.filter(l => l.stage === 'Meeting').length,
        Proposal: leads.filter(l => l.stage === 'Proposal').length,
        Negotiation: leads.filter(l => l.stage === 'Negotiation').length,
        Won: wonCount,
        Lost: lostCount,
      }
    };
  }
}
