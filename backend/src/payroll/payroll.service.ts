import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database.service';

@Injectable()
export class PayrollService {
  constructor(private readonly db: DatabaseService) {}

  findAll(tenantId: string) {
    return this.db.getTable('payroll_records').filter(p => p.tenant_id === tenantId);
  }

  generatePayslip(tenantId: string, userId: string, period: string, bonusesInput = 0, deductionsInput = 0) {
    const user = this.db.getTable('users').find(u => u.id === userId && u.tenant_id === tenantId);
    if (!user) throw new NotFoundException('Employee user profile not found');

    // Default base salary profiles based on roles
    let baseSalary = 3000.00;
    switch (user.role) {
      case 'CEO': baseSalary = 12000.00; break;
      case 'Admin': baseSalary = 6000.00; break;
      case 'Manager': baseSalary = 5000.00; break;
      case 'Team Leader': baseSalary = 4200.00; break;
      case 'Designer': baseSalary = 3500.00; break;
      case 'Video Editor': baseSalary = 3600.00; break;
    }

    const allowances = Math.round(baseSalary * 0.1); // 10% standard allowance
    const gross = baseSalary + allowances + bonusesInput;
    const net = gross - deductionsInput;

    const record = {
      id: `payroll-${Date.now()}`,
      tenant_id: tenantId,
      user_id: userId,
      period,
      base_salary: baseSalary,
      allowances,
      deductions: deductionsInput,
      bonuses: bonusesInput,
      net_pay: net,
      status: 'Draft',
      payslip_pdf_url: `https://minio.local/payroll/${period}/${userId}_payslip.pdf`,
      generated_at: new Date().toISOString(),
      paid_at: null,
    };

    this.db.insert('payroll_records', record);
    return record;
  }

  async sendPayslipEmail(tenantId: string, payrollId: string) {
    const record = this.db.getTable('payroll_records').find(p => p.id === payrollId && p.tenant_id === tenantId);
    if (!record) throw new NotFoundException('Payroll record not found');

    const user = this.db.getTable('users').find(u => u.id === record.user_id);
    if (!user) throw new NotFoundException('User profile linked to payslip not found');

    // Simulate sending email
    console.log(`[MAILER] - Sending payslip email to ${user.email} for period ${record.period}. PDF: ${record.payslip_pdf_url}`);
    
    record.status = 'Paid';
    record.paid_at = new Date().toISOString();
    this.db.update('payroll_records', payrollId, record);

    return {
      success: true,
      message: `Payslip email successfully dispatched to ${user.email}`,
      paidAt: record.paid_at,
    };
  }
}
