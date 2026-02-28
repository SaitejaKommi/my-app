import { z } from "zod";

// --- PART 1: General Requirements Intake ---

// Section 1 - Project Identity
export const ProjectType = z.enum([
  "saas_b2b", "saas_b2c", "saas_b2b2c", "internal_tool", "marketplace",
  "api_product", "developer_tool", "e_commerce", "content_platform",
  "data_platform", "iot_platform", "ai_product", "other"
]);

export const ProjectStage = z.enum([
  "greenfield", "mvp_in_progress", "launched", "scaling", "migrating", "rebuilding"
]);

export const Industry = z.enum([
  "fintech", "healthtech", "edtech", "legaltech", "hrtech", "martech",
  "devtools", "ecommerce", "logistics", "proptech", "govtech", "media",
  "social", "enterprise_saas", "consumer", "other"
]);

export const TargetGeography = z.enum([
  "us_only", "eu_only", "us_and_eu", "global", "apac", "latam", "mena", "specific"
]);

export const Section1Schema = z.object({
  projectName: z.string().min(2).max(100),
  projectType: ProjectType,
  projectTypeDescription: z.string().max(500).optional(),
  problemStatement: z.string().min(20).max(300),
  solutionSummary: z.string().min(30).max(500),
  projectStage: ProjectStage,
  existingStack: z.array(z.string()).optional(),
  industry: Industry,
  targetGeographies: z.array(TargetGeography).min(1),
  targetGeographiesDetail: z.string().max(500).optional(),
  targetLaunchDate: z.string(), // ISO 8601
});

// Section 2 - User Personas & Scale
export const PrimaryUserType = z.enum([
  "end_consumers", "business_employees", "business_admins", "developers", "mixed"
]);

export const MagnitudeScale = z.enum([
  "under_100", "100_to_1k", "1k_to_10k", "10k_to_100k", "100k_to_1m", "over_1m"
]);

export const ConcurrentUsersScale = z.enum([
  "under_50", "50_to_500", "500_to_5k", "5k_to_50k", "over_50k"
]);

export const SessionDuration = z.enum([
  "under_5min", "5_to_30min", "30min_to_2hr", "over_2hr"
]);

export const GeographicDistribution = z.enum([
  "single_region", "multi_region", "global"
]);

export const TechnicalLevel = z.enum([
  "non_technical", "semi_technical", "technical", "highly_technical"
]);

export const TeamSize = z.enum([
  "under_10", "10_to_50", "50_to_500", "500_to_5k", "over_5k"
]);

export const Section2Schema = z.object({
  primaryUserType: PrimaryUserType,
  numberOfRoles: z.number().min(1).max(50),
  usersAtLaunch: MagnitudeScale,
  usersAt12Months: MagnitudeScale,
  peakConcurrentUsers: ConcurrentUsersScale,
  avgSessionDuration: SessionDuration,
  userGeographicDistribution: GeographicDistribution,
  userTechnicalLevel: TechnicalLevel,
  hasTeamAccounts: z.boolean().default(false),
  maxTeamSize: TeamSize.optional(),
  hasGuestAccess: z.boolean().default(false),
});

// Section 3 - Multi-Tenancy Model
export const TenantIsolationModel = z.enum([
  "shared_schema", "schema_per_tenant", "database_per_tenant", "hybrid"
]);

export const TenantIdentificationMethod = z.enum([
  "subdomain", "custom_domain", "path_prefix", "header_based", "query_param", "jwt_claim"
]);

export const TenantOnboardingModel = z.enum([
  "self_service", "sales_assisted", "invite_only", "api_provisioned"
]);

export const TenantCustomization = z.enum([
  "branding", "custom_domain", "feature_flags", "custom_roles", "custom_fields",
  "webhooks", "sso_config", "billing_limits", "none"
]);

export const CrossTenantSharing = z.enum([
  "none", "read_only", "configurable", "marketplace"
]);

export const TenantTierModel = z.enum([
  "flat_pricing", "tiered_pricing", "usage_based", "hybrid", "custom"
]);

export const TenantScale = z.enum([
  "under_10", "10_to_100", "100_to_1k", "1k_to_10k", "over_10k"
]);

export const TenantDataDeletion = z.enum([
  "soft_delete", "hard_delete", "grace_period", "export_then_delete", "archive"
]);

export const TenantAdminCapability = z.enum([
  "user_management", "role_assignment", "role_creation", "billing_management",
  "api_key_management", "audit_log_access", "data_export", "sso_configuration",
  "webhook_management", "feature_control", "subdomain_management"
]);

export const TenantDataResidency = z.enum([
  "no_requirement", "tenant_chooses", "eu_only", "us_only", "regional_routing"
]);

export const Section3Schema = z.object({
  isMultiTenant: z.boolean().default(false),
  tenantIsolationModel: TenantIsolationModel.optional(),
  tenantIdentificationMethod: TenantIdentificationMethod.optional(),
  tenantOnboardingModel: TenantOnboardingModel.optional(),
  tenantCustomization: z.array(TenantCustomization).optional(),
  crossTenantSharing: CrossTenantSharing.optional(),
  tenantTierModel: TenantTierModel.optional(),
  tenantsAtLaunch: TenantScale.optional(),
  tenantsAt12Months: TenantScale.optional(),
  tenantDataDeletion: TenantDataDeletion.optional(),
  tenantAdminCapabilities: z.array(TenantAdminCapability).optional(),
  tenantDataResidency: TenantDataResidency.optional(),
});

// Section 4 - Access Control Model
export const AccessControlModel = z.enum([
  "none", "rbac", "abac", "pbac", "rbac_with_abac", "ownership_based", "acl"
]);

export const RoleScope = z.enum(["platform", "tenant", "resource"]);

export const RoleDefinitionSchema = z.object({
  name: z.string(),
  description: z.string(),
  scope: RoleScope,
  isDefault: z.boolean(),
  isSuperAdmin: z.boolean(),
});

export const RoleHierarchy = z.enum([
  "flat", "strict_hierarchy", "partial_hierarchy", "group_based"
]);

export const PermissionGranularity = z.enum([
  "resource_level", "action_level", "field_level"
]);

export const ResourcePermissionSchema = z.object({
  resourceName: z.string(),
  actions: z.array(z.string()),
  ownershipRule: z.string().optional().nullable(),
});

