"use client"

import { useMemo, useState } from "react"
import type { SVGProps } from "react"
import { useForm, FormProvider, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"
import { FullRequirementsSchema, FullRequirementsData } from "@/db/requirements-schema"
import { cn } from "@/lib/utils"

import { Step0Engagement } from "./Step0Engagement"
import { Step1BusinessIntent } from "./Step1BusinessIntent"
import { Step2DomainWorkflow } from "./Step2DomainWorkflow"
import { Step3RiskScale } from "./Step3RiskScale"
import { Step4DataAi } from "./Step4DataAi"
import { Step5TechnicalDeepDive } from "./Step5TechnicalDeepDive"
import { Step5FinancialIntegrity } from "./Step5FinancialIntegrity"
import { Step7ScaleLoad } from "./Step7ScaleLoad"
import { Step8Integration } from "./Step8Integration"
import { Step9Intelligence } from "./Step9Intelligence"
import { Step10Security } from "./Step10Security"
import { Step11Resilience } from "./Step11Resilience"
import { Step12Infrastructure } from "./Step12Infrastructure"

// Default partial values based on schema
const defaultValues: Partial<z.input<typeof FullRequirementsSchema>> = {
  intakeSchemaVersion: "1.0.0",
  intakeStatus: "SUBMITTED",
  engagementProfile: "non_technical_founder",
  engagementMode: "non_technical",
  planningDepth: "production_grade_system",
  systemClassification: "public_web_application",
  businessObjective: "revenue_generation",
  businessSuccessKpi: "",
  revenueArchitecture: "subscription",
  entitlementsVaryByPlan: true,
  pricingChangesFrequently: false,
  requiresBillingProration: false,
  expectsRefundsCredits: false,
  competitivePositioning: ["ux_simplicity"],
  coreDomainObjectsList: ["User", "Workspace", "Project"],
  objectOwnershipNotes: "",
  lifecycleStates: "",
  stateTransitionsMode: "manual",
  stateTransitionsReversible: true,
  stateTransitionsTriggerNotifications: true,
  stateTransitionsTriggerFinancialEvents: false,
  workflowComplexityLevel: "simple_lifecycle",
  workflowCharacteristics: ["simple_crud", "background_automation"],
  workflowsConfigurableByAdmins: false,
  workflowsDifferByTenant: false,
  businessCriticality24hOutage: "revenue_impact",
  dataStructureType: "strongly_relational",
  consistencyRequirement: "mixed_consistency",
  hasFinancialLogic: false,
  financialTransactionModel: "simple_payments",
  financialAuditRequirement: "basic_logs_sufficient",
  dataClassification: ["account_credentials"],
  fieldLevelEncryptionRequired: false,
  auditImmutabilityRequired: false,
  complianceCertificationWithin12Months: false,
  usersAt36Months: "100k_to_1m",
  trafficProfile: "seasonal_spikes",
  computeNeeds: ["scheduled_background_jobs"],
  requestCharacteristics: ["small_payloads"],
  retentionPolicy: "time_bound_deletion",
  dataResidencyConstraint: "no_restriction",
  analyticsExpectations: ["basic_usage_metrics"],
  aiFunctionalRoles: ["chat_assistant"],
  aiModelStrategy: "external_api",
  aiLatencyRequirement: "under_1s",
  aiDataCanLeaveRegion: true,
  aiRequiresPrivateModels: false,
  aiPromptAuditRequired: false,
  integrationSurface: ["third_party_saas"],
  apiExposureModel: "internal_only",
  advancedCapabilities: ["none"],
  processingModels: ["batch_processing"],
  adminControlsRequired: ["user_management", "audit_logs"],
  observabilityRequirementsDesired: ["basic_logging", "structured_logging", "immutable_audit_dashboard"],
  authenticationExpectations: ["basic_login", "oauth"],
  authorizationExpectations: ["rbac", "tenant_scoped_isolation"],
  threatProfiles: ["data_theft"],
  availabilityTarget: "99_9",
  hostingPreference: "fully_managed",
  teamMaturityLevel: "small_early_stage_team",
  teamSeniorityLevel: "mixed_mid_senior",
  devOpsMaturityLevel: "basic_ci_cd",
  securityExpertiseLevel: "part_time",
  hasExistingProductionData: false,
  migrationRequired: false,
  backwardCompatibilityRequired: false,
  legacyIntegrationRequired: false,
  gracefulDegradationRequired: true,
  readOnlyModeAcceptable: true,
  backgroundJobsCanDelay: true,
  analyticsCanLag: true,
  costSensitivityIndex: "balanced",
  intendedSystemLifespan: "long_term_scalable_platform",
  exitVision: "acquisition",
  strategicArchitectureIntent: "",

  projectName: "",
  projectType: "saas_b2b",
  problemStatement: "",
  solutionSummary: "",
  projectStage: "greenfield",
  industry: "other",
  targetGeographies: ["global"],
  targetLaunchDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  
  primaryUserType: "mixed",
  numberOfRoles: 3,
  usersAtLaunch: "100_to_1k",
  usersAt12Months: "10k_to_100k",
  peakConcurrentUsers: "500_to_5k",
  avgSessionDuration: "30min_to_2hr",
  userGeographicDistribution: "global",
  userTechnicalLevel: "semi_technical",
  hasTeamAccounts: false,
  hasGuestAccess: false,
  
  isMultiTenant: false,
  tenantIsolationModel: "shared_schema",
  tenantIdentificationMethod: "subdomain",
  tenantOnboardingModel: "self_service",
  tenantCustomization: ["none"],
  crossTenantSharing: "none",
  tenantTierModel: "flat_pricing",
  tenantsAtLaunch: "under_10",
  tenantsAt12Months: "10_to_100",
  tenantDataDeletion: "grace_period",
  tenantAdminCapabilities: ["user_management"],
  tenantDataResidency: "no_requirement",

  accessControlModel: "ownership_based",
  roles: [
    {
      name: "owner",
      description: "Resource owner",
      scope: "resource",
      isDefault: true,
      isSuperAdmin: false,
    },
  ],
  roleHierarchy: "flat",
  permissionGranularity: "resource_level",
  resourcePermissions: [
    {
      resourceName: "Project",
      actions: ["create", "read", "update", "delete"],
      ownershipRule: "Owner can modify own resources",
    },
  ],
  dynamicRoles: false,
  superAdminBypassesChecks: true,
  rolesAreTenantScoped: true,
  multipleRolesPerUser: false,
  roleAssignmentRequiresApproval: false,
  ownershipOverride: true,
  abacAttributes: [
    {
      name: "user.id",
      source: "user",
      type: "string",
      example: "user_123",
    },
  ],
  abacPolicies: [
    {
      id: "POL-001",
      description: "Owner can access owned resources",
      effect: "allow",
      condition: "user.id == resource.ownerId",
      priority: 10,
    },
  ],
  abacConflictResolution: "deny_overrides",
  abacPolicyManagement: "static_developer",
  policyEngine: "cerbos",
  policiesAuditable: true,
  policiesUseExternalData: false,
  
  coreEntities: [
    { name: "User", description: "Standard user", estimatedRows: "10k_to_100k", writeFrequency: "occasional", readFrequency: "frequent", relationships: [], requiresAudit: false, requiresSoftDelete: true }
  ],
  workloadProfile: "balanced",
  searchRequirements: "basic_filter",
  dataVolumeAt12Months: "10gb_to_100gb",
  backupStrategy: "managed_automatic",
  
  requiresRealTime: false,
  realTimeFeatures: ["live_notifications"],
  realTimeProtocol: "server_sent_events",
  realTimeScale: "under_100_concurrent",
  realTimeDeliveryGuarantee: "best_effort",
  requiresBackgroundJobs: false,
  backgroundJobTypes: ["scheduled_cron"],
  jobQueuePreference: "inngest",
  jobRetryStrategy: "exponential_backoff",
  jobFailureHandling: ["dead_letter_queue"],
  integrations: ["none"],
  inboundWebhookSources: ["placeholder"],
  paymentDetail: {
    provider: "stripe",
    taxHandling: "stripe_tax",
  },
  requiresFileStorage: false,
  acceptedFileTypes: ["images"],
  maxFileSizeMB: 10,
  fileProcessing: ["none"],
  fileAccessModel: "private_signed",
  objectStorageProvider: "cloudflare_r2",
  uploadStrategy: "client_direct",
  requiresAI: false,
  aiFeatures: ["text_generation"],
  aiProvider: ["openai"],
  aiDataPrivacy: "cloud_acceptable",
  aiMonthlyCostCeiling: "under_100",
  
  targetFCP: "1s_to_2s",
  targetApiP95: "100ms_to_300ms",
  peakRPS: "100_to_1k",
  acceptableDowntimePerMonth: "under_45min",
  rto: "1hr_to_4hr",
  rpo: "under_24hr",
  complianceFrameworks: ["none"],
  piiDataCollected: ["name", "email"],
  encryptionRequirements: ["encryption_at_rest", "encryption_in_transit"],
  securityFeatures: ["security_headers"],
  
  deploymentPlatform: "vercel",
  managedServicesPreference: "managed_only",
  coldStartTolerance: "under_2s",
  monthlyInfrastructureBudget: "50_to_200",
  
  devTeamSize: "solo",
  mvpTimelineDays: 30,
  fundingStage: "bootstrapped",
  priorityRank: ["speed_to_market", "developer_experience"],
  
  renderingStrategy: "hybrid",
  nextjsRouterType: "app_router",
  rscUsageModel: "server_first",
  middlewareRequirements: ["none"],
  themingRequired: "dark_mode",
  
  apiArchitecture: "rest_and_trpc",
  apiVersioningStrategy: "url_versioning",
  apiAuthMethod: ["session_cookie"],
  rateLimitingStrategy: "user_based",
  apiDocumentation: "openapi_auto",
  
  primaryDatabase: "neon",
  ormChoice: "prisma",
  connectionPooling: "neon_pooler",
  migrationStrategy: "prisma_migrate",
  seedingStrategy: "prisma_seed",
  cacheLayerRequired: false,
  cacheTechnology: "upstash",
  cacheTargets: ["database_queries"],
  cacheInvalidationStrategy: "ttl_based",
  messageQueueRequired: false,
  queuePattern: "simple_queue",
  
  authLibrary: "authjs_v5",
  oauthProviders: ["email_password"],
  sessionStrategy: "jwt",
  jwtConfig: {
    accessTokenExpiry: "15m",
    refreshTokenExpiry: "30d",
    rotateRefreshTokens: true,
  },
  nextjsDataCache: "default_cache",
  
  loggingProvider: "axiom",
  errorTrackingProvider: "sentry",
  apmProvider: "vercel_analytics",
  metricsAndAlerting: {},
  
  cicdPlatform: "github_actions",
  branchStrategy: "github_flow",
}

const TEST_SEEDS: Record<string, Partial<z.input<typeof FullRequirementsSchema>>> = {
  founder_mvp: {
    projectName: "CampusFund MVP",
    projectStage: "greenfield",
    engagementProfile: "non_technical_founder",
    engagementMode: "non_technical",
    planningDepth: "production_grade_system",
    systemClassification: "public_web_application",
    problemStatement: "Students and alumni need a transparent platform to discover and fund campus projects quickly.",
    solutionSummary: "A web platform for listing projects, collecting contributions, and tracking updates with clear governance.",
    usersAt12Months: "10k_to_100k",
    usersAt36Months: "100k_to_1m",
    complianceFrameworks: ["none"],
    hasFinancialLogic: true,
    financialTransactionModel: "simple_payments",
    financialAuditRequirement: "immutable_audit_logs_required",
    teamMaturityLevel: "small_early_stage_team",
    teamSeniorityLevel: "mixed_mid_senior",
    devOpsMaturityLevel: "basic_ci_cd",
    securityExpertiseLevel: "part_time",
    costSensitivityIndex: "cost_first",
  },
  regulated_financial: {
    projectName: "RegLedger Platform",
    projectStage: "migrating",
    engagementProfile: "engineering_lead_cto",
    engagementMode: "technical",
    planningDepth: "enterprise_compliance_ready",
    systemClassification: "financial_transaction_system",
    problemStatement: "Regulated institutions need auditable, low-risk ledger operations with strict compliance and compatibility requirements.",
    solutionSummary: "A compliance-first transaction platform with immutable audit history, strict controls, and staged migration from legacy systems.",
    complianceFrameworks: ["soc2_type2", "pci_dss"],
    hasFinancialLogic: true,
    financialTransactionModel: "ledger_based_accounting",
    financialAuditRequirement: "double_entry_accounting_required",
    consistencyRequirement: "transactional_guarantees_required",
    dataClassification: ["financial_data", "pii"],
    migrationRequired: true,
    hasExistingProductionData: true,
    backwardCompatibilityRequired: true,
    legacyIntegrationRequired: true,
    teamMaturityLevel: "experienced_startup_team",
    teamSeniorityLevel: "senior_staff_principal",
    devOpsMaturityLevel: "automated_platform_engineering",
    securityExpertiseLevel: "dedicated_engineer",
    costSensitivityIndex: "balanced",
  },
  scale_ai: {
    projectName: "InsightMesh",
    projectStage: "scaling",
    engagementProfile: "technical_founder",
    engagementMode: "technical",
    planningDepth: "production_grade_system",
    systemClassification: "data_platform_analytics_system",
    problemStatement: "Product teams need AI-assisted analytics across high-volume event streams with low-latency insights.",
    solutionSummary: "A scalable analytics + AI platform supporting real-time insights, background processing, and external integrations.",
    usersAt12Months: "100k_to_1m",
    usersAt36Months: "over_1m",
    trafficProfile: "always_on_high_concurrency",
    peakConcurrentUsers: "over_50k",
    advancedCapabilities: ["predictive_analytics", "search_indexing"],
    processingModels: ["real_time_inference", "streaming_analytics"],
    requiresAI: true,
    aiProvider: ["openai"],
    teamMaturityLevel: "experienced_startup_team",
    teamSeniorityLevel: "mixed_mid_senior",
    devOpsMaturityLevel: "sre_ready",
    securityExpertiseLevel: "part_time",
    costSensitivityIndex: "performance_first",
  },
}

const STEPS = [
  {
    id: "engagement",
    title: "Engagement Profile",
    description: "Audience and discovery depth.",
    component: Step0Engagement,
  },
  {
    id: "business-intent",
    title: "Business Intent",
    description: "Objectives, monetization, and competitive edge.",
    component: Step1BusinessIntent,
  },
  {
    id: "domain-workflow",
    title: "Domain Workflow",
    description: "Core objects, lifecycle, and workflow entropy.",
    component: Step2DomainWorkflow,
  },
  {
    id: "risk-compliance",
    title: "Risk & Compliance",
    description: "Criticality, regulation, and sensitivity profile.",
    component: Step3RiskScale,
  },
  {
    id: "scale-load",
    title: "Scale & Load",
    description: "Growth projection, traffic, and request patterns.",
    component: Step7ScaleLoad,
  },
  {
    id: "data-architecture",
    title: "Data Architecture",
    description: "Topology, consistency, residency, and retention.",
    component: Step4DataAi,
  },
  {
    id: "financial-integrity",
    title: "Financial Integrity",
    description: "Transaction and audit rigor for money workflows.",
    component: Step5FinancialIntegrity,
  },
  {
    id: "integration",
    title: "Integration Ecosystem",
    description: "External systems and API exposure strategy.",
    component: Step8Integration,
  },
  {
    id: "intelligence",
    title: "Intelligence Layer",
    description: "Advanced processing and AI capabilities.",
    component: Step9Intelligence,
  },
  {
    id: "security",
    title: "Security Architecture",
    description: "Authentication, authorization, and threats.",
    component: Step10Security,
  },
  {
    id: "resilience",
    title: "Operational Resilience",
    description: "Availability, recovery objectives, observability.",
    component: Step11Resilience,
  },
  {
    id: "infrastructure",
    title: "Infrastructure Constraints",
    description: "Hosting, budget, cold-start, and evolution.",
    component: Step12Infrastructure,
  },
]

const TECHNICAL_STEP = {
  id: "technical-deep-dive",
  title: "Technical Deep Dive",
  description: "Database, API, auth, cache, and tenancy controls.",
  component: Step5TechnicalDeepDive,
}

interface RequirementsWizardProps {
  onSubmit: (data: FullRequirementsData) => void
  isLoading: boolean
}

export function RequirementsWizard({ onSubmit, isLoading }: RequirementsWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  
  const form = useForm<z.input<typeof FullRequirementsSchema>, unknown, z.output<typeof FullRequirementsSchema>>({
    resolver: zodResolver(FullRequirementsSchema),
    defaultValues,
    mode: "onChange",
  })
  
  const { handleSubmit, formState: { errors }, reset } = form
  const engagementMode = useWatch({ control: form.control, name: "engagementMode" })

  const steps = useMemo(() => {
    if (engagementMode === "technical") {
      return [
        STEPS[0],
        STEPS[1],
        STEPS[2],
        STEPS[3],
        STEPS[4],
        TECHNICAL_STEP,
        STEPS[5],
        STEPS[6],
        STEPS[7],
        STEPS[8],
        STEPS[9],
        STEPS[10],
        STEPS[11],
      ]
    }

    return STEPS
  }, [engagementMode])

  const safeStepIndex = Math.min(currentStepIndex, steps.length - 1)
  const isLastStep = safeStepIndex === steps.length - 1
  const CurrentStepComponent = steps[safeStepIndex].component
  
  const handleNext = async () => {
    // In a real app, we'd validate only the fields for the current step.
    // For now, we'll allow generic next and validate everything at the end.
    if (safeStepIndex < steps.length - 1) {
      setCurrentStepIndex(safeStepIndex + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }
  
  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(safeStepIndex - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }
  
  const submitForm = (data: FullRequirementsData) => {
    onSubmit(data)
  }

  const applySeed = (seedKey: keyof typeof TEST_SEEDS) => {
    reset({
      ...(defaultValues as z.input<typeof FullRequirementsSchema>),
      ...(TEST_SEEDS[seedKey] as z.input<typeof FullRequirementsSchema>),
    })
    setCurrentStepIndex(0)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Card className="w-full max-w-5xl mx-auto overflow-hidden border-border/50 bg-background/95 shadow-2xl">
      <div className="flex w-full h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${((safeStepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      <CardHeader className="border-b pb-5">
        <CardTitle className="text-2xl font-bold tracking-tight">Architecture Orchestration</CardTitle>
        <CardDescription>
          Step {safeStepIndex + 1} of {steps.length}: {steps[safeStepIndex].title}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(submitForm)} className="grid md:grid-cols-[260px_1fr]">
            <aside className="border-b md:border-b-0 md:border-r p-4 md:p-5 space-y-2 bg-muted/20">
              {steps.map((step, idx) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStepIndex(idx)}
                  disabled={isLoading}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left transition-colors",
                    idx === safeStepIndex
                      ? "border-primary bg-primary/10"
                      : "border-border/60 bg-background hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold",
                        idx < safeStepIndex
                          ? "border-primary bg-primary text-primary-foreground"
                          : idx === safeStepIndex
                            ? "border-primary text-primary"
                            : "border-border text-muted-foreground"
                      )}
                    >
                      {idx < safeStepIndex ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold leading-none">{step.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </aside>

            <section className="p-5 md:p-6 space-y-6">
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Testing Seeds</p>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => applySeed("founder_mvp")}>Load Founder MVP</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => applySeed("regulated_financial")}>Load Regulated Financial</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => applySeed("scale_ai")}>Load Scale + AI</Button>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Current Step</p>
                <p className="text-base font-semibold mt-1">{steps[safeStepIndex].title}</p>
                <p className="text-sm text-muted-foreground mt-1">{steps[safeStepIndex].description}</p>
              </div>

              <div className="min-h-100">
                <CurrentStepComponent />

                {isLastStep && Object.keys(errors).length > 0 && (
                  <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive text-sm">
                    <p className="font-semibold mb-2">Please fix the following validation errors:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {Object.entries(errors).map(([path, err]) => (
                        <li key={path}>{path}: {String(err?.message)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  disabled={safeStepIndex === 0 || isLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {isLastStep ? (
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating PRD...</>
                    ) : (
                      <><Zap className="w-4 h-4 mr-2" /> Generate Architecture</>
                    )}
                  </Button>
                ) : (
                  <Button type="button" onClick={handleNext}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </section>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}

function Zap(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}
