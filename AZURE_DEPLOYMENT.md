# Azure Deployment Guide

Complete guide for deploying the Drilling Equipment Tracking System to Azure App Service with Azure Database for PostgreSQL.

## Prerequisites

- Azure subscription with active credits
- Azure CLI installed (`az --version` to check)
- Node.js 18+ installed locally
- Git initialized in project

## Architecture Overview

**Services Used:**
- **Azure App Service**: Hosts the Next.js application (Node.js 18+ runtime)
- **Azure Database for PostgreSQL - Flexible Server**: PostgreSQL database with SSL
- **Azure Application Insights** (Optional): Monitoring and logging

## Step 1: Create Azure Database for PostgreSQL

### Using Azure Portal

1. Navigate to Azure Portal → Create a resource → Azure Database for PostgreSQL
2. Select **Flexible Server**
3. Configure:
   - **Server name**: `drill-tracking-db` (must be unique)
   - **Region**: Choose closest to users
   - **PostgreSQL version**: 14 or higher
   - **Compute + storage**: Burstable, B1ms (1 vCore, 2GB RAM) for development
   - **Admin username**: `dbadmin`
   - **Password**: Create strong password (save securely!)
4. **Networking**:
   - Public access (allowed IP addresses)
   - Check "Allow public access from any Azure service"
5. Create and wait for deployment

### Using Azure CLI

```bash
# Login to Azure
az login

# Create resource group
az group create --name drill-tracking-rg --location eastus

# Create PostgreSQL server
az postgres flexible-server create \
  --resource-group drill-tracking-rg \
  --name drill-tracking-db \
  --location eastus \
  --admin-user dbadmin \
  --admin-password YourStrongPassword123! \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 14 \
  --storage-size 32

# Configure firewall (allow Azure services)
az postgres flexible-server firewall-rule create \
  --resource-group drill-tracking-rg \
  --name drill-tracking-db \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### Get Connection String

After creation, get the connection string:

```
Server: drill-tracking-db.postgres.database.azure.com
Port: 5432
Database: postgres (default)
Username: dbadmin
Password: [your-password]
SSL Mode: require
```

Formatted connection string:
```
postgresql://dbadmin:[password]@drill-tracking-db.postgres.database.azure.com:5432/postgres?sslmode=require
```

## Step 2: Run Database Migrations

### Local Setup (First Time)

1. Update `.env` with Azure database URL:
```bash
DATABASE_URL="postgresql://dbadmin:[password]@drill-tracking-db.postgres.database.azure.com:5432/postgres?sslmode=require"
```

2. Generate Prisma client:
```bash
npx prisma generate
```

3. Run migrations:
```bash
npx prisma migrate deploy
```

4. Seed database (optional):
```bash
npx prisma db seed
```

## Step 3: Create Azure App Service

### Using Azure Portal

1. Create a resource → Web App
2. Configure:
   - **Name**: `drill-tracking-app` (becomes drill-tracking-app.azurewebsites.net)
   - **Runtime**: Node 18 LTS
   - **Operating System**: Linux
   - **Region**: Same as database
   - **Pricing**: Basic B1 for production, Free F1 for testing
3. Create and wait for deployment

### Using Azure CLI

```bash
# Create App Service Plan
az appservice plan create \
  --resource-group drill-tracking-rg \
  --name drill-tracking-plan \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group drill-tracking-rg \
  --plan drill-tracking-plan \
  --name drill-tracking-app \
  --runtime "NODE:18-lts"
```

## Step 4: Configure App Service Settings

### Set Environment Variables

Navigate to App Service → Configuration → Application settings, add:

```
DATABASE_URL = postgresql://dbadmin:[password]@drill-tracking-db.postgres.database.azure.com:5432/postgres?sslmode=require
NODE_ENV = production
AZURE_APP_SERVICE = true
```

**Important**: Click "Save" after adding all settings.

### Using Azure CLI

```bash
az webapp config appsettings set \
  --resource-group drill-tracking-rg \
  --name drill-tracking-app \
  --settings \
    DATABASE_URL="postgresql://dbadmin:[password]@drill-tracking-db.postgres.database.azure.com:5432/postgres?sslmode=require" \
    NODE_ENV="production" \
    AZURE_APP_SERVICE="true"
```

## Step 5: Deploy Application

### Option A: GitHub Actions (Recommended)

1. In Azure Portal → App Service → Deployment Center
2. Select **GitHub** as source
3. Authorize Azure to access your GitHub
4. Select repository and branch
5. Azure will create `.github/workflows/azure-webapps-node.yml`

Example workflow file:
```yaml
name: Build and deploy Node.js app to Azure

on:
  push:
    branches: [ main ]