export const Section4Schema = z.object({
  accessControlModel: AccessControlModel,
  
  // 4A RBAC fields
  roles: z.array(RoleDefinitionSchema).optional(),
  roleHierarchy: RoleHierarchy.optional(),
  permissionGranularity: PermissionGranularity.optional(),
  resourcePermissions: z.array(ResourcePermissionSchema).optional(),
  rolePermissionMatrix: z.any().optional(), // Generic matrix handle later
  dynamicRoles: z.boolean().optional(),
  superAdminBypassesChecks: z.boolean().optional(),
  rolesAreTenantScoped: z.boolean().optional(),
  multipleRolesPerUser: z.boolean().optional(),
  roleAssignmentRequiresApproval: z.boolean().optional(),
  ownershipOverride: z.boolean().optional(),
  
  // 4B ABAC fields
  abacAttributes: z.array(z.any()).optional(),
  abacPolicies: z.array(z.any()).optional(),
  abacConflictResolution: z.enum(["deny_overrides", "allow_overrides", "priority_based", "first_applicable"]).optional(),
  abacPolicyManagement: z.enum(["static_developer", "static_config", "admin_managed", "tenant_managed", "customer_managed"]).optional(),
  
  // 4C PBAC fields
  policyEngine: z.enum(["custom_dsl", "opa_rego", "cedar", "casbin", "spice_db", "cerbos"]).optional(),
  policiesAuditable: z.boolean().optional(),
  policiesUseExternalData: z.boolean().optional(),
});

// Section 5 - Data Requirements
export const Frequency = z.enum(["rare", "occasional", "frequent", "very_frequent", "stream", "burst"]);

export const CoreEntitySchema = z.object({
  name: z.string(),
  description: z.string(),
  estimatedRows: MagnitudeScale,
  writeFrequency: Frequency,
  readFrequency: Frequency,
  relationships: z.array(z.string()),
  requiresAudit: z.boolean(),
  requiresSoftDelete: z.boolean(),
});

export const WorkloadProfile = z.enum([
  "read_heavy", "write_heavy", "balanced", "bursty_reads", "bursty_writes", "streaming"
]);

export const SearchRequirements = z.enum([
  "none", "basic_filter", "full_text_search", "fuzzy_search", "faceted_search", "semantic_search", "hybrid"
]);

export const DbIsolationPerTenant = z.enum([
  "row_level_security", "application_level", "schema_level", "database_level"
]);

export const DataVolumeScale = z.enum([
  "under_1gb", "1gb_to_10gb", "10gb_to_100gb", "100gb_to_1tb", "1tb_to_10tb", "over_10tb"
]);

export const BackupStrategy = z.enum([
  "managed_automatic", "pgdump_scheduled", "wal_streaming", "multi_region"
]);

export const Section5Schema = z.object({
  coreEntities: z.array(CoreEntitySchema).min(1),
  workloadProfile: WorkloadProfile,
  softDeleteRequired: z.boolean().default(true),
  globalAuditTrail: z.boolean().default(false),
  dataRetentionPolicy: z.any().optional(),
  searchRequirements: SearchRequirements,
  analyticsRequired: z.boolean().default(false),
  dbIsolationPerTenant: DbIsolationPerTenant.optional(),
  dataVolumeAt12Months: DataVolumeScale,
  backupStrategy: BackupStrategy,
});

// Section 6 - Real-Time Requirements
export const RealTimeFeature = z.enum([
  "live_notifications", "live_feed", "collaborative_editing", "live_cursors",
  "live_comments", "live_dashboard", "live_chat", "presence_indicators",
  "live_form_validation", "event_streaming", "live_map", "live_video"
]);

export const RealTimeProtocol = z.enum([
  "websockets", "server_sent_events", "polling", "long_polling", "webrtc"
]);

export const RealTimeScale = z.enum([
  "under_100_concurrent", "100_to_1k_concurrent", "1k_to_10k_concurrent", "over_10k_concurrent"
]);

export const RealTimeDeliveryGuarantee = z.enum([
  "best_effort", "at_least_once", "exactly_once"
]);

export const Section6Schema = z.object({
  requiresRealTime: z.boolean().default(false),
  realTimeFeatures: z.array(RealTimeFeature).optional(),
  realTimeProtocol: RealTimeProtocol.optional(),
  realTimeScale: RealTimeScale.optional(),
  realTimeDeliveryGuarantee: RealTimeDeliveryGuarantee.optional(),
});

// Section 7 - Background Jobs
export const BackgroundJobType = z.enum([
  "scheduled_cron", "triggered_async", "event_driven", "batch_processing",
  "data_sync", "report_generation", "email_sending", "notification_delivery",
  "file_processing", "ai_inference", "webhook_delivery", "cleanup", "billing_calculation"
]);

export const JobQueuePreference = z.enum([
  "inngest", "bull_redis", "pg_boss", "trigger_dev", "temporal", "aws_sqs", "vercel_cron", "no_preference"
]);

export const JobRetryStrategy = z.enum([
  "no_retry", "fixed_retry", "exponential_backoff", "custom"
]);

export const JobFailureHandling = z.enum([
  "dead_letter_queue", "email_alert", "slack_alert", "auto_retry", "circuit_breaker",
  "fallback_action", "dashboard_monitoring"
]);

export const Section7Schema = z.object({
  requiresBackgroundJobs: z.boolean().default(false),
  backgroundJobTypes: z.array(BackgroundJobType).optional(),
  jobQueuePreference: JobQueuePreference.optional(),
  jobRetryStrategy: JobRetryStrategy.optional(),
  jobFailureHandling: z.array(JobFailureHandling).optional(),
});

// Section 8 - Integrations
export const IntegrationType = z.enum([
  "payment_processing", "email_delivery", "sms_delivery", "push_notifications",
  "oauth_providers", "saml_sso", "crm", "analytics", "error_tracking", "logging",
  "feature_flags", "search", "maps", "video", "ai_llm", "ai_embeddings", "vector_db",
  "storage", "cdn", "webhooks_inbound", "data_warehouse", "calendar", "communication", "none"
]);

export const Section8Schema = z.object({
  integrations: z.array(IntegrationType),
  inboundWebhookSources: z.array(z.string()).optional(),
  paymentDetail: z.any().optional(),
});

// Section 9 - File Storage
export const FileType = z.enum([
  "images", "videos", "documents", "audio", "data_files", "code_files", "archives", "any"
]);

