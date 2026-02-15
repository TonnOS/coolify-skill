# Coolify Skill for OpenClaw

A TypeScript-based skill for managing Coolify PaaS instances via API.

## Features

- TypeScript API client with full type safety
- Input validation using Zod schemas
- Comprehensive CLI tool with formatted output
- Server management (list, create, validate, delete)
- Application deployment (start, stop, restart, logs)
- Database management (PostgreSQL, MySQL, MongoDB, Redis, etc.)
- Service management
- Project & environment management
- Webhook deployments
- Deployment tracking and cancellation

## Installation

```bash
npm install
npm run build
```

## Configuration

Create a `.env` file with your Coolify credentials:

```
COOLIFY_URL=http://your-server:8000
COOLIFY_TOKEN=your-api-token
```

Generate a token in Coolify UI: **Keys & Tokens → API tokens → Create New Token**

## Usage

### CLI Tool

```bash
# Build first
npm run build

# Run CLI commands
./dist/cli.js health
./dist/cli.js version
./dist/cli.js projects
./dist/cli.js apps
./dist/cli.js servers

# Deploy application
./dist/cli.js deploy <app-uuid>

# Get logs
./dist/cli.js logs <app-uuid>

# Create database
./dist/cli.js db-create postgresql <server-uuid> <project-uuid> <env-name> <name>

# View all commands
./dist/cli.js help
```

### TypeScript API

```typescript
import { createClient, CoolifyClient } from "./coolify";
import { Application, Deployment } from "./types";

const client = createClient();

// List all applications
const apps: Application[] = await client.getApplications();

// Get single application
const app: Application = await client.getApplication("uuid-here");

// Deploy application
const deployment: Deployment = await client.deploy({
  resourceUuid: "uuid-here",
  resourceType: "application",
});

// Start/Stop/Restart
await client.startApplication("uuid-here");
await client.stopApplication("uuid-here");
await client.restartApplication("uuid-here");

// Get logs
const logs: string = await client.getApplicationLogs("uuid-here");

// Create a database
const db = await client.createDatabase("postgresql", {
  serverUuid: "server-uuid",
  projectUuid: "project-uuid",
  environmentName: "production",
  name: "mydb",
});
```

### Using with Custom URL/Token

```typescript
import { CoolifyClient } from "./coolify";

const client = new CoolifyClient(
  "http://your-server:8000",
  "your-api-token"
);
```

## Project Structure

```
coolify-skill/
├── src/
│   ├── cli.ts       # CLI tool implementation
│   ├── coolify.ts  # API client class
│   └── types.ts    # TypeScript interfaces & Zod schemas
├── package.json
├── tsconfig.json
└── README.md
```

## API Reference

See [references/endpoints.md](references/endpoints.md) for complete API documentation.

## References

- **Coolify Repository:** https://github.com/coollabsio/coolify
- **API Documentation:** https://github.com/coollabsio/coolify-docs/tree/v4.x/docs/api-reference
- **Official Docs:** https://coolify.io/docs/api-reference/authorization

## License

MIT
