import { z } from "zod";

export const HealthResponseSchema = z.object({
  status: z.string(),
  version: z.string().optional(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const VersionResponseSchema = z.object({
  version: z.string(),
});

export type VersionResponse = z.infer<typeof VersionResponseSchema>;

export const TeamMemberSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().optional(),
  role: z.string(),
});

export type TeamMember = z.infer<typeof TeamMemberSchema>;

export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  members: z.array(TeamMemberSchema).optional(),
});

export type Team = z.infer<typeof TeamSchema>;

export const ProjectSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  teamId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const EnvironmentSchema = z.object({
  name: z.string(),
  projectUuid: z.string(),
  isProduction: z.boolean().optional(),
  createdAt: z.string(),
});

export type Environment = z.infer<typeof EnvironmentSchema>;

export const ServerSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  ip: z.string(),
  port: z.number().optional(),
  status: z.string(),
  isCloud: z.boolean().optional(),
  isLocal: z.boolean().optional(),
  teamId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Server = z.infer<typeof ServerSchema>;

export const ApplicationSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  repository: z.string().nullable().optional(),
  branch: z.string().nullable().optional(),
  projectUuid: z.string(),
  environmentName: z.string(),
  status: z.string(),
  buildPack: z.string().nullable().optional(),
  dockerfile: z.string().nullable().optional(),
  dockerImage: z.string().nullable().optional(),
  teamId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Application = z.infer<typeof ApplicationSchema>;

export const DatabaseTypeSchema = z.enum([
  "postgresql",
  "mysql",
  "mariadb",
  "mongodb",
  "redis",
  "clickhouse",
  "dragonfly",
  "keydb",
]);

export type DatabaseType = z.infer<typeof DatabaseTypeSchema>;

export const DatabaseSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  type: DatabaseTypeSchema,
  version: z.string().nullable().optional(),
  projectUuid: z.string(),
  environmentName: z.string(),
  status: z.string(),
  teamId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Database = z.infer<typeof DatabaseSchema>;

export const ServiceSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  type: z.string(),
  version: z.string().nullable().optional(),
  projectUuid: z.string(),
  environmentName: z.string(),
  status: z.string(),
  teamId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Service = z.infer<typeof ServiceSchema>;

export const DeploymentStatusSchema = z.enum([
  "waiting",
  "running",
  "failed",
  "done",
  "cancelled",
]);

export type DeploymentStatus = z.infer<typeof DeploymentStatusSchema>;

export const DeploymentSchema = z.object({
  uuid: z.string(),
  applicationUuid: z.string().nullable().optional(),
  databaseUuid: z.string().nullable().optional(),
  serviceUuid: z.string().nullable().optional(),
  status: DeploymentStatusSchema,
  commit: z.string().nullable().optional(),
  branch: z.string().nullable().optional(),
  buildId: z.number().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  finishedAt: z.string().nullable().optional(),
});

export type Deployment = z.infer<typeof DeploymentSchema>;

export const EnvironmentVariableSchema = z.object({
  uuid: z.string(),
  key: z.string(),
  value: z.string().nullable().optional(),
  isBuildSecret: z.boolean().optional(),
  isPreview: z.boolean().optional(),
  isSecret: z.boolean().optional(),
  resourceUuid: z.string(),
});

export type EnvironmentVariable = z.infer<typeof EnvironmentVariableSchema>;

export const BackupConfigSchema = z.object({
  uuid: z.string(),
  enabled: z.boolean(),
  schedule: z.string().nullable().optional(),
  retentionDays: z.number().nullable().optional(),
  databaseUuid: z.string(),
  databaseName: z.string(),
});

export type BackupConfig = z.infer<typeof BackupConfigSchema>;

export const BackupExecutionSchema = z.object({
  uuid: z.string(),
  backupId: z.string(),
  status: z.string(),
  size: z.number().nullable().optional(),
  createdAt: z.string(),
  finishedAt: z.string().nullable().optional(),
});

export type BackupExecution = z.infer<typeof BackupExecutionSchema>;

export const SSHKeySchema = z.object({
  uuid: z.string(),
  name: z.string(),
  publicKey: z.string(),
  privateKey: z.string().nullable().optional(),
  teamId: z.string(),
  createdAt: z.string(),
});

export type SSHKey = z.infer<typeof SSHKeySchema>;

export const GitHubAppSchema = z.object({
  id: z.number(),
  name: z.string(),
  appId: z.string(),
  installationId: z.string(),
  teamId: z.string(),
  createdAt: z.string(),
});

export type GitHubApp = z.infer<typeof GitHubAppSchema>;

export const CloudTokenSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  provider: z.string(),
  isValid: z.boolean(),
  teamId: z.string(),
  createdAt: z.string(),
});

export type CloudToken = z.infer<typeof CloudTokenSchema>;

export const ResourceSchema = z.object({
  uuid: z.string(),
  type: z.string(),
  name: z.string(),
  status: z.string(),
  projectUuid: z.string().nullable().optional(),
  environmentName: z.string().nullable().optional(),
});

export type Resource = z.infer<typeof ResourceSchema>;

export const ApiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    message: z.string().optional(),
  });

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
  });

export const CreateProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

export const CreateEnvironmentSchema = z.object({
  name: z.string().min(1),
  isProduction: z.boolean().optional(),
});

export type CreateEnvironmentInput = z.infer<typeof CreateEnvironmentSchema>;

export const CreateServerSchema = z.object({
  name: z.string().min(1),
  ip: z.string().ip(),
  port: z.number().min(1).max(65535).optional(),
});

export type CreateServerInput = z.infer<typeof CreateServerSchema>;

export const CreateDatabaseSchema = z.object({
  serverUuid: z.string(),
  projectUuid: z.string(),
  environmentName: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
});

export type CreateDatabaseInput = z.infer<typeof CreateDatabaseSchema>;

export const CreateApplicationSchema = z.object({
  projectUuid: z.string(),
  environmentName: z.string(),
  name: z.string().min(1),
  buildPack: z.enum([
    "nixpacks",
    "dockerfile",
    "dockerimage",
    "static",
  ]).optional(),
  repository: z.string().optional(),
  branch: z.string().optional(),
});

export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>;

export const CreateDeploymentSchema = z.object({
  resourceUuid: z.string(),
  resourceType: z.enum(["application", "database", "service"]),
  forceRebuild: z.boolean().optional(),
});

export type CreateDeploymentInput = z.infer<typeof CreateDeploymentSchema>;

export const CreateEnvironmentVariableSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  isSecret: z.boolean().optional(),
  isBuildSecret: z.boolean().optional(),
  isPreview: z.boolean().optional(),
});

export type CreateEnvironmentVariableInput = z.infer<typeof CreateEnvironmentVariableSchema>;
