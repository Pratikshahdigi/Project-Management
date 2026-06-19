-- Database Schema for Agency Operating System (Agency OS)
-- Target Database: PostgreSQL 15+

-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tenants Table (Isolation Layer)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table (Employees and Agency Staff)
CREATE TYPE user_role AS ENUM (
    'CEO', 'Admin', 'Manager', 'Team Leader', 'Designer', 'Video Editor', 
    'Social Media Executive', 'SEO Executive', 'Google Ads Executive', 
    'Meta Ads Executive', 'Sales Executive', 'HR', 'Accountant', 'Client'
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role user_role NOT NULL DEFAULT 'Designer',
    mfa_secret VARCHAR(255),
    mfa_enabled BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'active', -- active, suspended, invited
    phone VARCHAR(50),
    profile_picture_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_tenant_email UNIQUE(tenant_id, email)
);

-- 3. Teams and Departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    lead_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Team Members mapping
CREATE TABLE team_members (
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (team_id, user_id)
);

-- 4. Client CRM Table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(50),
    whatsapp VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    facebook_page VARCHAR(255),
    instagram_profile VARCHAR(255),
    linkedin_company VARCHAR(255),
    youtube_channel VARCHAR(255),
    google_business_profile VARCHAR(255),
    meta_business_account VARCHAR(255),
    ad_account_ids TEXT[], -- Array of Facebook/Google ad accounts
    monthly_package VARCHAR(100),
    contract_start_date DATE,
    contract_end_date DATE,
    assigned_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    monthly_budget NUMERIC(15, 2) DEFAULT 0.00,
    lead_source VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Client Health Metrics (Calculated by local AI engine)
CREATE TABLE client_health_ai (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE UNIQUE,
    engagement_score INT CHECK (engagement_score BETWEEN 0 AND 100),
    response_score INT CHECK (response_score BETWEEN 0 AND 100),
    renewal_probability INT CHECK (renewal_probability BETWEEN 0 AND 100),
    client_risk_score INT CHECK (client_risk_score BETWEEN 0 AND 100),
    profitability_score INT CHECK (profitability_score BETWEEN 0 AND 100),
    growth_score INT CHECK (growth_score BETWEEN 0 AND 100),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Client User Mapping (For Client Portal logins)
CREATE TABLE client_users (
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (client_id, user_id)
);

-- 5. Tasks and Project Management (ClickUp/Jira Alternative)
CREATE TYPE task_status AS ENUM (
    'Backlog', 'Todo', 'In_Progress', 'In_Review', 'Approved', 'Completed'
);

CREATE TYPE design_workflow_step AS ENUM (
    'Assigned', 'In_Design', 'TL_Review', 'Manager_Review', 'Social_Queue', 'Published'
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status task_status DEFAULT 'Todo',
    design_workflow design_workflow_step DEFAULT 'Assigned',
    priority VARCHAR(50) DEFAULT 'Medium', -- Low, Medium, High, Urgent
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    estimated_minutes INT DEFAULT 0,
    actual_minutes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Social Media Management & Meta Publishing Queue
CREATE TYPE social_platform AS ENUM (
    'Facebook', 'Instagram', 'LinkedIn', 'Threads', 'YouTube', 'GoogleBusinessProfile'
);

CREATE TYPE post_status AS ENUM (
    'Draft', 'Pending_Approval', 'Approved', 'Scheduled', 'Published', 'Failed', 'Missed'
);

CREATE TABLE social_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_urls TEXT[], -- Array of MinIO image/video links
    platforms social_platform[] NOT NULL,
    status post_status DEFAULT 'Draft',
    scheduled_time TIMESTAMP WITH TIME ZONE,
    published_time TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    escalated_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    logs TEXT, -- API response logs/errors
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Employee Tracking & Daily Work Planner
CREATE TABLE employee_work_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    login_time TIMESTAMP WITH TIME ZONE,
    logout_time TIMESTAMP WITH TIME ZONE,
    break_time_seconds INT DEFAULT 0,
    idle_time_seconds INT DEFAULT 0,
    work_time_seconds INT DEFAULT 0,
    productivity_score INT DEFAULT 0 CHECK (productivity_score BETWEEN 0 AND 100),
    performance_score INT DEFAULT 0 CHECK (performance_score BETWEEN 0 AND 100),
    achievement_score INT DEFAULT 0 CHECK (achievement_score BETWEEN 0 AND 100),
    location_data VARCHAR(255),
    CONSTRAINT unique_user_date UNIQUE(user_id, date)
);

CREATE TABLE employee_screens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    screenshot_url VARCHAR(512) NOT NULL,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    active_app VARCHAR(255),
    active_url VARCHAR(512),
    mouse_clicks INT DEFAULT 0,
    key_presses INT DEFAULT 0,
    is_idle BOOLEAN DEFAULT FALSE
);

CREATE TABLE employee_consent (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
    consent_given BOOLEAN DEFAULT FALSE,
    signed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(100)
);

-- 8. Sales CRM (HubSpot Alternative)
CREATE TYPE sales_stage AS ENUM (
    'Lead', 'Qualified', 'Meeting', 'Proposal', 'Negotiation', 'Won', 'Lost'
);

CREATE TABLE sales_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    stage sales_stage DEFAULT 'Lead',
    expected_revenue NUMERIC(15, 2) DEFAULT 0.00,
    probability INT DEFAULT 10,
    source VARCHAR(100),
    assigned_sales_rep UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Payroll System
CREATE TABLE payroll_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    period VARCHAR(20) NOT NULL, -- e.g., "2026-06"
    base_salary NUMERIC(15, 2) NOT NULL,
    allowances NUMERIC(15, 2) DEFAULT 0.00,
    deductions NUMERIC(15, 2) DEFAULT 0.00,
    bonuses NUMERIC(15, 2) DEFAULT 0.00,
    net_pay NUMERIC(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft', -- Draft, Approved, Paid
    payslip_pdf_url VARCHAR(512),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP WITH TIME ZONE
);

-- 10. Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    target VARCHAR(255) NOT NULL,
    ip_address VARCHAR(100),
    user_agent VARCHAR(512),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance & isolation searches
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_clients_tenant ON clients(tenant_id);
CREATE INDEX idx_tasks_tenant_status ON tasks(tenant_id, status);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_social_posts_scheduled ON social_posts(scheduled_time) WHERE status = 'Scheduled';
CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_work_logs_user_date ON employee_work_logs(user_id, date);

-- Auto-update timestamps trigger function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tenants_modtime BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_clients_modtime BEFORE UPDATE ON clients FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_tasks_modtime BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_social_posts_modtime BEFORE UPDATE ON social_posts FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_sales_leads_modtime BEFORE UPDATE ON sales_leads FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