export const FileProcessing = z.enum([
  "image_resize", "image_optimization", "video_transcoding", "pdf_generation",
  "pdf_extraction", "virus_scanning", "content_moderation", "ocr", "metadata_extraction", "none"
]);

export const FileAccessModel = z.enum([
  "public", "private_signed", "private_proxied", "mixed"
]);

export const Section9Schema = z.object({
  requiresFileStorage: z.boolean().default(false),
  acceptedFileTypes: z.array(FileType).optional(),
  maxFileSizeMB: z.number().min(1).max(10000).optional(),
  fileProcessing: z.array(FileProcessing).optional(),
  fileAccessModel: FileAccessModel.optional(),
});

// Section 10 - AI / ML Requirements
export const AIFeature = z.enum([
  "text_generation", "code_generation", "image_generation", "text_to_speech",
  "speech_to_text", "document_analysis", "sentiment_analysis", "classification",
  "recommendation", "semantic_search", "rag_pipeline", "fine_tuned_model",
  "agent_workflow", "data_extraction"
]);

export const AIProvider = z.enum([
  "openai", "anthropic", "google_gemini", "mistral", "cohere", "replicate",
  "aws_bedrock", "azure_openai", "self_hosted", "no_preference"
]);

export const AIDataPrivacy = z.enum([
  "cloud_acceptable", "opt_in_only", "anonymized_only", "no_external_ai"
]);

export const AICostCeiling = z.enum([
  "under_100", "100_to_500", "500_to_2k", "2k_to_10k", "over_10k"
]);

export const Section10Schema = z.object({
  requiresAI: z.boolean().default(false),
  aiFeatures: z.array(AIFeature).optional(),
  aiProvider: z.array(AIProvider).optional(),
  aiDataPrivacy: AIDataPrivacy.optional(),
  aiMonthlyCostCeiling: AICostCeiling.optional(),
});

// Section 11 - Performance Targets
export const TargetFCP = z.enum([
  "under_1s", "1s_to_2s", "2s_to_3s", "over_3s"
]);

export const TargetApiP95 = z.enum([
  "under_100ms", "100ms_to_300ms", "300ms_to_1s", "over_1s"
]);

export const PeakRPS = z.enum([
  "under_10", "10_to_100", "100_to_1k", "1k_to_10k", "over_10k"
]);

export const AcceptableDowntime = z.enum([
  "under_5min", "under_45min", "under_8hr", "any"
]);

export const Section11Schema = z.object({
  targetFCP: TargetFCP,
  targetApiP95: TargetApiP95,
  peakRPS: PeakRPS,
  acceptableDowntimePerMonth: AcceptableDowntime,
});

// Section 12 - Availability & SLA
export const RTOScale = z.enum([
  "under_15min", "15min_to_1hr", "1hr_to_4hr", "4hr_to_24hr", "best_effort"
]);

export const RPOScale = z.enum([
  "zero", "under_5min", "under_1hr", "under_24hr", "best_effort"
]);

export const Section12Schema = z.object({
  rto: RTOScale,
  rpo: RPOScale,
  maintenanceWindowsAcceptable: z.boolean().default(false),
});

// Section 13 - Compliance & Security
export const ComplianceFramework = z.enum([
  "none", "gdpr", "ccpa", "hipaa", "pci_dss", "soc2_type1", "soc2_type2",
  "iso_27001", "fedramp", "sox", "coppa", "wcag_aa", "wcag_aaa"
]);

export const PiiData = z.enum([
  "name", "email", "phone", "address", "date_of_birth", "government_id",
  "financial_data", "health_data", "biometric_data", "location_data",
  "behavioral_data", "communications", "none"
]);

export const EncryptionRequirement = z.enum([
  "encryption_at_rest", "encryption_in_transit", "field_level_encryption",
  "end_to_end_encryption", "key_management_service", "tenant_managed_keys"
]);

export const SecurityFeature = z.enum([
  "mfa", "sso_saml", "sso_oidc", "api_key_auth", "ip_allowlist", "session_management",
  "password_policies", "brute_force_protection", "security_headers",
  "vulnerability_scanning", "penetration_testing", "bug_bounty",
  "intrusion_detection", "ddos_protection"
]);

export const Section13Schema = z.object({
  complianceFrameworks: z.array(ComplianceFramework),
  piiDataCollected: z.array(PiiData),
  encryptionRequirements: z.array(EncryptionRequirement),
  securityFeatures: z.array(SecurityFeature),
});

// Section 14 - Infrastructure Constraints
export const DeploymentPlatform = z.enum([
  "vercel", "aws", "gcp", "azure", "railway", "render", "fly_io", "self_hosted", "kubernetes", "no_preference"
]);

export const ManagedServicesPreference = z.enum([
  "managed_only", "hybrid", "self_hosted_preferred"
]);

export const ColdStartTolerance = z.enum([
  "zero", "under_500ms", "under_2s", "any"
]);

export const MonthlyInfrastructureBudget = z.enum([
  "under_50", "50_to_200", "200_to_500", "500_to_2k", "2k_to_10k", "over_10k"
]);

export const Section14Schema = z.object({
  deploymentPlatform: DeploymentPlatform,
  managedServicesPreference: ManagedServicesPreference,
  coldStartTolerance: ColdStartTolerance,
  containerizationRequired: z.boolean().default(false),
  monthlyInfrastructureBudget: MonthlyInfrastructureBudget,
  cloudProviderRestrictions: z.array(z.string()).optional(),
});

// Section 15 - Timeline & Budget
export const DevTeamSize = z.enum(["solo", "small", "medium", "large", "enterprise"]);

export const FundingStage = z.enum([
  "bootstrapped", "pre_seed", "seed", "series_a", "series_b", "series_c_plus",
  "enterprise_budget", "government"
]);

export const PriorityRank = z.enum([
  "speed_to_market", "scalability", "security", "cost_efficiency",
  "developer_experience", "user_experience", "maintainability"
]);

export const Section15Schema = z.object({
  devTeamSize: DevTeamSize,
  mvpTimelineDays: z.number().min(7).max(730),
  fundingStage: FundingStage,
  priorityRank: z.array(PriorityRank),
});

// --- PART 2: Tech Stack Questionnaire ---

