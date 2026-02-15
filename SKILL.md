---
name: coolify
description: Manage Coolify PaaS instances via API - deploy applications, manage servers, databases, services, and projects. Use when the user wants to interact with their Coolify self-hosted PaaS, trigger deployments, check server status, create databases, or manage applications.
---

# Coolify API Skill

Manage Coolify PaaS instances via the REST API using TypeScript.

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

## Installation

```bash
npm install
npm run build
```

## Quick Reference

### CLI Commands

```bash
# System
coolify health              # Check API health
coolify version             # Get Coolify version

# Projects
coolify projects            # List all projects
coolify project <uuid>      # Get project details
coolify project-create <name> [description]
coolify project-delete <uuid>
coolify environments <project-uuid>
coolify environment-create <project-uuid> <name>

# Servers
coolify servers             # List all servers
coolify server <uuid>       # Get server details
coolify server-validate <uuid>

# Applications
coolify apps                # List all applications
coolify app <uuid>          # Get application details
coolify app-create <project-uuid> <env> <name> [build-pack]
coolify app-delete <uuid>
coolify start <uuid>        # Start application
coolify stop <uuid>         # Stop application
coolify restart <uuid>      # Restart application
coolify deploy <uuid>       # Deploy application
coolify logs <uuid>         # Get application logs
coolify app-envs <uuid>     # List environment variables

# Databases
coolify databases           # List all databases
coolify database <uuid>    # Get database details
coolify db-create <type> <server-uuid> <project-uuid> <env> <name>
coolify db-delete <uuid>
coolify db-start <uuid>
coolify db-stop <uuid>

# Services
coolify services            # List all services
coolify service <uuid>      # Get service details
coolify service-delete <uuid>

# Deployments
coolify deployments         # List all deployments
coolify deployment <uuid>  # Get deployment details
coolify deployment-cancel <uuid>

# Other
coolify resources           # List all resources
coolify teams               # List teams
coolify ssh-keys            # List SSH keys
coolify github-apps         # List GitHub apps
coolify cloud-tokens        # List cloud tokens
```

### TypeScript API

```typescript
import { createClient } from "./coolify";
import { Application, Deployment } from "./types";

const client = createClient();

// List applications
const apps = await client.getApplications();

// Deploy
const deployment = await client.deploy({
  resourceUuid: "uuid",
  resourceType: "application",
});

// Control application
await client.startApplication("uuid");
await client.stopApplication("uuid");
await client.restartApplication("uuid");

// Logs
const logs = await client.getApplicationLogs("uuid");

// Databases
const db = await client.createDatabase("postgresql", {
  serverUuid: "...",
  projectUuid: "...",
  environmentName: "production",
  name: "mydb",
});
```

### Database Types

Supported database types:
- `postgresql`
- `mysql`
- `mariadb`
- `mongodb`
- `redis`
- `clickhouse`
- `dragonfly`
- `keydb`

## API Reference

See [references/endpoints.md](references/endpoints.md) for complete endpoint documentation.

## References

- **Coolify Repository:** https://github.com/coollabsio/coolify
- **API Documentation:** https://github.com/coollabsio/coolify-docs/tree/v4.x/docs/api-reference
- **Official Docs:** https://coolify.io/docs/api-reference/authorization
