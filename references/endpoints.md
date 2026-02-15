# Coolify API Endpoints Reference

Complete list of all Coolify v1 API endpoints extracted from source.

## Authentication

All endpoints (except `/health` and `/feedback`) require:
- Bearer token in `Authorization` header
- Token generated from: Keys & Tokens → API tokens

## Base URL

```
http://<ip>:8000/api/v1
```

---

## Health & System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check (no auth) |
| GET | `/v1/health` | Health check (v1 prefix) |
| GET | `/v1/version` | Get Coolify version |
| POST | `/feedback` | Submit feedback (no auth) |
| GET | `/v1/enable` | Enable API |
| GET | `/v1/disable` | Disable API |

---

## Teams

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/teams` | List all teams |
| GET | `/v1/teams/current` | Get current team |
| GET | `/v1/teams/current/members` | Get current team members |
| GET | `/v1/teams/{id}` | Get team by ID |
| GET | `/v1/teams/{id}/members` | Get team members by ID |

---

## Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/projects` | List all projects |
| POST | `/v1/projects` | Create new project |
| GET | `/v1/projects/{uuid}` | Get project by UUID |
| PATCH | `/v1/projects/{uuid}` | Update project |
| DELETE | `/v1/projects/{uuid}` | Delete project |
| GET | `/v1/projects/{uuid}/environments` | List environments |
| POST | `/v1/projects/{uuid}/environments` | Create environment |
| DELETE | `/v1/projects/{uuid}/environments/{env}` | Delete environment |
| GET | `/v1/projects/{uuid}/{env}` | Get environment details |

---

## Servers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/servers` | List all servers |
| POST | `/v1/servers` | Create new server |
| GET | `/v1/servers/{uuid}` | Get server by UUID |
| PATCH | `/v1/servers/{uuid}` | Update server |
| DELETE | `/v1/servers/{uuid}` | Delete server |
| GET | `/v1/servers/{uuid}/domains` | Get server domains |
| GET | `/v1/servers/{uuid}/resources` | Get server resources |
| GET | `/v1/servers/{uuid}/validate` | Validate server |

---

## Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/applications` | List all applications |
| POST | `/v1/applications/public` | Create from public repo |
| POST | `/v1/applications/private-github-app` | Create from private GitHub |
| POST | `/v1/applications/private-deploy-key` | Create with deploy key |
| POST | `/v1/applications/dockerfile` | Create from Dockerfile |
| POST | `/v1/applications/dockerimage` | Create from Docker image |
| GET | `/v1/applications/{uuid}` | Get application |
| PATCH | `/v1/applications/{uuid}` | Update application |
| DELETE | `/v1/applications/{uuid}` | Delete application |
| GET | `/v1/applications/{uuid}/logs` | Get application logs |
| GET\|POST | `/v1/applications/{uuid}/start` | Start application |
| GET\|POST | `/v1/applications/{uuid}/stop` | Stop application |
| GET\|POST | `/v1/applications/{uuid}/restart` | Restart application |

### Application Environment Variables

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/applications/{uuid}/envs` | List env vars |
| POST | `/v1/applications/{uuid}/envs` | Create env var |
| PATCH | `/v1/applications/{uuid}/envs/bulk` | Bulk create/update |
| PATCH | `/v1/applications/{uuid}/envs` | Update env var |
| DELETE | `/v1/applications/{uuid}/envs/{env_uuid}` | Delete env var |

---

## Databases

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/databases` | List all databases |
| POST | `/v1/databases/postgresql` | Create PostgreSQL |
| POST | `/v1/databases/mysql` | Create MySQL |
| POST | `/v1/databases/mariadb` | Create MariaDB |
| POST | `/v1/databases/mongodb` | Create MongoDB |
| POST | `/v1/databases/redis` | Create Redis |
| POST | `/v1/databases/clickhouse` | Create ClickHouse |
| POST | `/v1/databases/dragonfly` | Create Dragonfly |
| POST | `/v1/databases/keydb` | Create KeyDB |
| GET | `/v1/databases/{uuid}` | Get database |
| PATCH | `/v1/databases/{uuid}` | Update database |
| DELETE | `/v1/databases/{uuid}` | Delete database |
| GET\|POST | `/v1/databases/{uuid}/start` | Start database |
| GET\|POST | `/v1/databases/{uuid}/stop` | Stop database |
| GET\|POST | `/v1/databases/{uuid}/restart` | Restart database |