// Section 16 - Rendering Strategy
export const RenderingStrategy = z.enum(["ssg", "ssr", "isr", "csr", "hybrid", "edge_ssr"]);
export const NextjsRouterType = z.enum(["app_router", "pages_router", "mixed"]);
export const RscUsageModel = z.enum(["server_first", "client_heavy", "balanced"]);
export const MiddlewareRequirement = z.enum(["auth_protection", "tenant_resolution", "rate_limiting", "geo_blocking", "ab_testing", "feature_flags", "logging", "cors", "none"]);
export const ThemingRequirement = z.enum(["none", "dark_mode", "custom_theming", "tenant_theming"]);

export const Section16Schema = z.object({
  renderingStrategy: RenderingStrategy,
  seoRequired: z.boolean().default(false),
  staticExportRequired: z.boolean().default(false),
  nextjsRouterType: NextjsRouterType,
  rscUsageModel: RscUsageModel.optional(),
  middlewareRequirements: z.array(MiddlewareRequirement),
  i18nRequired: z.boolean().default(false),
  themingRequired: ThemingRequirement,
});

// Section 17 - API Layer Design
export const ApiArchitecture = z.enum(["rest", "graphql", "trpc", "rest_and_trpc", "grpc", "none"]);
export const ApiVersioningStrategy = z.enum(["url_versioning", "header_versioning", "query_param", "no_versioning", "content_negotiation"]);
export const ApiAuthMethod = z.enum(["session_cookie", "jwt_bearer", "api_key", "oauth2_client_creds", "mutual_tls", "none"]);
export const RateLimitingStrategy = z.enum(["none", "ip_based", "user_based", "api_key_based", "tenant_based", "tiered", "adaptive"]);
export const ApiDocumentation = z.enum(["openapi_auto", "openapi_manual", "graphql_introspection", "postman", "readme_only", "none"]);

export const Section17Schema = z.object({
  apiArchitecture: ApiArchitecture,
  apiVersioningStrategy: ApiVersioningStrategy.optional(),
  apiAuthMethod: z.array(ApiAuthMethod),
  rateLimitingStrategy: RateLimitingStrategy,
  apiDocumentation: ApiDocumentation.optional(),
  outboundWebhooks: z.boolean().default(false),
  useResponseEnvelope: z.boolean().default(true),
});

// Section 18 - Database & ORM
export const PrimaryDatabase = z.enum(["postgresql", "mysql", "sqlite", "mongodb", "planetscale", "turso", "supabase", "neon", "cockroachdb"]);
export const OrmChoice = z.enum(["prisma", "drizzle", "kysely", "typeorm", "sequelize", "raw_sql", "supabase_client"]);
export const ConnectionPooling = z.enum(["prisma_accelerate", "pgbouncer", "neon_pooler", "supabase_pooler", "none"]);
export const MigrationStrategy = z.enum(["prisma_migrate", "drizzle_kit", "flyway", "liquibase", "manual_sql", "expand_contract"]);
export const SeedingStrategy = z.enum(["prisma_seed", "fixtures", "factory_pattern", "none"]);

export const Section18Schema = z.object({
  primaryDatabase: PrimaryDatabase,
  ormChoice: OrmChoice,
  readReplicaRequired: z.boolean().default(false),
  connectionPooling: ConnectionPooling,
  migrationStrategy: MigrationStrategy,
  seedingStrategy: SeedingStrategy,
  multiDatabaseSupport: z.boolean().default(false),
});

// Section 19 - Caching Strategy
export const CacheTechnology = z.enum(["redis", "upstash", "memcached", "vercel_kv", "cloudflare_kv", "in_memory"]);
export const CacheTarget = z.enum(["database_queries", "api_responses", "session_data", "user_permissions", "rate_limit_counters", "feature_flags", "computed_aggregates", "external_api", "page_cache", "pubsub_channels"]);
export const CacheInvalidationStrategy = z.enum(["ttl_based", "event_based", "tag_based", "hybrid"]);
export const NextjsDataCache = z.enum(["default_cache", "no_store", "per_route", "isr_revalidation", "on_demand"]);

export const Section19Schema = z.object({
  cacheLayerRequired: z.boolean().default(false),
  cacheTechnology: CacheTechnology.optional(),
  cacheTargets: z.array(CacheTarget).optional(),
  cacheInvalidationStrategy: CacheInvalidationStrategy.optional(),
  nextjsDataCache: NextjsDataCache.optional(),
});

// Section 20 - Queue & Job Infrastructure
export const QueuePattern = z.enum(["simple_queue", "priority_queue", "delayed_queue", "dead_letter_queue", "fan_out", "work_queue", "saga_pattern"]);

export const Section20Schema = z.object({
  messageQueueRequired: z.boolean().default(false),
  queuePattern: QueuePattern.optional(),
  jobConcurrency: z.any().optional(),
  jobObservability: z.array(z.enum(["job_dashboard", "prometheus_metrics", "datadog_integration", "sentry_integration", "log_aggregation", "alerting"])).optional(),
});

// Section 21 - Authentication Provider
export const AuthLibrary = z.enum(["nextauth_v4", "authjs_v5", "clerk", "auth0", "supabase_auth", "lucia", "better_auth", "custom"]);
export const OauthProvider = z.enum(["email_password", "magic_link", "google", "github", "microsoft", "apple", "slack", "linkedin", "twitter_x", "facebook", "discord", "saml", "ldap", "passkey"]);
export const SessionStrategy = z.enum(["jwt", "database", "redis_session"]);

export const Section21Schema = z.object({
  authLibrary: AuthLibrary,
  oauthProviders: z.array(OauthProvider),
  sessionStrategy: SessionStrategy,
  jwtConfig: z.any().optional(),
  mfaConfig: z.any().optional(),
});

// Section 22 - File Storage Provider
export const ObjectStorageProvider = z.enum(["aws_s3", "cloudflare_r2", "vercel_blob", "supabase_storage", "gcs", "azure_blob", "minio", "uploadthing"]);
export const UploadStrategy = z.enum(["client_direct", "server_proxy", "multipart", "chunked_resumable"]);

export const Section22Schema = z.object({
  objectStorageProvider: ObjectStorageProvider.optional(),
  uploadStrategy: UploadStrategy.optional(),
});

