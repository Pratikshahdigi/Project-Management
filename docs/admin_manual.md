# Admin Manual: Agency Operating System (Agency OS)

This guide documents administrative tasks, security configurations, database backups, and local AI model adjustments.

---

## 1. Setting Up Screen Monitoring (Optional)
The system supports capturing desktop activity, app targets, and mouse logs.

> [!CAUTION]
> **Employee Consent Requirement:** Screen tracking is disabled by default. Admins must request employees to sign their digital consent. If no consent is signed, screenshot endpoints return 400 Bad Request.

### 1.1. How to Enable
1. Admin edits global parameters inside `users` data records.
2. The user logs in and gets prompted with the **Consent Authorization Banner**.
3. Once accepted, the worker process is allowed to stream screenshot hashes. All visual logs apply a local blur filter to protect private/personal details.

---

## 2. Database Backup & Disaster Recovery
We recommend scheduled Postgres database dumps.

### 2.1. Backing Up PostgreSQL
Execute:
```bash
docker exec -t agency-os-postgres pg_dumpall -c -U agency_admin > /path-to-backups/agency_os_backup_$(date +%F).sql
```

### 2.2. Restoring PostgreSQL
Execute:
```bash
cat /path-to-backups/agency_os_backup_xxxx.sql | docker exec -i agency-os-postgres psql -U agency_admin -d agency_os
```

---

## 3. Customizing local AI Models
The local vector store uses Ollama REST commands.

### 3.1. Switch to Qwen or DeepSeek
To switch from Llama 3 to Qwen2.5:
1. Access the host terminal.
2. Download model files:
   ```bash
   ollama pull qwen2.5:8b
   ```
3. Update env params inside your docker compose setup:
   `OLLAMA_MODEL=qwen2.5:8b`
4. Rebuild background containers:
   ```bash
   docker-compose up -d --no-deps backend
   ```
---

## 4. Auditing Administrative Actions
Inspect user logs via `Security Auditing` dashboard views.
Every tenant query writes details of:
- Timestamp & action flag
- Email and Role parameters
- Request IP address
- Target entity modified
- Payload changes (JSON format)
