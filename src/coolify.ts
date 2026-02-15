import {
  HealthResponse,
  VersionResponse,
  Team,
  Project,
  Environment,
  Server,
  Application,
  Database,
  DatabaseType,
  Service,
  Deployment,
  EnvironmentVariable,
  BackupConfig,
  BackupExecution,
  SSHKey,
  GitHubApp,
  CloudToken,
  Resource,
  CreateProjectInput,
  CreateEnvironmentInput,
  CreateServerInput,
  CreateDatabaseInput,
  CreateApplicationInput,
  CreateDeploymentInput,
  CreateEnvironmentVariableInput,
  HealthResponseSchema,
  VersionResponseSchema,
  TeamSchema,
  ProjectSchema,
  EnvironmentSchema,
  ServerSchema,
  ApplicationSchema,
  DatabaseSchema,
  ServiceSchema,
  DeploymentSchema,
  EnvironmentVariableSchema,
  BackupConfigSchema,
  BackupExecutionSchema,
  SSHKeySchema,
  GitHubAppSchema,
  CloudTokenSchema,
  ResourceSchema,
  ApiErrorSchema,
} from "./types";
import { z } from "zod";

export class CoolifyError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = "CoolifyError";
  }
}

export class CoolifyClient {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.token = token;
    this.validateConfig();
  }

  private validateConfig(): void {
    if (!this.baseUrl) {
      throw new CoolifyError("COOLIFY_URL is required");
    }
    if (!this.token) {
      throw new CoolifyError("COOLIFY_TOKEN is required");
    }
  }

  private getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    schema?: z.ZodType<T>
  ): Promise<T> {
    const url = `${this.baseUrl}/api/v1${endpoint}`;
    const options: RequestInit = {
      method,
      headers: this.getHeaders(),
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = ApiErrorSchema.parse(errorData);
        throw new CoolifyError(
          error.message || `HTTP ${response.status}`,
          response.status,
          error.code
        );
      }

      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();

      if (schema) {
        return schema.parse(data);
      }

      return data as T;
    } catch (error) {
      if (error instanceof CoolifyError) {
        throw error;
      }
      if (error instanceof z.ZodError) {
        throw new CoolifyError(`Validation error: ${error.message}`);
      }
      throw new CoolifyError(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>(
      "GET",
      "/health",
      undefined,
      HealthResponseSchema
    );
  }

  async version(): Promise<VersionResponse> {
    return this.request<VersionResponse>(
      "GET",
      "/version",
      undefined,
      VersionResponseSchema
    );
  }

  async getTeams(): Promise<Team[]> {
    const response = await this.request<{ data: Team[] }>(
      "GET",
      "/teams",
      undefined,
      z.object({ data: z.array(TeamSchema) })
    );
    return response.data;
  }

  async getCurrentTeam(): Promise<Team> {
    return this.request<Team>("GET", "/teams/current", undefined, TeamSchema);
  }

  async getProjects(): Promise<Project[]> {
    const response = await this.request<{ data: Project[] }>(
      "GET",
      "/projects",
      undefined,
      z.object({ data: z.array(ProjectSchema) })
    );
    return response.data;
  }

  async getProject(uuid: string): Promise<Project> {
    return this.request<Project>(
      "GET",
      `/projects/${uuid}`,
      undefined,
      ProjectSchema
    );
  }

  async createProject(input: CreateProjectInput): Promise<Project> {
    return this.request<Project>(
      "POST",
      "/projects",
      input,
      ProjectSchema
    );
  }

  async updateProject(uuid: string, input: Partial<CreateProjectInput>): Promise<Project> {
    return this.request<Project>(
      "PATCH",
      `/projects/${uuid}`,
      input,
      ProjectSchema
    );
  }

  async deleteProject(uuid: string): Promise<void> {
    await this.request("DELETE", `/projects/${uuid}`);
  }

  async getEnvironments(projectUuid: string): Promise<Environment[]> {
    const response = await this.request<{ data: Environment[] }>(
      "GET",
      `/projects/${projectUuid}/environments`,
      undefined,
      z.object({ data: z.array(EnvironmentSchema) })
    );
    return response.data;
  }

  async createEnvironment(
    projectUuid: string,
    input: CreateEnvironmentInput
  ): Promise<Environment> {
    return this.request<Environment>(
      "POST",
      `/projects/${projectUuid}/environments`,
      input,
      EnvironmentSchema
    );
  }

  async deleteEnvironment(projectUuid: string, name: string): Promise<void> {
    await this.request("DELETE", `/projects/${projectUuid}/environments/${name}`);
  }

  async getServers(): Promise<Server[]> {
    const response = await this.request<{ data: Server[] }>(
      "GET",
      "/servers",
      undefined,
      z.object({ data: z.array(ServerSchema) })
    );
    return response.data;
  }

  async getServer(uuid: string): Promise<Server> {
    return this.request<Server>(
      "GET",
      `/servers/${uuid}`,
      undefined,
      ServerSchema
    );
  }

  async createServer(input: CreateServerInput): Promise<Server> {
    return this.request<Server>("POST", "/servers", input, ServerSchema);
  }

  async updateServer(uuid: string, input: Partial<CreateServerInput>): Promise<Server> {
    return this.request<Server>(
      "PATCH",
      `/servers/${uuid}`,
      input,
      ServerSchema
    );
  }

  async deleteServer(uuid: string): Promise<void> {
    await this.request("DELETE", `/servers/${uuid}`);
  }

  async validateServer(uuid: string): Promise<{ valid: boolean; message: string }> {
    return this.request<{ valid: boolean; message: string }>(
      "GET",
      `/servers/${uuid}/validate`
    );
  }

  async getApplications(): Promise<Application[]> {
    const response = await this.request<{ data: Application[] }>(
      "GET",
      "/applications",
      undefined,
      z.object({ data: z.array(ApplicationSchema) })
    );
    return response.data;
  }

  async getApplication(uuid: string): Promise<Application> {
    return this.request<Application>(
      "GET",
      `/applications/${uuid}`,
      undefined,
      ApplicationSchema
    );
  }

  async createApplication(input: CreateApplicationInput): Promise<Application> {
    return this.request<Application>(
      "POST",
      "/applications",
      input,
      ApplicationSchema
    );
  }

  async createApplicationFromPublicRepo(input: {
    projectUuid: string;
    environmentName: string;
    name: string;
    repository: string;
    branch?: string;
  }): Promise<Application> {
    return this.request<Application>(
      "POST",
      "/applications/public",
      input,
      ApplicationSchema
    );
  }

  async updateApplication(
    uuid: string,
    input: Partial<CreateApplicationInput>
  ): Promise<Application> {
    return this.request<Application>(
      "PATCH",
      `/applications/${uuid}`,
      input,
      ApplicationSchema
    );
  }

  async deleteApplication(uuid: string): Promise<void> {
    await this.request("DELETE", `/applications/${uuid}`);
  }

  async startApplication(uuid: string): Promise<Deployment> {
    return this.request<Deployment>(
      "POST",
      `/applications/${uuid}/start`,
      undefined,
      DeploymentSchema
    );
  }

  async stopApplication(uuid: string): Promise<Deployment> {
    return this.request<Deployment>(
      "POST",
      `/applications/${uuid}/stop`,
      undefined,
      DeploymentSchema
    );
  }

  async restartApplication(uuid: string): Promise<Deployment> {
    return this.request<Deployment>(
      "POST",
      `/applications/${uuid}/restart`,
      undefined,
      DeploymentSchema
    );
  }

  async getApplicationLogs(uuid: string): Promise<string> {
    const response = await this.request<{ data: { logs: string } }>(
      "GET",
      `/applications/${uuid}/logs`
    );
    return response.data.logs;
  }

  async getApplicationEnvVars(uuid: string): Promise<EnvironmentVariable[]> {
    const response = await this.request<{ data: EnvironmentVariable[] }>(
      "GET",
      `/applications/${uuid}/envs`,
      undefined,
      z.object({ data: z.array(EnvironmentVariableSchema) })
    );
    return response.data;
  }

  async createApplicationEnvVar(
    appUuid: string,
    input: CreateEnvironmentVariableInput
  ): Promise<EnvironmentVariable> {
    return this.request<EnvironmentVariable>(
      "POST",
      `/applications/${appUuid}/envs`,
      input,
      EnvironmentVariableSchema
    );
  }

  async updateApplicationEnvVar(
    appUuid: string,
    envUuid: string,
    input: Partial<CreateEnvironmentVariableInput>
  ): Promise<EnvironmentVariable> {
    return this.request<EnvironmentVariable>(
      "PATCH",
      `/applications/${appUuid}/envs/${envUuid}`,
      input,
      EnvironmentVariableSchema
    );
  }

  async deleteApplicationEnvVar(appUuid: string, envUuid: string): Promise<void> {
    await this.request("DELETE", `/applications/${appUuid}/envs/${envUuid}`);
  }

  async getDatabases(): Promise<Database[]> {
    const response = await this.request<{ data: Database[] }>(
      "GET",
      "/databases",
      undefined,
      z.object({ data: z.array(DatabaseSchema) })
    );
    return response.data;
  }

  async getDatabase(uuid: string): Promise<Database> {
    return this.request<Database>(
      "GET",
      `/databases/${uuid}`,
      undefined,
      DatabaseSchema
    );
  }

  async createDatabase(
    type: DatabaseType,
    input: CreateDatabaseInput
  ): Promise<Database> {
    return this.request<Database>(
      "POST",
      `/databases/${type}`,
      input,
      DatabaseSchema
    );
  }

  async updateDatabase(
    uuid: string,
    input: { name?: string; description?: string }
  ): Promise<Database> {
    return this.request<Database>(
      "PATCH",
      `/databases/${uuid}`,
      input,
      DatabaseSchema
    );
  }

  async deleteDatabase(uuid: string): Promise<void> {
    await this.request("DELETE", `/databases/${uuid}`);
  }

  async startDatabase(uuid: string): Promise<Database> {
    return this.request<Database>(
      "POST",
      `/databases/${uuid}/start`,
      undefined,
      DatabaseSchema
    );
  }

  async stopDatabase(uuid: string): Promise<Database> {
    return this.request<Database>(
      "POST",
      `/databases/${uuid}/stop`,
      undefined,
      DatabaseSchema
    );
  }

  async restartDatabase(uuid: string): Promise<Database> {
    return this.request<Database>(
      "POST",
      `/databases/${uuid}/restart`,
      undefined,
      DatabaseSchema
    );
  }

  async getDatabaseBackups(uuid: string): Promise<BackupConfig[]> {
    const response = await this.request<{ data: BackupConfig[] }>(
      "GET",
      `/databases/${uuid}/backups`,
      undefined,
      z.object({ data: z.array(BackupConfigSchema) })
    );
    return response.data;
  }

  async createDatabaseBackup(
    uuid: string,
    input: { enabled: boolean; schedule?: string; retentionDays?: number }
  ): Promise<BackupConfig> {
    return this.request<BackupConfig>(
      "POST",
      `/databases/${uuid}/backups`,
      input,
      BackupConfigSchema
    );
  }

  async getBackupExecutions(
    databaseUuid: string,
    backupUuid: string
  ): Promise<BackupExecution[]> {
    const response = await this.request<{ data: BackupExecution[] }>(
      "GET",
      `/databases/${databaseUuid}/backups/${backupUuid}/executions`,
      undefined,
      z.object({ data: z.array(BackupExecutionSchema) })
    );
    return response.data;
  }

  async getServices(): Promise<Service[]> {
    const response = await this.request<{ data: Service[] }>(
      "GET",
      "/services",
      undefined,
      z.object({ data: z.array(ServiceSchema) })
    );
    return response.data;
  }

  async getService(uuid: string): Promise<Service> {
    return this.request<Service>(
      "GET",
      `/services/${uuid}`,
      undefined,
      ServiceSchema
    );
  }

  async createService(input: {
    projectUuid: string;
    environmentName: string;
    name: string;
    type: string;
  }): Promise<Service> {
    return this.request<Service>("POST", "/services", input, ServiceSchema);
  }

  async updateService(
    uuid: string,
    input: { name?: string; description?: string }
  ): Promise<Service> {
    return this.request<Service>(
      "PATCH",
      `/services/${uuid}`,
      input,
      ServiceSchema
    );
  }

  async deleteService(uuid: string): Promise<void> {
    await this.request("DELETE", `/services/${uuid}`);
  }

  async startService(uuid: string): Promise<Service> {
    return this.request<Service>(
      "POST",
      `/services/${uuid}/start`,
      undefined,
      ServiceSchema
    );
  }

  async stopService(uuid: string): Promise<Service> {
    return this.request<Service>(
      "POST",
      `/services/${uuid}/stop`,
      undefined,
      ServiceSchema
    );
  }

  async restartService(uuid: string): Promise<Service> {
    return this.request<Service>(
      "POST",
      `/services/${uuid}/restart`,
      undefined,
      ServiceSchema
    );
  }

  async getServiceEnvVars(uuid: string): Promise<EnvironmentVariable[]> {
    const response = await this.request<{ data: EnvironmentVariable[] }>(
      "GET",
      `/services/${uuid}/envs`,
      undefined,
      z.object({ data: z.array(EnvironmentVariableSchema) })
    );
    return response.data;
  }

  async createServiceEnvVar(
    serviceUuid: string,
    input: CreateEnvironmentVariableInput
  ): Promise<EnvironmentVariable> {
    return this.request<EnvironmentVariable>(
      "POST",
      `/services/${serviceUuid}/envs`,
      input,
      EnvironmentVariableSchema
    );
  }

  async getDeployments(): Promise<Deployment[]> {
    const response = await this.request<{ data: Deployment[] }>(
      "GET",
      "/deployments",
      undefined,
      z.object({ data: z.array(DeploymentSchema) })
    );
    return response.data;
  }

  async getDeployment(uuid: string): Promise<Deployment> {
    return this.request<Deployment>(
      "GET",
      `/deployments/${uuid}`,
      undefined,
      DeploymentSchema
    );
  }

  async getApplicationDeployments(applicationUuid: string): Promise<Deployment[]> {
    const response = await this.request<{ data: Deployment[] }>(
      "GET",
      `/deployments/applications/${applicationUuid}`,
      undefined,
      z.object({ data: z.array(DeploymentSchema) })
    );
    return response.data;
  }

  async cancelDeployment(uuid: string): Promise<Deployment> {
    return this.request<Deployment>(
      "POST",
      `/deployments/${uuid}/cancel`,
      undefined,
      DeploymentSchema
    );
  }

  async deploy(input: CreateDeploymentInput): Promise<Deployment> {
    return this.request<Deployment>("POST", "/deploy", input, DeploymentSchema);
  }

  async getResources(): Promise<Resource[]> {
    const response = await this.request<{ data: Resource[] }>(
      "GET",
      "/resources",
      undefined,
      z.object({ data: z.array(ResourceSchema) })
    );
    return response.data;
  }

  async getSSHKeys(): Promise<SSHKey[]> {
    const response = await this.request<{ data: SSHKey[] }>(
      "GET",
      "/security/keys",
      undefined,
      z.object({ data: z.array(SSHKeySchema) })
    );
    return response.data;
  }

  async createSSHKey(input: {
    name: string;
    privateKey: string;
    publicKey: string;
  }): Promise<SSHKey> {
    return this.request<SSHKey>(
      "POST",
      "/security/keys",
      input,
      SSHKeySchema
    );
  }

  async deleteSSHKey(uuid: string): Promise<void> {
    await this.request("DELETE", `/security/keys/${uuid}`);
  }

  async getGitHubApps(): Promise<GitHubApp[]> {
    const response = await this.request<{ data: GitHubApp[] }>(
      "GET",
      "/github-apps",
      undefined,
      z.object({ data: z.array(GitHubAppSchema) })
    );
    return response.data;
  }

  async getCloudTokens(): Promise<CloudToken[]> {
    const response = await this.request<{ data: CloudToken[] }>(
      "GET",
      "/cloud-tokens",
      undefined,
      z.object({ data: z.array(CloudTokenSchema) })
    );
    return response.data;
  }
}

export function createClient(baseUrl?: string, token?: string): CoolifyClient {
  const url = baseUrl || process.env.COOLIFY_URL;
  const apiToken = token || process.env.COOLIFY_TOKEN;

  if (!url || !apiToken) {
    throw new CoolifyError(
      "COOLIFY_URL and COOLIFY_TOKEN must be set either via parameters or environment variables"
    );
  }

  return new CoolifyClient(url, apiToken);
}