// Section 23 - Observability Stack
export const LoggingProvider = z.enum(["axiom", "datadog", "logtail", "grafana_loki", "cloudwatch", "vercel_logs", "console_only"]);
export const ErrorTrackingProvider = z.enum(["sentry", "datadog", "highlight", "bugsnag", "rollbar", "vercel_monitoring", "none"]);
export const ApmProvider = z.enum(["datadog", "new_relic", "grafana_tempo", "vercel_analytics", "axiom", "none"]);

export const Section23Schema = z.object({
  loggingProvider: LoggingProvider,
  errorTrackingProvider: ErrorTrackingProvider,
  apmProvider: ApmProvider,
  metricsAndAlerting: z.any(),
  openTelemetryRequired: z.boolean().default(false),
});

// Section 24 - CI/CD Pipeline
export const CicdPlatform = z.enum(["github_actions", "vercel_preview", "gitlab_ci", "bitbucket_pipes", "circleci", "jenkins", "aws_codepipeline"]);
export const BranchStrategy = z.enum(["github_flow", "git_flow", "trunk_based", "gitlab_flow"]);
export const DeploymentStrategy = z.enum(["rolling", "blue_green", "canary", "all_at_once", "manual"]);

export const Section24Schema = z.object({
  cicdPlatform: CicdPlatform,
  branchStrategy: BranchStrategy,
  deploymentStrategy: DeploymentStrategy.optional(),
  ciChecks: z.array(z.string()).optional(),
  environments: z.array(z.string()).optional(),
});

// Section 25 - Testing Strategy
export const Section25Schema = z.object({
  testingLayers: z.array(z.string()).optional(),
  testingFrameworks: z.any().optional(),
  coverageTargets: z.any().optional(),
  e2eTestScope: z.array(z.string()).optional(),
  testDataStrategy: z.string().optional(),
  continuousTestingInCI: z.boolean().default(true),
});

// Section 26 - Discovery Experience (CTO-grade intake)
export const EngagementProfile = z.enum([
  "non_technical_founder",
  "product_manager",
  "technical_founder",
  "engineering_lead_cto",
  "enterprise_it_representative",
  "external_consultant",
  "investor_auditor",
]);

export const EngagementMode = z.enum(["non_technical", "technical"]);
export const IntakeStatus = z.enum([
  "DRAFT",
  "SUBMITTED",
  "UNDER_CLARIFICATION",
  "APPROVED",
  "FROZEN",
]);
export const PlanningDepth = z.enum([
  "quick_startup_blueprint",
  "production_grade_system",
  "enterprise_compliance_ready",
]);
export const BusinessObjective = z.enum([
  "revenue_generation",
  "cost_reduction",
  "operational_automation",
  "regulatory_compliance",
  "marketplace_enablement",
  "platform_expansion",
  "data_monetization",
  "internal_productivity",
]);
export const RevenueArchitecture = z.enum([
  "subscription",
  "usage_based",
  "licensing",
  "transaction_fees",
  "commission",
  "advertising",
  "government_funding",
  "internal_cost_savings",
  "not_revenue_driven",
]);
export const CompetitivePositioning = z.enum([
  "speed_latency",
  "ai_differentiation",
  "ux_simplicity",
  "regulatory_compliance",
  "scalability",
  "cost_efficiency",
  "network_effects",
]);
export const WorkflowComplexity = z.enum([
  "no_state_logic",
  "simple_crud",
  "simple_lifecycle",
  "multi_step_forms",
  "role_based_approval",
  "financial_settlement_lifecycle",
  "regulatory_state_transitions",
  "irreversible_states",
  "long_running_processes",
  "human_in_loop",
  "external_callbacks",
]);
export const WorkflowCharacteristic = z.enum([
  "simple_crud",
  "conditional_branching",
  "sla_driven_deadlines",
  "background_automation",
  "event_triggered_flows",
  "human_in_loop",
  "external_callback_integration",
  "real_time_decision_engine",
  "high_frequency_transactions",
]);
export const BusinessCriticality = z.enum([
  "minor_inconvenience",
  "revenue_impact",
  "contractual_penalties",
  "legal_exposure",
  "safety_implications",
  "high_financial_damage_per_hour",
]);
export const DataClassificationType = z.enum([
  "public_content",
  "account_credentials",
  "pii",
  "financial_data",
  "health_records",
  "government_data",
  "trade_secrets",
  "intellectual_property",
  "biometric_data",
]);
export const TrafficProfile = z.enum([
  "predictable_steady",
  "seasonal_spikes",
  "viral_unpredictable",
  "always_on_high_concurrency",
  "high_frequency_event_ingestion",
  "edge_device_ingestion",
]);
export const ComputeNeed = z.enum([
  "scheduled_background_jobs",
  "real_time_notifications",
  "file_media_processing",
  "large_file_uploads",
  "heavy_compute_tasks",
  "ai_inference",
  "streaming_responses",
]);
export const SystemClassification = z.enum([
  "public_web_application",
  "mobile_application",
  "internal_enterprise_system",
  "marketplace_platform",
  "financial_transaction_system",
  "healthcare_system",
  "government_platform",
  "data_platform_analytics_system",
  "iot_hardware_integrated_system",
  "media_streaming_system",
  "hybrid_system",
]);
export const DataStructureType = z.enum([
  "strongly_relational",
  "document_oriented",
  "time_series",
  "graph_relationships",
  "key_value",
  "large_binary_media_storage",
  "hybrid",
]);
export const ConsistencyRequirement = z.enum([
  "strong_consistency_required",
  "eventual_consistency_acceptable",
  "mixed_consistency",
  "transactional_guarantees_required",
]);
export const RetentionPolicy = z.enum([
  "permanent_storage",
  "regulatory_retention_period",
  "time_bound_deletion",
  "user_controlled_deletion",
  "auto_archival",
  "regulatory_driven_retention",
  "immutable_record_storage_required",
]);
export const DataResidencyConstraint = z.enum([
  "no_restriction",
  "regional_storage_required",
  "country_level_isolation",
  "multi_region_redundancy_required",
  "eu_only",
  "us_only",
  "multi_region_isolation_required",
]);
export const AnalyticsExpectation = z.enum([
  "basic_usage_metrics",
  "funnel_analytics",
  "financial_reporting",
  "bi_dashboards",
  "real_time_analytics",
  "data_warehouse_export_required",
]);
export const AiFunctionalRole = z.enum([
  "chat_assistant",
  "search_rag",
  "document_processing",
  "content_generation",
  "personalization",
  "computer_vision",
]);
export const AiModelStrategy = z.enum(["external_api", "self_hosted", "hybrid"]);
export const AiLatencyRequirement = z.enum(["under_200ms", "under_1s", "under_3s", "async_acceptable"]);
export const RequestCharacteristic = z.enum([
  "small_payloads",
  "large_uploads",
  "streaming_required",
  "long_lived_connections",
  "websockets_required",
  "grpc_required",
]);
export const FinancialTransactionModel = z.enum([
  "simple_payments",
  "escrow",
  "multi_party_settlement",
  "ledger_based_accounting",
  "real_time_reconciliation",
  "multi_currency",
  "cross_border",
]);
export const FinancialAuditRequirement = z.enum([
  "basic_logs_sufficient",
  "immutable_audit_logs_required",
  "double_entry_accounting_required",
  "external_audit_integrations_required",
]);
export const IntegrationSurface = z.enum([
  "payment_providers",
  "banking_apis",
  "erp",
  "crm",
  "government_apis",
  "iot_devices",
  "webhooks",
  "data_warehouse",
  "third_party_saas",
  "hardware_systems",
]);
export const ApiExposureModel = z.enum([
  "no",
  "internal_only",
  "partner_api",
  "public_api",
  "sdk_required",
]);
export const AdvancedCapability = z.enum([
  "ai_assistant",
  "fraud_detection",
  "risk_scoring",
  "predictive_analytics",
  "recommendation_engine",
  "search_indexing",
  "document_processing",
  "computer_vision",
  "none",
]);
export const ProcessingModel = z.enum([
  "real_time_inference",
  "batch_processing",
  "streaming_analytics",
  "offline_model_training",
  "external_ai_apis",
  "self_hosted_models",
]);
export const ThreatProfile = z.enum([
  "fraud",
  "data_theft",
  "ddos",
  "insider_threats",
  "nation_state_attacks",
]);
export const AvailabilityTarget = z.enum([
  "best_effort",
  "99",
  "99_9",
  "99_99",
  "99_999",
]);
export const HostingPreference = z.enum([
  "fully_managed",
  "hybrid",
  "self_hosted",
  "on_prem_required",
  "multi_cloud_required",
]);
export const AdminControl = z.enum([
  "user_management",
  "role_management",
  "tenant_configuration",
  "sla_monitoring",
  "escalation_workflows",
  "feature_flags",
  "audit_logs",
  "system_announcements",
]);
export const ObservabilityRequirement = z.enum([
  "basic_logging",
  "error_tracking_only",
  "structured_logging",
  "distributed_tracing",
  "sla_monitoring",
  "alerting",
  "immutable_audit_dashboard",
]);
export const AuthenticationExpectation = z.enum([
  "basic_login",
  "oauth",
  "enterprise_sso",
  "mfa",
  "passkeys",
  "hardware_token_integration",
]);
export const AuthorizationExpectation = z.enum([
  "rbac",
  "abac",
  "policy_based",
  "ownership_based",
  "field_level_permissions",
  "tenant_scoped_isolation",
]);
export const IntendedLifespan = z.enum([
  "prototype",
  "mvp",
  "mvp_1_to_2_years",
  "three_to_five_year_system",
  "long_term_scalable_platform",
  "enterprise_grade_system",
  "enterprise_long_term_system",
]);
export const ExitVision = z.enum([
  "acquisition",
  "ipo_scale",
  "cash_flow_lifestyle",
  "internal_tool_only",
]);
export const TeamMaturityLevel = z.enum([
  "solo_founder",
  "small_early_stage_team",
  "experienced_startup_team",
  "enterprise_engineering_org",
]);
export const TeamSeniorityLevel = z.enum([
  "mostly_juniors",
  "mixed_mid_senior",
  "senior_staff_principal",
]);
export const DevOpsMaturityLevel = z.enum([
  "minimal_manual",
  "basic_ci_cd",
  "automated_platform_engineering",
  "sre_ready",
]);
export const SecurityExpertiseLevel = z.enum([
  "none",
  "part_time",
  "dedicated_engineer",
  "security_team",
]);
export const CostSensitivityIndex = z.enum([
  "cost_first",
  "balanced",
  "performance_first",
]);

