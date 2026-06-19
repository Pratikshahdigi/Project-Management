# Deployment Guide: Agency Operating System (Agency OS)

This guide walks through deploying the self-hosted Agency OS on local Windows Servers, Ubuntu VPS, Dedicated Servers, Docker, and Kubernetes clusters.

---

## 1. Quick Start: Docker Compose
The easiest way to run the entire self-hosted stack locally.

### Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine.
- Ensure ports `3000`, `3001`, `5432`, `6379`, `9000`, and `11434` are free.

### Run Containers
1. Navigate to the project root directory containing `docker-compose.yml`.
2. Execute:
   ```bash
   docker-compose up -d --build
   ```
3. Once running, pull and load the local AI models inside the Ollama container:
   ```bash
   docker exec -it agency-os-ollama ollama run llama3
   ```
4. Access portals:
   - **Frontend App:** `http://localhost:3000`
   - **Backend API:** `http://localhost:3001/api/v1`
   - **Swagger Docs:** `http://localhost:3001/api-docs`
   - **MinIO Storage Console:** `http://localhost:9001` (Creds: `minio_admin` / `minio_secure_password`)

---

## 2. Production VPS: Ubuntu Setup
For running directly on bare-metal servers or private virtual machines without container overhead.

### 2.1. System Requirements
- Ubuntu 20.04 or 22.04 LTS.
- Min 4GB RAM (8GB+ recommended if running Ollama LLM models locally).
- PostgreSQL 15, Redis, Nginx, Node.js 18.

### 2.2. Install Prerequisites
```bash
sudo apt update
sudo apt install -y curl gnupg2 ca-certificates lsb-release ubuntu-keyring postgresql redis-server nginx
```

### 2.3. Node.js & PM2 Setup
Install Node and PM2 process manager to daemonize Node.js background runloops:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -y -g pm2
```

### 2.4. Run Backend & Frontend
1. Clone your private repository inside `/var/www/agency-os/`.
2. Configure environment variables in a `/var/www/agency-os/backend/.env` file.
3. Build and run backend via PM2:
   ```bash
   cd /var/www/agency-os/backend
   npm install
   npm run build
   pm2 start dist/src/main.js --name "agency-os-backend"
   ```
4. Build and run frontend:
   ```bash
   cd /var/www/agency-os/frontend
   npm install
   npm run build
   pm2 start npm --name "agency-os-frontend" -- start
   ```
5. Save PM2 lists to boot automatically on server power-on:
   ```bash
   pm2 save
   pm2 startup
   ```

### 2.5. Local Ollama Server Setup
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama run llama3
```

---

## 3. Local Windows Server Deployment
Run the platform on Windows Server environments.

### 3.1. Prerequisites
- Install [Node.js 18 (LTS)](https://nodejs.org/).
- Install [PostgreSQL Windows Installer](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
- Install [Ollama for Windows](https://ollama.com/download/windows).

### 3.2. Run via Windows Services (NSSM)
Use the Non-Sucking Service Manager (NSSM) to run Node applications as native Windows Services:
1. Download NSSM and place it on your system PATH.
2. Install the backend service:
   ```cmd
   nssm install AgencyOSBackend "C:\Program Files\nodejs\node.exe" "C:\path-to-project\backend\dist\src\main.js"
   nssm start AgencyOSBackend
   ```
3. Install the frontend service:
   ```cmd
   nssm install AgencyOSFrontend "C:\Program Files\nodejs\npm.cmd" "run start"
   nssm set AgencyOSFrontend AppDirectory "C:\path-to-project\frontend"
   nssm start AgencyOSFrontend
   ```

---

## 4. Kubernetes Deployment
Enables large scale auto-scaling orchestrations.

### 4.1. Run Manifests
```bash
kubectl apply -f ./k8s/deployment.yaml
```
Verify pods are healthy:
```bash
kubectl get pods
```
