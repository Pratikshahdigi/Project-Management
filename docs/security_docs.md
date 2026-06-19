# Security Protocols & Compliance Documentation: Agency OS

This document details security measures implemented across the frontend, backend, database layers, and orchestration configs to meet OWASP Top 10 guidelines and strict enterprise requirements.

---

## 1. Authentication & Session Security

### 1.1. JWT Access & Refresh Token Rotation
- **Access Tokens:** Signed with HMAC-SHA256. Lifetime set to `15m`. Contains `userId`, `role`, and `tenantId`.
- **Refresh Tokens:** Stored in database as a hashed string. Life span is `7d`. Placed in cookies with options:
  - `HttpOnly` (Not readable via JS)
  - `Secure` (Transmitted only via TLS/HTTPS)
  - `SameSite: Strict` (Protects against CSRF attacks)

### 1.2. Two-Factor Authentication (2FA)
- Time-based One-time Password (TOTP) algorithm (RFC 6238).
- Users enable 2FA by scanning a QR code containing an issuer label matching `AgencyOS:<email>`.
- Token verification occurs before login completes if MFA is enabled.

---

## 2. Multi-Tenant Isolation
Multi-tenant isolation is enforced at the database level and application middleware layer:

### 2.1. Request Interception
All API controllers check for the presence of a verified `tenantId` parameter embedded in the JWT payload.

### 2.2. Query Constraints
Every SQL/TypeORM lookup must explicitly query using the tenant scope parameter:
```sql
SELECT * FROM clients WHERE id = $1 AND tenant_id = $2;
```

---

## 3. Data Encryption

### 3.1. Transit Encryption (TLS)
- Enforcement of TLS 1.3 protocol.
- HTTP Strict Transport Security (HSTS) headers:
  ```http
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  ```

### 3.2. Rest Encryption (AES-256-GCM)
Sensitive fields like credentials, API secret keys (e.g. Meta API Graph Keys), and MFA parameters are encrypted at rest using AES-256-GCM.
- Encryption key is loaded at runtime via environment variable (`ENCRYPTION_SECRET_KEY`).

---

## 4. OWASP Top 10 Protections

### 4.1. Injection Protections
- Parametrization of all SQL queries via TypeORM database driver.
- Input validation sanitizes all string attributes to strip potential script contents.

### 4.2. XSS (Cross-Site Scripting)
- Implementation of Helmet middleware header policies.
- Content Security Policy (CSP) configurations restrict execution of arbitrary script injection patterns.

### 4.3. CSRF (Cross-Site Request Forgery)
- Cookie-based anti-CSRF token synchronization validated by NestJS middleware endpoints for write requests.