export const Section26Schema = z.object({
  intakeSchemaVersion: z.string().default("1.0.0"),
  intakeStatus: IntakeStatus.default("SUBMITTED"),
  engagementProfile: EngagementProfile.optional(),
  engagementMode: EngagementMode.optional(),
  planningDepth: PlanningDepth.optional(),
  systemClassification: SystemClassification.optional(),
  businessObjective: BusinessObjective.optional(),
  businessSuccessKpi: z.string().max(250).optional(),
  revenueArchitecture: RevenueArchitecture.optional(),
  entitlementsVaryByPlan: z.boolean().default(false),
  pricingChangesFrequently: z.boolean().default(false),
  requiresBillingProration: z.boolean().default(false),
  expectsRefundsCredits: z.boolean().default(false),
  competitivePositioning: z.array(CompetitivePositioning).optional(),
  coreDomainObjectsList: z.array(z.string()).optional(),
  objectOwnershipNotes: z.string().max(1200).optional(),
  lifecycleStates: z.string().max(1200).optional(),
  stateTransitionsMode: z.enum(["automated", "manual", "hybrid"]).optional(),
  stateTransitionsReversible: z.boolean().default(false),
  stateTransitionsTriggerNotifications: z.boolean().default(false),
  stateTransitionsTriggerFinancialEvents: z.boolean().default(false),
  workflowComplexityLevel: WorkflowComplexity.optional(),
  workflowCharacteristics: z.array(WorkflowCharacteristic).optional(),
  workflowsConfigurableByAdmins: z.boolean().default(false),
  workflowsDifferByTenant: z.boolean().default(false),
  businessCriticality24hOutage: BusinessCriticality.optional(),
  dataStructureType: DataStructureType.optional(),
  consistencyRequirement: ConsistencyRequirement.optional(),
  hasFinancialLogic: z.boolean().default(false),
  financialTransactionModel: FinancialTransactionModel.optional(),
  financialAuditRequirement: FinancialAuditRequirement.optional(),
  dataClassification: z.array(DataClassificationType).optional(),
  fieldLevelEncryptionRequired: z.boolean().default(false),
  auditImmutabilityRequired: z.boolean().default(false),
  complianceCertificationWithin12Months: z.boolean().default(false),
  usersAt36Months: MagnitudeScale.optional(),
  trafficProfile: TrafficProfile.optional(),
  computeNeeds: z.array(ComputeNeed).optional(),
  requestCharacteristics: z.array(RequestCharacteristic).optional(),
  retentionPolicy: RetentionPolicy.optional(),
  dataResidencyConstraint: DataResidencyConstraint.optional(),
  analyticsExpectations: z.array(AnalyticsExpectation).optional(),
  aiFunctionalRoles: z.array(AiFunctionalRole).optional(),
  aiModelStrategy: AiModelStrategy.optional(),
  aiLatencyRequirement: AiLatencyRequirement.optional(),
  aiDataCanLeaveRegion: z.boolean().default(true),
  aiRequiresPrivateModels: z.boolean().default(false),
  aiPromptAuditRequired: z.boolean().default(false),
  integrationSurface: z.array(IntegrationSurface).optional(),
  apiExposureModel: ApiExposureModel.optional(),
  advancedCapabilities: z.array(AdvancedCapability).optional(),
  processingModels: z.array(ProcessingModel).optional(),
  adminControlsRequired: z.array(AdminControl).optional(),
  observabilityRequirementsDesired: z.array(ObservabilityRequirement).optional(),
  authenticationExpectations: z.array(AuthenticationExpectation).optional(),
  authorizationExpectations: z.array(AuthorizationExpectation).optional(),
  threatProfiles: z.array(ThreatProfile).optional(),
  availabilityTarget: AvailabilityTarget.optional(),
  hostingPreference: HostingPreference.optional(),
  teamMaturityLevel: TeamMaturityLevel.optional(),
  teamSeniorityLevel: TeamSeniorityLevel.optional(),
  devOpsMaturityLevel: DevOpsMaturityLevel.optional(),
  securityExpertiseLevel: SecurityExpertiseLevel.optional(),
  hasExistingProductionData: z.boolean().default(false),
  migrationRequired: z.boolean().default(false),
  backwardCompatibilityRequired: z.boolean().default(false),
  legacyIntegrationRequired: z.boolean().default(false),
  gracefulDegradationRequired: z.boolean().default(true),
  readOnlyModeAcceptable: z.boolean().default(true),
  backgroundJobsCanDelay: z.boolean().default(true),
  analyticsCanLag: z.boolean().default(true),
  costSensitivityIndex: CostSensitivityIndex.optional(),
  intendedSystemLifespan: IntendedLifespan.optional(),
  exitVision: ExitVision.optional(),
  strategicArchitectureIntent: z.string().max(1000).optional(),
});

