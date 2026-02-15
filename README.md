# Coolify Skill for OpenClaw

A skill for managing Coolify PaaS instances via API.

## Features

- 🖥️ Server management (list, create, validate, delete)
- 🚀 Application deployment (start, stop, restart, logs)
- 🗄️ Database management (PostgreSQL, MySQL, MongoDB, Redis, etc.)
- 📦 Service management
- 📁 Project & environment management
- 🔗 Webhook deployments

## Installation

Copy the skill folder to your OpenClaw skills directory or install from ClawHub.

## Configuration

Create a `.env` file with your Coolify credentials:

```
COOLIFY_URL=http://your-server:8000
COOLIFY_TOKEN=your-api-token
```

Generate a token in Coolify UI: **Keys & Tokens → API tokens → Create New Token**

## Usage

### CLI Helper

```bash
./scripts/coolify.sh servers     # List all servers
./scripts/coolify.sh apps        # List all applications
./scripts/coolify.sh deploy uuid # Deploy an application
./scripts/coolify.sh logs uuid   # Get application logs
```

### API Reference

See [references/endpoints.md](references/endpoints.md) for complete API documentation.

## References

- **Coolify Repository:** https://github.com/coollabsio/coolify
- **API Documentation:** https://github.com/coollabsio/coolify-docs/tree/v4.x/docs/api-reference
- **Official Docs:** https://coolify.io/docs/api-reference/authorization

## License

MIT
