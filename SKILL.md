---
name: coolify
description: Manage Coolify PaaS instances via API - deploy applications, manage servers, databases, services, and projects. Use when the user wants to interact with their Coolify self-hosted PaaS, trigger deployments, check server status, create databases, or manage applications.
---

# Coolify API Skill

Manage Coolify PaaS instances via the REST API.

## Configuration

Set these environment variables or create `.env` in the skill directory:

```
COOLIFY_URL=http://<ip>:8000
COOLIFY_TOKEN=<your-api-token>
```

Generate a token in Coolify UI: **Keys & Tokens → API tokens → Create New Token**

**Token Permissions:**
- `read-only` — Read data only (default)
- `read:sensitive` — Read + see sensitive data (passwords, keys)
- `*` — Full access (read, write, deploy, delete)

## Quick Reference

All endpoints use `GET /api/v1/...` with `Authorization: Bearer <token>`.

| Resource | Endpoints |
|----------|-----------|
| **Health** | `GET /health`, `GET /api/v1/health` |
| **Servers** | `GET /api/v1/servers`, `GET /api/v1/servers/{uuid}` |
| **Applications** | `GET /api/v1/applications`, `POST /api/v1/applications/...` |
| **Databases** | `GET /api/v1/databases`, `POST /api/v1/databases/{type}` |
| **Services** | `GET /api/v1/services`, `POST /api/v1/services` |
| **Projects** | `GET /api/v1/projects`, `POST /api/v1/projects` |
| **Deploy** | `POST /api/v1/deploy`, `GET /api/v1/deployments` |

## Common Operations

### Check API Health
```bash
curl -s "${COOLIFY_URL}/api/v1/health"
```

### List All Servers
```bash
curl -s -H "Authorization: Bearer ${COOLIFY_TOKEN}" \
  "${COOLIFY_URL}/api/v1/servers" | jq
```

### List Applications
```bash
curl -s -H "Authorization: Bearer ${COOLIFY_TOKEN}" \
  "${COOLIFY_URL}/api/v1/applications" | jq
```

### Deploy Application
```bash
curl -X POST -H "Authorization: Bearer ${COOLIFY_TOKEN}" \
  "${COOLIFY_URL}/api/v1/applications/${UUID}/start"
```

### Get Application Logs
```bash
curl -s -H "Authorization: Bearer ${COOLIFY_TOKEN}" \
  "${COOLIFY_URL}/api/v1/applications/${UUID}/logs" | jq
```

### Create Database (PostgreSQL)
```bash
curl -X POST -H "Authorization: Bearer ${COOLIFY_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"server_uuid":"...","project_uuid":"...","environment_name":"production"}' \
  "${COOLIFY_URL}/api/v1/databases/postgresql"
```

## Scripts

Use the helper script for common operations:

```bash
./scripts/coolify.sh servers
./scripts/coolify.sh apps
./scripts/coolify.sh deploy <app-uuid>
./scripts/coolify.sh logs <app-uuid>
./scripts/coolify.sh databases
```

## API Reference

See [references/endpoints.md](references/endpoints.md) for complete endpoint documentation.