env:
  AZURE_WEBAPP_NAME: drill-tracking-app
  NODE_VERSION: '18.x'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Build application
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: node-app
          path: .

  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: 'Production'
      url: ${{ steps.deploy-to-webapp.outputs.webapp-url }}

    steps:
      - name: Download artifact
        uses: actions/download-artifact@v3
        with:
          name: node-app

      - name: Deploy to Azure Web App
        id: deploy-to-webapp
        uses: azure/webapps-deploy@v2
        with:
          app-name: ${{ env.AZURE_WEBAPP_NAME }}
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
```

### Option B: Local Git Deployment

```bash
# Get deployment credentials
az webapp deployment list-publishing-credentials \
  --resource-group drill-tracking-rg \
  --name drill-tracking-app

# Add Azure remote
git remote add azure https://drill-tracking-app.scm.azurewebsites.net/drill-tracking-app.git

# Push to Azure
git push azure main
```

### Option C: ZIP Deployment

```bash
# Build locally
npm run build

# Create ZIP
zip -r deploy.zip .next node_modules package.json prisma public

# Deploy ZIP
az webapp deployment source config-zip \
  --resource-group drill-tracking-rg \
  --name drill-tracking-app \
  --src deploy.zip
```

## Step 6: Configure Startup Command

App Service needs custom startup command for Next.js:

Navigate to Configuration → General settings → Startup Command:
```bash
npm run start
```

Or via CLI:
```bash
az webapp config set \
  --resource-group drill-tracking-rg \
  --name drill-tracking-app \
  --startup-file "npm run start"
```

## Step 7: Run Post-Deployment Migrations

If you update the schema, run migrations on Azure:

```bash
# SSH into App Service
az webapp ssh --resource-group drill-tracking-rg --name drill-tracking-app

# Inside container
npx prisma migrate deploy
```

Or add to deployment script:
```json
// package.json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma migrate deploy && next build"
  }
}
```

## Step 8: Verify Deployment

1. Navigate to `https://drill-tracking-app.azurewebsites.net`
2. Test creating workers and drills
3. Test starting/stopping drilling sessions
4. Check reports page for real-time updates

## Step 9: Enable Monitoring (Optional)

### Application Insights

1. Create Application Insights resource
2. Get Instrumentation Key
3. Add to App Service configuration:
```
APPLICATIONINSIGHTS_CONNECTION_STRING = [your-connection-string]
```

4. Install package:
```bash
npm install applicationinsights
```

5. Add to `instrumentation.ts`:
```typescript
import * as appInsights from 'applicationinsights'

if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
  appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .start()
}
```

## Troubleshooting

### Issue: "Cannot connect to database"
- Check DATABASE_URL is set correctly in App Service configuration
- Verify firewall rules allow Azure services
- Ensure SSL mode is `require`

### Issue: "Prisma Client not generated"
- Add `npx prisma generate` to build script
- Check `postinstall` script runs `prisma generate`

### Issue: "Application won't start"
- Check logs: `az webapp log tail --resource-group drill-tracking-rg --name drill-tracking-app`
- Verify startup command is `npm run start`
- Check Node version matches (18+)

### Issue: "Real-time updates not working"
- Ensure polling works (check browser network tab)
- Verify API routes are accessible
- Check CORS settings if using custom domain

## Cost Optimization

**Development:**
- Database: Burstable B1ms (~$12/month)
- App Service: Free F1 (free tier)
- **Total**: ~$12/month

**Production:**
- Database: General Purpose D2s v3 (~$120/month)
- App Service: Standard S1 (~$70/month)
- Application Insights: ~$10/month
- **Total**: ~$200/month

**Cost-saving tips:**
- Use Burstable database tier for low traffic
- Scale down during off-hours
- Use Azure Reserved Instances for 1-3 year commitment (up to 72% savings)

## Security Best Practices

1. **Enable HTTPS Only**:
```bash
az webapp update --resource-group drill-tracking-rg --name drill-tracking-app --https-only true
```

2. **Restrict database access**:
   - Only allow specific IP ranges
   - Use Private Endpoints for enhanced security

3. **Use Managed Identity** (future enhancement):
   - Remove hardcoded connection strings
   - Use Azure Key Vault for secrets

4. **Enable Web Application Firewall** (WAF)
   - Add Azure Front Door or Application Gateway

## Maintenance

### Backup Database
```bash
az postgres flexible-server backup create \
  --resource-group drill-tracking-rg \
  --name drill-tracking-db \
  --backup-name manual-backup-$(date +%Y%m%d)
```

### Update Dependencies
```bash
npm update
npm audit fix
```

### Scale Resources
```bash
# Scale App Service
az appservice plan update --resource-group drill-tracking-rg --name drill-tracking-plan --sku S1

# Scale Database
az postgres flexible-server update \
  --resource-group drill-tracking-rg \
  --name drill-tracking-db \
  --sku-name Standard_D2s_v3
```

## Support

For issues:
1. Check Azure Portal logs
2. Review Application Insights metrics
3. Check GitHub Actions workflow logs
4. Contact Azure Support for infrastructure issues