// Merge schemas
const FullRequirementsBaseSchema = z.object({
  ...Section1Schema.shape,
  ...Section2Schema.shape,
  ...Section3Schema.shape,
  ...Section4Schema.shape,
  ...Section5Schema.shape,
  ...Section6Schema.shape,
  ...Section7Schema.shape,
  ...Section8Schema.shape,
  ...Section9Schema.shape,
  ...Section10Schema.shape,
  ...Section11Schema.shape,
  ...Section12Schema.shape,
  ...Section13Schema.shape,
  ...Section14Schema.shape,
  ...Section15Schema.shape,
  ...Section16Schema.shape,
  ...Section17Schema.shape,
  ...Section18Schema.shape,
  ...Section19Schema.shape,
  ...Section20Schema.shape,
  ...Section21Schema.shape,
  ...Section22Schema.shape,
  ...Section23Schema.shape,
  ...Section24Schema.shape,
  ...Section25Schema.shape,
  ...Section26Schema.shape,
});

export const FullRequirementsSchema = FullRequirementsBaseSchema.superRefine((data, ctx) => {
  if (data.projectType === "other" && !data.projectTypeDescription?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["projectTypeDescription"],
      message: "projectTypeDescription is required when projectType is 'other'.",
    });
  }

  if (["migrating", "rebuilding", "scaling"].includes(data.projectStage) && (!data.existingStack || data.existingStack.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["existingStack"],
      message: "existingStack is required for migrating, rebuilding, or scaling stages.",
    });
  }

  if (data.targetGeographies.includes("specific") && !data.targetGeographiesDetail?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["targetGeographiesDetail"],
      message: "targetGeographiesDetail is required when targetGeographies includes 'specific'.",
    });
  }

  if (data.hasTeamAccounts && !data.maxTeamSize) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["maxTeamSize"],
      message: "maxTeamSize is required when hasTeamAccounts is true.",
    });
  }

  if (data.isMultiTenant) {
    const requiredTenantFields = [
      "tenantIsolationModel",
      "tenantIdentificationMethod",
      "tenantOnboardingModel",
      "tenantCustomization",
      "crossTenantSharing",
      "tenantTierModel",
      "tenantsAtLaunch",
      "tenantsAt12Months",
      "tenantDataDeletion",
      "tenantAdminCapabilities",
      "tenantDataResidency",
    ] as const;

    requiredTenantFields.forEach((field) => {
      const value = data[field];
      const isMissing = value == null || (Array.isArray(value) && value.length === 0);
      if (isMissing) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: `${field} is required when isMultiTenant is true.`,
        });
      }
    });
  }

  if (["rbac", "rbac_with_abac"].includes(data.accessControlModel)) {
    const rbacRequired = ["roles", "roleHierarchy", "permissionGranularity", "resourcePermissions", "dynamicRoles", "multipleRolesPerUser", "roleAssignmentRequiresApproval", "ownershipOverride"] as const;
    rbacRequired.forEach((field) => {
      const value = data[field];
      const isMissing = value == null || (Array.isArray(value) && value.length === 0);
      if (isMissing) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: `${field} is required for RBAC models.`,
        });
      }
    });

    const hasSuperAdmin = (data.roles ?? []).some((role) => role.isSuperAdmin);
    if (hasSuperAdmin && data.superAdminBypassesChecks == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["superAdminBypassesChecks"],
        message: "superAdminBypassesChecks is required when any role is marked isSuperAdmin.",
      });
    }

    if (data.isMultiTenant && data.rolesAreTenantScoped == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rolesAreTenantScoped"],
        message: "rolesAreTenantScoped is required for multi-tenant RBAC models.",
      });
    }
  }

  if (["abac", "rbac_with_abac"].includes(data.accessControlModel)) {
    const abacRequired = ["abacAttributes", "abacPolicies", "abacConflictResolution", "abacPolicyManagement"] as const;
    abacRequired.forEach((field) => {
      const value = data[field];
      const isMissing = value == null || (Array.isArray(value) && value.length === 0);
      if (isMissing) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: `${field} is required for ABAC models.`,
        });
      }
    });
  }

  if (data.accessControlModel === "pbac") {
    const pbacRequired = ["policyEngine", "policiesAuditable", "policiesUseExternalData"] as const;
    pbacRequired.forEach((field) => {
      if (data[field] == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: `${field} is required when accessControlModel is 'pbac'.`,
        });
      }
    });
  }

  if (data.requiresRealTime) {
    const rtRequired = ["realTimeFeatures", "realTimeProtocol", "realTimeScale", "realTimeDeliveryGuarantee"] as const;
    rtRequired.forEach((field) => {
      const value = data[field];
      const isMissing = value == null || (Array.isArray(value) && value.length === 0);
      if (isMissing) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: `${field} is required when requiresRealTime is true.`,
        });
      }
    });
  }

  if (data.requiresBackgroundJobs) {
    const jobsRequired = ["backgroundJobTypes", "jobQueuePreference", "jobRetryStrategy", "jobFailureHandling"] as const;
    jobsRequired.forEach((field) => {
      const value = data[field];
      const isMissing = value == null || (Array.isArray(value) && value.length === 0);
      if (isMissing) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: `${field} is required when requiresBackgroundJobs is true.`,
        });
      }
    });
  }

  if (data.integrations.includes("webhooks_inbound") && (!data.inboundWebhookSources || data.inboundWebhookSources.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["inboundWebhookSources"],
      message: "inboundWebhookSources is required when integrations include webhooks_inbound.",
    });
  }

  if (data.integrations.includes("payment_processing") && !data.paymentDetail) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["paymentDetail"],
      message: "paymentDetail is required when integrations include payment_processing.",
    });
  }

  if (data.requiresFileStorage) {
    const fileRequired = ["acceptedFileTypes", "maxFileSizeMB", "fileProcessing", "fileAccessModel", "objectStorageProvider", "uploadStrategy"] as const;
    fileRequired.forEach((field) => {
      const value = data[field];
      const isMissing = value == null || (Array.isArray(value) && value.length === 0);
      if (isMissing) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: `${field} is required when requiresFileStorage is true.`,
        });
      }
    });
  }

  if (data.requiresAI) {
    const aiRequired = ["aiFeatures", "aiProvider", "aiDataPrivacy", "aiMonthlyCostCeiling"] as const;
    aiRequired.forEach((field) => {
      const value = data[field];
      const isMissing = value == null || (Array.isArray(value) && value.length === 0);
      if (isMissing) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: `${field} is required when requiresAI is true.`,
        });
      }
    });
  }

  if (data.hasFinancialLogic) {
    if (!data.financialTransactionModel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["financialTransactionModel"],
        message: "financialTransactionModel is required when hasFinancialLogic is true.",
      });
    }
    if (!data.financialAuditRequirement) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["financialAuditRequirement"],
        message: "financialAuditRequirement is required when hasFinancialLogic is true.",
      });
    }
  }

  if (data.migrationRequired && !data.hasExistingProductionData) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["hasExistingProductionData"],
      message: "hasExistingProductionData must be true when migrationRequired is true.",
    });
  }

  if (data.backwardCompatibilityRequired && data.apiVersioningStrategy === "no_versioning") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["apiVersioningStrategy"],
      message: "Backward compatibility requires an explicit API versioning strategy.",
    });
  }

  if (data.legacyIntegrationRequired && (!data.integrationSurface || data.integrationSurface.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["integrationSurface"],
      message: "Select at least one integration when legacyIntegrationRequired is true.",
    });
  }

  if (["rest", "graphql", "grpc"].includes(data.apiArchitecture)) {
    if (!data.apiVersioningStrategy) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["apiVersioningStrategy"],
        message: "apiVersioningStrategy is required for REST/GraphQL/gRPC APIs.",
      });
    }
    if (!data.apiDocumentation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["apiDocumentation"],
        message: "apiDocumentation is required for REST/GraphQL/gRPC APIs.",
      });
    }
  }

  if (data.nextjsRouterType === "app_router" && !data.rscUsageModel) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["rscUsageModel"],
      message: "rscUsageModel is required when nextjsRouterType is 'app_router'.",
    });
  }

  if (data.nextjsRouterType === "app_router" && !data.nextjsDataCache) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["nextjsDataCache"],
      message: "nextjsDataCache is required when nextjsRouterType is 'app_router'.",
    });
  }

  if (data.cacheLayerRequired) {
    const cacheRequired = ["cacheTechnology", "cacheTargets", "cacheInvalidationStrategy"] as const;
    cacheRequired.forEach((field) => {
      const value = data[field];
      const isMissing = value == null || (Array.isArray(value) && value.length === 0);
      if (isMissing) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: `${field} is required when cacheLayerRequired is true.`,
        });
      }
    });
  }

  if (data.messageQueueRequired && !data.queuePattern) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["queuePattern"],
      message: "queuePattern is required when messageQueueRequired is true.",
    });
  }

  if (data.sessionStrategy === "jwt" && !data.jwtConfig) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["jwtConfig"],
      message: "jwtConfig is required when sessionStrategy is 'jwt'.",
    });
  }

  if (data.securityFeatures.includes("mfa") && !data.mfaConfig) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["mfaConfig"],
      message: "mfaConfig is required when securityFeatures includes 'mfa'.",
    });
  }

  const launchDate = new Date(data.targetLaunchDate);
  if (Number.isNaN(launchDate.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["targetLaunchDate"],
      message: "targetLaunchDate must be a valid ISO 8601 date.",
    });
  } else {
    const minLaunch = new Date();
    minLaunch.setHours(0, 0, 0, 0);
    minLaunch.setDate(minLaunch.getDate() + 14);
    if (launchDate < minLaunch) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["targetLaunchDate"],
        message: "targetLaunchDate must be at least 14 days from today.",
      });
    }
  }
});

export type FullRequirementsData = z.infer<typeof FullRequirementsSchema>;
