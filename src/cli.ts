#!/usr/bin/env ts-node
import { createClient, CoolifyClient, CoolifyError } from "./coolify";
import {
  CreateProjectSchema,
  CreateEnvironmentSchema,
  CreateDatabaseSchema,
  CreateApplicationSchema,
  DatabaseTypeSchema,
  CreateDeploymentSchema,
} from "./types";
import { z } from "zod";

interface ParsedArgs {
  command: string;
  args: string[];
  flags: Record<string, boolean | string>;
}

function parseArgs(args: string[]): ParsedArgs {
  const command = args[0] || "help";
  const remaining = args.slice(1);
  const flags: Record<string, boolean | string> = {};
  const positional: string[] = [];

  for (const arg of remaining) {
    if (arg.startsWith("--")) {
      const [key, value] = arg.slice(2).split("=");
      if (value !== undefined) {
        flags[key] = value;
      } else {
        flags[key] = true;
      }
    } else if (arg.startsWith("-")) {
      for (const char of arg.slice(1)) {
        flags[char] = true;
      }
    } else {
      positional.push(arg);
    }
  }

  return { command, args: positional, flags };
}

function formatJson(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

function formatTable(data: Record<string, unknown>[]): void {
  if (data.length === 0) {
    console.log("No data found");
    return;
  }

  const headers = Object.keys(data[0]);
  const colWidths = headers.map((h) => h.length);

  for (const row of data) {
    for (let i = 0; i < headers.length; i++) {
      const value = String((row as Record<string, unknown>)[headers[i]] ?? "");
      colWidths[i] = Math.max(colWidths[i], value.length);
    }
  }

  const headerRow = headers
    .map((h, i) => h.padEnd(colWidths[i]))
    .join(" | ");
  const separator = colWidths.map((w) => "-".repeat(w)).join("-+-");

  console.log(headerRow);
  console.log(separator);

  for (const row of data) {
    const rowStr = headers
      .map((h, i) => String((row as Record<string, unknown>)[h] ?? "").padEnd(colWidths[i]))
      .join(" | ");
    console.log(rowStr);
  }
}

async function runCommand(client: CoolifyClient, cmd: string, args: string[]): Promise<void> {
  try {
    switch (cmd) {
      case "health": {
        const health = await client.health();
        formatJson(health);
        break;
      }

      case "version": {
        const version = await client.version();
        formatJson(version);
        break;
      }

      case "teams": {
        const teams = await client.getTeams();
        formatJson(teams);
        break;
      }

      case "team": {
        const team = await client.getCurrentTeam();
        formatJson(team);
        break;
      }

      case "projects":
      case "project-list": {
        const projects = await client.getProjects();
        formatTable(projects);
        break;
      }

      case "project": {
        const [uuid] = args;
        if (!uuid) {
          console.error("Error: project uuid required");
          console.error("Usage: coolify project <uuid>");
          process.exit(1);
        }
        const project = await client.getProject(uuid);
        formatJson(project);
        break;
      }

      case "project-create": {
        const [name, description] = args;
        if (!name) {
          console.error("Error: project name required");
          console.error("Usage: coolify project-create <name> [description]");
          process.exit(1);
        }
        const input = CreateProjectSchema.parse({ name, description });
        const project = await client.createProject(input);
        formatJson(project);
        break;
      }

      case "project-delete": {
        const [uuid] = args;
        if (!uuid) {
          console.error("Error: project uuid required");
          console.error("Usage: coolify project-delete <uuid>");
          process.exit(1);
        }
        await client.deleteProject(uuid);
        console.log(`Project ${uuid} deleted`);
        break;
      }

      case "environments":
      case "env-list": {
        const [projectUuid] = args;
        if (!projectUuid) {
          console.error("Error: project uuid required");
          console.error("Usage: coolify environments <project-uuid>");
          process.exit(1);
        }
        const envs = await client.getEnvironments(projectUuid);
        formatJson(envs);
        break;
      }

      case "environment-create": {
        const [projectUuid, name, isProduction] = args;
        if (!projectUuid || !name) {
          console.error("Error: project uuid and name required");
          console.error("Usage: coolify environment-create <project-uuid> <name> [--production]");
          process.exit(1);
        }
        const input = CreateEnvironmentSchema.parse({
          name,
          isProduction: isProduction === "--production" || isProduction === "true",
        });
        const env = await client.createEnvironment(projectUuid, input);
        formatJson(env);
        break;
      }

      case "servers":
      case "server-list": {
        const servers = await client.getServers();
        formatTable(servers);
        break;
      }

      case "server": {
        const [uuid] = args;
        if (!uuid) {
          console.error("Error: server uuid required");
          console.error("Usage: coolify server <uuid>");
          process.exit(1);
        }
        const server = await client.getServer(uuid);
        formatJson(server);
        break;
      }

      case "server-validate": {
        const [uuid] = args;
        if (!uuid) {
          console.error("Error: server uuid required");
          console.error("Usage: coolify server-validate <uuid>");
          process.exit(1);
        }
        const result = await client.validateServer(uuid);
        formatJson(result);
        break;
      }

      case "apps":
      case "applications":
      case "app-list": {
        const apps = await client.getApplications();
        formatTable(apps);
        break;
      }

      case "app":
      case "application": {
        const [uuid] = args;
        if (!uuid) {
          console.error("Error: application uuid required");
          console.error("Usage: coolify app <uuid>");
          process.exit(1);
        }
        const app = await client.getApplication(uuid);
        formatJson(app);
        break;
      }

      case "app-create": {
        const [projectUuid, environmentName, name, buildPack] = args;
        if (!projectUuid || !environmentName || !name) {
          console.error("Error: project-uuid, environment-name, and name required");
          console.error("Usage: coolify app-create <project-uuid> <environment-name> <name> [build-pack]");
          process.exit(1);
        }
        const input = CreateApplicationSchema.parse({
          projectUuid,
          environmentName,
          name,
          buildPack: buildPack as "nixpacks" | "dockerfile" | "dockerimage" | "static",
        });
        const app = await client.createApplication(input);
        formatJson(app);
        break;
      }

      case "app-delete": {
        const [uuid] = args;
        if (!uuid) {
          console.error("Error: application uuid required");
          console.error("Usage: coolify app-delete <uuid>");
          process.exit(1);
        }
        await client.deleteApplication(uuid);
        console.log(`Application ${uuid} deleted`);
        break;
      }

      case "start": {
        const [uuid] = args;
        if (!uuid) {
          console.error("Error: application uuid required");
          console.error("Usage: coolify start <uuid>");
          process.exit(1);
        }
        const result = await client.startApplication(uuid);
        formatJson(result);
        break;
      }

      case "stop": {
        const [uuid] = args;
        if (!uuid) {
          console.error("Error: application uuid required");
          console.error("Usage: coolify stop <uuid>");
          process.exit(1);
        }
        const result = await client.stopApplication(uuid);
        formatJson(result);
        break;
      }

      case "restart": {
        const [uuid] = args;
        if (!uuid) {
          console.error("Error: application uuid required");
          console.error("Usage: coolify restart <uuid>");
          process.exit(1);
        }
        const result = await client.restartApplication(uuid);
        formatJson(result);
        break;
      }

      case "deploy": {
        const [uuid] = args;
        if (!uuid) {
          console.error("Error: resource uuid required");
          console.error("Usage: coolify deploy <uuid> [type]");
          process.exit(1);
        }
        const type = (args[1] || "application") as "application" | "database" | "service";
        const input = CreateDeploymentSchema.parse({
          resourceUuid: uuid,
          resourceType: type,
        });
        const result = await client.deploy(input);
        formatJson(result);
        break;
      }

      case "logs": {
        const [uuid] = args;
        if (!uuid) {
          console.error("Error: application uuid required");
          console.error("Usage: coolify logs <uuid>");
          process.exit(1);
        }
        const logs = await client.getApplicationLogs(uuid);
        console.log(logs || "No logs available");
        break;
      }

      case "app-envs":
      case "app-env-list": {
        const [appUuid] = args;
        if (!appUuid) {
          console.error("Error: application uuid required");
          console.error("Usage: coolify app-envs <app-uuid>");
          process.exit(1);
        }
        const envs = await client.getApplicationEnvVars(appUuid);
        formatTable(envs);
        break;
      }

      case "databases":
      case "database-list": {
        const databases = await client.getDatabases();
        formatTable(databases);
        break;
      }

      case "database": {
        const [uuid] = args;
        if (!uuid) {
          console.error("Error: database uuid required");
          console.error("Usage: coolify database <uuid>");
          process.exit(1);
        }
        const db = await client.getDatabase(uuid);
        formatJson(db);
        break;
      }

      case "db-create": {
        const [type, serverUuid, projectUuid, environmentName, name] = args;
        if (!type || !serverUuid || !projectUuid || !environmentName || !name) {
          console.error("Error: type, server-uuid, project-uuid, environment-name, and name required");
          console.error("Usage: coolify db-create <type> <server-uuid> <project-uuid> <environment-name> <name>");
          console.error("Types: postgresql, mysql, mariadb, mongodb, redis, clickhouse, dragonfly, keydb");
          process.exit(1);
        }
        const validatedType = DatabaseTypeSchema.parse(type);
        const input = CreateDatabaseSchema.parse({
          serverUuid,
          projectUuid,
          environmentName,
          name,
        });
        const db = await client.createDatabase(validatedType, input);
        formatJson(db);
        break;
      }

      case "db-delete": {
        const [uuid] = args;
        if (!uuid) {
          console.error("Error: database uuid required");
          console.error("Usage: coolify db-delete <uuid>");
          process.exit(1);
        }
        await client.deleteDatabase(uuid);
        console.log(`Database ${uuid} deleted`);
        break;
      }

      case "db-start": {
        const [uuid] = args;
        if (!uuid) {
          console.error("Error: database uuid required");
          console.error("Usage: coolify db-start <uuid>");
          process.exit(1);
        }
        const result = await client.startDatabase(uuid);
        formatJson(result);
        break;
      }

      case "db-stop": {
        const [uuid] = args;
        if (!uuid) {
          console.error("Error: database uuid required");
          console.error("Usage: coolify db-stop <uuid>");
          process.exit(1);
        }
        const result = await client.stopDatabase(uuid);
        formatJson(result);
        break;
      }

      case "services":
      case "service-list": {
        const services = await client.getServices();
        formatTable(services);
        break;
      }

      case "service": {
        const [uuid] = args;
        if (!uuid) {
          console.error("Error: service uuid required");
          console.error("Usage: coolify service <uuid>");
          process.exit(1);
        }
        const svc = await client.getService(uuid);
        formatJson(svc);
        break;
      }

      case "service-delete": {
        const [uuid] = args;
        if (!uuid) {
          console.error("Error: service uuid required");
          console.error("Usage: coolify service-delete <uuid>");
          process.exit(1);
        }
        await client.deleteService(uuid);
        console.log(`Service ${uuid} deleted`);
        break;
      }

      case "deployments":
      case "deployment-list": {
        const deployments = await client.getDeployments();
        formatTable(deployments);
        break;
      }

      case "deployment": {
        const [uuid] = args;
        if (!uuid) {
          console.error("Error: deployment uuid required");
          console.error("Usage: coolify deployment <uuid>");
          process.exit(1);
        }
        const deployment = await client.getDeployment(uuid);
        formatJson(deployment);
        break;
      }

      case "deployment-cancel": {
        const [uuid] = args;
        if (!uuid) {
          console.error("Error: deployment uuid required");
          console.error("Usage: coolify deployment-cancel <uuid>");
          process.exit(1);
        }
        const deployment = await client.cancelDeployment(uuid);
        formatJson(deployment);
        break;
      }

      case "resources": {
        const resources = await client.getResources();
        formatTable(resources);
        break;
      }

      case "ssh-keys": {
        const keys = await client.getSSHKeys();
        formatJson(keys);
        break;
      }

      case "github-apps": {
        const apps = await client.getGitHubApps();
        formatJson(apps);
        break;
      }

      case "cloud-tokens": {
        const tokens = await client.getCloudTokens();
        formatJson(tokens);
        break;
      }

      case "help":
      case "--help":
      case "-h": {
        printHelp();
        break;
      }

      default: {
        console.error(`Unknown command: ${cmd}`);
        printHelp();
        process.exit(1);
      }
    }
  } catch (error) {
    if (error instanceof CoolifyError) {
      console.error(`Error: ${error.message}`);
      if (error.statusCode) {
        console.error(`Status: ${error.statusCode}`);
      }
      process.exit(3);  // API error
    }
    if (error instanceof z.ZodError) {
      console.error("Validation error:");
      for (const issue of error.issues) {
        console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
      }
      process.exit(2);  // Validation error
    }
    throw error;
  }
}

function printHelp(): void {
  console.log(`
Coolify CLI - Manage Coolify PaaS instances

Usage: coolify <command> [arguments] [options]

Commands:
  System
    health              Check API health
    version             Get Coolify version

  Projects
    projects            List all projects
    project <uuid>      Get project details
    project-create <name> [description]  Create a project
    project-delete <uuid>               Delete a project
    environments <project-uuid>         List project environments
    environment-create <project-uuid> <name> [--production]  Create environment

  Servers
    servers             List all servers
    server <uuid>       Get server details
    server-validate <uuid>             Validate server connection

  Applications
    apps                List all applications
    app <uuid>          Get application details
    app-create <project-uuid> <env-name> <name> [build-pack]  Create application
    app-delete <uuid>   Delete application
    start <uuid>        Start application
    stop <uuid>         Stop application
    restart <uuid>      Restart application
    deploy <uuid> [type]               Deploy application (type: application|database|service)
    logs <uuid>        Get application logs
    app-envs <uuid>    List application environment variables

  Databases
    databases           List all databases
    database <uuid>    Get database details
    db-create <type> <server-uuid> <project-uuid> <env-name> <name>  Create database
    db-delete <uuid>   Delete database
    db-start <uuid>    Start database
    db-stop <uuid>     Stop database

  Services
    services            List all services
    service <uuid>     Get service details
    service-delete <uuid>              Delete service

  Deployments
    deployments         List all deployments
    deployment <uuid>  Get deployment details
    deployment-cancel <uuid>          Cancel deployment

  Resources
    resources           List all resources

  Other
    teams               List teams
    ssh-keys            List SSH keys
    github-apps         List GitHub apps
    cloud-tokens        List cloud tokens

Options:
  --help, -h            Show this help message

Examples:
  coolify health
  coolify projects
  coolify apps
  coolify deploy abc123 application
  coolify logs abc123
  coolify db-create postgresql server-uuid project-uuid production mydb
`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const { command, args: positional } = parseArgs(args);

  try {
    const client = createClient();
    await runCommand(client, command, positional);
  } catch (error) {
    if (error instanceof CoolifyError) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
    throw error;
  }
}

main();