### Database Backups

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/databases/{uuid}/backups` | List backups |
| POST | `/v1/databases/{uuid}/backups` | Create backup config |
| PATCH | `/v1/databases/{uuid}/backups/{backup_uuid}` | Update backup config |
| DELETE | `/v1/databases/{uuid}/backups/{backup_uuid}` | Delete backup config |
| GET | `/v1/databases/{uuid}/backups/{backup_uuid}/executions` | List backup executions |
| DELETE | `/v1/databases/{uuid}/backups/{backup_uuid}/executions/{exec_uuid}` | Delete execution |

---

## Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/services` | List all services |
| POST | `/v1/services` | Create service |
| GET | `/v1/services/{uuid}` | Get service |
| PATCH | `/v1/services/{uuid}` | Update service |
| DELETE | `/v1/services/{uuid}` | Delete service |
| GET\|POST | `/v1/services/{uuid}/start` | Start service |
| GET\|POST | `/v1/services/{uuid}/stop` | Stop service |
| GET\|POST | `/v1/services/{uuid}/restart` | Restart service |

### Service Environment Variables

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/services/{uuid}/envs` | List env vars |
| POST | `/v1/services/{uuid}/envs` | Create env var |
| PATCH | `/v1/services/{uuid}/envs/bulk` | Bulk create/update |
| PATCH | `/v1/services/{uuid}/envs` | Update env var |
| DELETE | `/v1/services/{uuid}/envs/{env_uuid}` | Delete env var |

---

## Deployments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET\|POST | `/v1/deploy` | Trigger deployment |
| GET | `/v1/deployments` | List deployments |
| GET | `/v1/deployments/{uuid}` | Get deployment |
| POST | `/v1/deployments/{uuid}/cancel` | Cancel deployment |
| GET | `/v1/deployments/applications/{uuid}` | Get app deployments |

---

## Security (SSH Keys)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/security/keys` | List SSH keys |
| POST | `/v1/security/keys` | Create SSH key |
| GET | `/v1/security/keys/{uuid}` | Get key by UUID |
| PATCH | `/v1/security/keys/{uuid}` | Update key |
| DELETE | `/v1/security/keys/{uuid}` | Delete key |

---

## GitHub Apps

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/github-apps` | List GitHub Apps |
| POST | `/v1/github-apps` | Create GitHub App |
| PATCH | `/v1/github-apps/{id}` | Update GitHub App |
| DELETE | `/v1/github-apps/{id}` | Delete GitHub App |
| GET | `/v1/github-apps/{id}/repositories` | List repositories |
| GET | `/v1/github-apps/{id}/repositories/{owner}/{repo}/branches` | List branches |

---

## Cloud Provider Tokens

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/cloud-tokens` | List cloud tokens |
| POST | `/v1/cloud-tokens` | Create cloud token |
| GET | `/v1/cloud-tokens/{uuid}` | Get token |
| PATCH | `/v1/cloud-tokens/{uuid}` | Update token |
| DELETE | `/v1/cloud-tokens/{uuid}` | Delete token |
| POST | `/v1/cloud-tokens/{uuid}/validate` | Validate token |

---

## Hetzner Integration

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/hetzner/locations` | List locations |
| GET | `/v1/hetzner/server-types` | List server types |
| GET | `/v1/hetzner/images` | List images |
| GET | `/v1/hetzner/ssh-keys` | List SSH keys |
| POST | `/v1/servers/hetzner` | Create Hetzner server |

---

## Resources

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/resources` | List all resources |

---

## Permission Requirements

Each endpoint requires specific abilities:

| Ability | Description |
|---------|-------------|
| `read` | Read operations |
| `write` | Create/Update/Delete operations |
| `deploy` | Deployment operations |
| `sensitive` | Access to sensitive data (passwords, keys) |

Token permissions:
- `read-only` → `read` ability only
- `read:sensitive` → `read` + sensitive data access
- `*` → All abilities
