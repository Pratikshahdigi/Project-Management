# API Specification: Agency OS

Base Path: `/api/v1`

## 1. Authentication Module

### Login (`POST /auth/login`)
Authenticates the user and returns JWT access & refresh tokens.
- **Request Body:**
  ```json
  {
    "email": "ceo@agency.com",
    "password": "securepassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "mfaRequired": false,
    "user": {
      "id": "uuid-1234",
      "email": "ceo@agency.com",
      "role": "CEO"
    }
  }
  ```

### Enable Multi-Factor Authentication (`POST /auth/2fa/enable`)
Generates MFA secret key and QR code.
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  {
    "qrCodeUrl": "data:image/png;base64,iVBOR...",
    "secret": "JBSWY3DPEHPK3PXP"
  }
  ```

---

## 2. Client CRM & Health AI

### List Clients (`GET /clients`)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  [
    {
      "id": "client-uuid",
      "businessName": "Acme Corp",
      "contactName": "John Doe",
      "email": "john@acme.com",
      "monthlyBudget": 5000.00
    }
  ]
  ```

### Get Client Health Metrics (`GET /clients/:id/health`)
Retrieves the AI calculated metrics.
- **Response (200 OK):**
  ```json
  {
    "clientId": "client-uuid",
    "engagementScore": 85,
    "responseScore": 92,
    "renewalProbability": 90,
    "clientRiskScore": 10,
    "profitabilityScore": 75,
    "growthScore": 88
  }
  ```

---

## 3. Social Media Management

### Create Post (`POST /social/posts`)
Creates a social post and initializes the designer/manager approval pipeline.
- **Request Body:**
  ```json
  {
    "clientId": "client-uuid",
    "content": "Exciting news! Check out our new local AI models launch.",
    "mediaUrls": ["https://minio.local/assets/post-img.jpg"],
    "platforms": ["Facebook", "Instagram", "LinkedIn"],
    "scheduledTime": "2026-06-20T12:00:00Z"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": "post-uuid",
    "status": "Draft",
    "created_at": "2026-06-16T15:16:00Z"
  }
  ```

### Approve Post Workflow (`POST /social/posts/:id/approve`)
Approves the post state for the next review tier.
- **Request Body:**
  ```json
  {
    "comments": "Approved by Team Lead."
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "id": "post-uuid",
    "status": "Pending_Approval",
    "step": "Manager_Review"
  }
  ```

---

## 4. Employee Logs & Screen Monitoring

### Post Screenshot Metadata (`POST /employees/screenshot`)
- **Request Body:**
  ```json
  {
    "activeApp": "VS Code",
    "activeUrl": "",
    "screenshotBase64": "data:image/jpeg;base64,...",
    "mouseClicks": 45,
    "keyPresses": 120,
    "isIdle": false
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "status": "logged",
    "blurApplied": true
  }
  ```

---

## 5. AI Service & Agency Brain

### Conversational Prompt Query (`POST /ai/query`)
Ask natural language questions to the Ollama Llama3 model index.
- **Request Body:**
  ```json
  {
    "prompt": "Show clients likely to leave."
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "response": "Acme Corp is flagged as a renewal risk (Renewal Probability: 40%) due to a drop in engagement (Engagement Score: 35%) and increased response latency (Response Score: 20%).",
    "citations": ["clients/client-uuid"]
  }
  ```
