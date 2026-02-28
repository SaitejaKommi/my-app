import { FullRequirementsData } from "@/db/requirements-schema";
import { ProductRequirementsDoc } from "./pipeline-schemas";

export type TensionSeverity = "CRIT" | "WARN" | "INFO";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
export type ArchitectureArchetype = "monolith" | "modular_monolith" | "microservices";
export type ArchetypeSelectionMethod = "FORCED" | "SUGGESTED" | "DEFAULT";

export interface DeterministicTension {
  id: string;
  severity: TensionSeverity;
  title: string;
  description: string;
  deduction: number;
  mitigation: string;
}

export interface StabilityAnalysisResult {
  baseScore: 100;
  tensions: DeterministicTension[];
  amplificationDeductions: number;
  stabilityScore: number;
  riskLevel: RiskLevel;
}

export interface ArchetypeDecisionResult {
  selectedArchetype: ArchitectureArchetype;
  selectionMethod: ArchetypeSelectionMethod;
  forcedReasons: string[];
}

export interface QualityCheckFailure {
  checkId: string;
  description: string;
  fix: string;
}

export interface QualityGateResult {
  score: number;
  status:
    | "QUALITY_GATE_PASSED"
    | "QUALITY_GATE_FAILED_SOFT"
    | "QUALITY_GATE_FAILED_HARD"
    | "QUALITY_GATE_CONSISTENCY_FAILURE";
  failedChecks: QualityCheckFailure[];
}

export interface ArchitecturePressureResult {
  dimensionScores: {
    D1_domain_complexity: number;
    D2_data_complexity: number;
    D3_financial_integrity: number;
    D4_regulatory_pressure: number;
    D5_scale_load: number;
    D6_availability_resilience: number;
    D7_security_sensitivity: number;
    D8_integration_surface: number;
    D9_intelligence_processing: number;
    D10_evolution_horizon: number;
  };
  weightedScore: number;
}

export type ArchitecturePattern =
  | "simple_monolith"
  | "structured_monolith"
  | "modular_monolith"
  | "event_driven_architecture"
  | "distributed_service_boundaries";

export type ConflictSeverity = "Soft" | "Moderate" | "Severe" | "Blocking";

export interface ArchitectureConflict {
  id: string;
  severity: ConflictSeverity;
  message: string;
  recommendation: string;
}

export interface DerivedSignalsResult {
  complexityIndex: number;
  regulatoryBurdenIndex: number;
  financialIntegrityIndex: number;
  scalabilityPressureIndex: number;
  operationalRiskIndex: number;
}

const PRESSURE_WEIGHTS = {
  D1_domain_complexity: 1.2,
  D2_data_complexity: 1.5,
  D3_financial_integrity: 1.8,
  D4_regulatory_pressure: 2.0,
  D5_scale_load: 1.4,
  D6_availability_resilience: 1.3,
  D7_security_sensitivity: 1.5,
  D8_integration_surface: 1.0,
  D9_intelligence_processing: 1.0,
  D10_evolution_horizon: 1.2,
} as const;

const EXTERNAL_AI_PROVIDERS = new Set(["openai", "anthropic", "google_gemini"]);

const isAtMostSeed = (stage: FullRequirementsData["fundingStage"]) =>
  ["bootstrapped", "pre_seed", "seed"].includes(stage);

const isAtMostSeriesA = (stage: FullRequirementsData["fundingStage"]) =>
  ["bootstrapped", "pre_seed", "seed", "series_a"].includes(stage);

const isMidMarketOrHigher = (users: FullRequirementsData["usersAt12Months"]) =>
  ["10k_to_100k", "100k_to_1m", "over_1m"].includes(users);

const isLargeScale = (users: FullRequirementsData["usersAt12Months"]) =>
  ["100k_to_1m", "over_1m"].includes(users);

const addTension = (
  list: DeterministicTension[],
  tension: Omit<DeterministicTension, "deduction">,
) => {
  list.push({
    ...tension,
    deduction: tension.severity === "CRIT" ? 25 : tension.severity === "WARN" ? 10 : 0,
  });
};

const clamp10 = (value: number) => Math.max(0, Math.min(10, value));

export function runArchitecturePressureModel(input: FullRequirementsData): ArchitecturePressureResult {
  const complianceCount = input.complianceFrameworks.filter((item) => item !== "none").length;
  const dataClassificationCount = (input.dataClassification ?? []).length;
  const integrationCount = (input.integrationSurface ?? []).length;
  const advancedCapabilityCount = (input.advancedCapabilities ?? []).filter((item) => item !== "none").length;

  const domainBase =
    input.workflowComplexityLevel === "simple_crud"
      ? 2
      : input.workflowComplexityLevel === "multi_step_forms"
        ? 4
        : input.workflowComplexityLevel === "role_based_approval"
          ? 6
          : input.workflowComplexityLevel === "long_running_processes"
            ? 7
            : input.workflowComplexityLevel === "external_callbacks"
              ? 7
              : 5;
  const D1_domain_complexity = clamp10(domainBase + Math.min(3, (input.workflowCharacteristics ?? []).length / 2) + Math.min(2, (input.coreDomainObjectsList ?? []).length / 4));

  const dataShapeScore =
    input.dataStructureType === "strongly_relational"
      ? 7
      : input.dataStructureType === "hybrid"
        ? 8
        : input.dataStructureType === "time_series"
          ? 6
          : input.dataStructureType === "graph_relationships"
            ? 7
            : input.dataStructureType === "document_oriented"
              ? 5
              : 4;
  const consistencyScore =
    input.consistencyRequirement === "transactional_guarantees_required"
      ? 9
      : input.consistencyRequirement === "strong_consistency_required"
        ? 8
        : input.consistencyRequirement === "mixed_consistency"
          ? 6
          : 3;
  const dataVolumeScore =
    input.dataVolumeAt12Months === "over_10tb" || input.dataVolumeAt12Months === "1tb_to_10tb"
      ? 9
      : input.dataVolumeAt12Months === "100gb_to_1tb"
        ? 7
        : input.dataVolumeAt12Months === "10gb_to_100gb"
          ? 5
          : 3;
  const immutableRetention = input.retentionPolicy === "immutable_record_storage_required" ? 1.5 : 0;
  const D2_data_complexity = clamp10((dataShapeScore + consistencyScore + dataVolumeScore) / 3 + immutableRetention);

  const D3_financial_integrity = clamp10(
    (input.hasFinancialLogic ? 4 : 0) +
      (input.financialTransactionModel === "ledger_based_accounting" ? 3 : 0) +
      (input.financialTransactionModel === "multi_party_settlement" ? 2 : 0) +
      (input.financialAuditRequirement === "double_entry_accounting_required" ? 3 : 0) +
      (input.financialAuditRequirement === "immutable_audit_logs_required" ? 2 : 0)
  );

  const D4_regulatory_pressure = clamp10(complianceCount * 2 + (input.complianceCertificationWithin12Months ? 1.5 : 0));

  const growthScore =
    input.usersAt36Months === "over_1m" || input.usersAt12Months === "over_1m"
      ? 9
      : input.usersAt36Months === "100k_to_1m" || input.usersAt12Months === "100k_to_1m"
        ? 7
        : input.usersAt12Months === "10k_to_100k"
          ? 5
          : 3;
  const concurrencyScore =
    input.peakConcurrentUsers === "over_50k"
      ? 10
      : input.peakConcurrentUsers === "5k_to_50k"
        ? 8
        : input.peakConcurrentUsers === "500_to_5k"
          ? 6
          : 4;
  const trafficScore =
    input.trafficProfile === "viral_unpredictable"
      ? 9
      : input.trafficProfile === "always_on_high_concurrency"
        ? 8
        : input.trafficProfile === "seasonal_spikes"
          ? 6
          : 4;
  const D5_scale_load = clamp10((growthScore + concurrencyScore + trafficScore) / 3);

  const availabilityScore =
    input.availabilityTarget === "99_999"
      ? 10
      : input.availabilityTarget === "99_99"
        ? 9
        : input.availabilityTarget === "99_9"
          ? 7
          : input.availabilityTarget === "99"
            ? 5
            : 3;
  const rtoScore = input.rto === "under_15min" ? 3 : input.rto === "15min_to_1hr" ? 2 : input.rto === "1hr_to_4hr" ? 1 : 0;
  const rpoScore = input.rpo === "zero" ? 3 : input.rpo === "under_5min" ? 2 : input.rpo === "under_1hr" ? 1 : 0;
  const D6_availability_resilience = clamp10(availabilityScore + rtoScore + rpoScore);

  const sensitiveDataBoost = Math.min(4, dataClassificationCount / 2);
  const threatBoost = Math.min(3, (input.threatProfiles ?? []).length / 2);
  const D7_security_sensitivity = clamp10(
    2 +
      sensitiveDataBoost +
      threatBoost +
      (input.fieldLevelEncryptionRequired ? 1.5 : 0) +
      (input.auditImmutabilityRequired ? 1 : 0)
  );

  const apiExposureBoost = input.apiExposureModel === "public_api" || input.apiExposureModel === "sdk_required" ? 2 : input.apiExposureModel === "partner_api" ? 1 : 0;
  const D8_integration_surface = clamp10(2 + Math.min(6, integrationCount / 1.5) + apiExposureBoost);

  const intelligenceBase = input.requiresAI ? 4 : 1;
  const processingBoost = Math.min(3, (input.processingModels ?? []).length / 2);
  const D9_intelligence_processing = clamp10(intelligenceBase + Math.min(4, advancedCapabilityCount / 1.5) + processingBoost);

  const lifespanScore =
    input.intendedSystemLifespan === "enterprise_grade_system"
      ? 9
      : input.intendedSystemLifespan === "long_term_scalable_platform"
        ? 7
        : input.intendedSystemLifespan === "mvp_1_to_2_years"
          ? 4
          : 2;
  const stageBoost = ["scaling", "migrating", "rebuilding"].includes(input.projectStage) ? 2 : 0;
  const D10_evolution_horizon = clamp10(lifespanScore + stageBoost);

  const weightedRaw =
    D1_domain_complexity * PRESSURE_WEIGHTS.D1_domain_complexity +
    D2_data_complexity * PRESSURE_WEIGHTS.D2_data_complexity +
    D3_financial_integrity * PRESSURE_WEIGHTS.D3_financial_integrity +
    D4_regulatory_pressure * PRESSURE_WEIGHTS.D4_regulatory_pressure +
    D5_scale_load * PRESSURE_WEIGHTS.D5_scale_load +
    D6_availability_resilience * PRESSURE_WEIGHTS.D6_availability_resilience +
    D7_security_sensitivity * PRESSURE_WEIGHTS.D7_security_sensitivity +
    D8_integration_surface * PRESSURE_WEIGHTS.D8_integration_surface +
    D9_intelligence_processing * PRESSURE_WEIGHTS.D9_intelligence_processing +
    D10_evolution_horizon * PRESSURE_WEIGHTS.D10_evolution_horizon;

  const maxRaw = 10 * Object.values(PRESSURE_WEIGHTS).reduce((sum, value) => sum + value, 0);
  const weightedScore = Math.round((weightedRaw / maxRaw) * 100);

  return {
    dimensionScores: {
      D1_domain_complexity,
      D2_data_complexity,
      D3_financial_integrity,
      D4_regulatory_pressure,
      D5_scale_load,
      D6_availability_resilience,
      D7_security_sensitivity,
      D8_integration_surface,
      D9_intelligence_processing,
      D10_evolution_horizon,
    },
    weightedScore,
  };
}

export function deriveArchitecturePattern(pressureScore: number): ArchitecturePattern {
  if (pressureScore <= 20) return "simple_monolith";
  if (pressureScore <= 40) return "structured_monolith";
  if (pressureScore <= 60) return "modular_monolith";
  if (pressureScore <= 80) return "event_driven_architecture";
  return "distributed_service_boundaries";
}

export function detectArchitectureConflicts(input: FullRequirementsData): ArchitectureConflict[] {
  const conflicts: ArchitectureConflict[] = [];

  const hasRegulatoryLedgerPressure =
    input.hasFinancialLogic &&
    (input.financialTransactionModel === "ledger_based_accounting" ||
      input.financialAuditRequirement === "double_entry_accounting_required");

  const hasRelationalPressure =
    input.dataStructureType === "strongly_relational" ||
    input.consistencyRequirement === "strong_consistency_required" ||
    input.consistencyRequirement === "transactional_guarantees_required" ||
    ["role_based_approval", "long_running_processes"].includes(input.workflowComplexityLevel ?? "");

  if (
    input.primaryDatabase === "mongodb" &&
    hasRelationalPressure &&
    input.hasFinancialLogic
  ) {
    conflicts.push({
      id: "C-DB-REL-001",
      severity: hasRegulatoryLedgerPressure ? "Blocking" : "Severe",
      message:
        "MongoDB selection conflicts with strong relational + financial integrity requirements.",
      recommendation:
        "Switch to PostgreSQL-compatible architecture for ACID transactions and reconciliation safety.",
    });
  }

  if (
    input.consistencyRequirement === "eventual_consistency_acceptable" &&
    hasRegulatoryLedgerPressure
  ) {
    conflicts.push({
      id: "C-CONS-LEDGER-001",
      severity: "Blocking",
      message:
        "Eventual consistency conflicts with regulatory ledger/double-entry integrity requirements.",
      recommendation:
        "Use strong consistency with transactional guarantees for ledger writes and reconciliation paths.",
    });
  }

  if (
    input.apiVersioningStrategy === "no_versioning" &&
    (input.hasFinancialLogic || input.complianceFrameworks.some((item) => item !== "none"))
  ) {
    conflicts.push({
      id: "C-API-GOV-001",
      severity: "Moderate",
      message:
        "No API versioning is risky under financial/compliance pressure.",
      recommendation:
        "Adopt URL or header API versioning to preserve contract governance.",
    });
  }

  if (
    ["5k_to_50k", "over_50k"].includes(input.peakConcurrentUsers) &&
    !input.cacheLayerRequired
  ) {
    conflicts.push({
      id: "C-SCALE-CACHE-001",
      severity: "Moderate",
      message:
        "High concurrency selected without cache layer.",
      recommendation:
        "Enable cache for hot queries, session lookups, and rate-limit counters.",
    });
  }

  if (
    ["99_99", "99_999"].includes(input.availabilityTarget ?? "") &&
    ["under_50", "50_to_200"].includes(input.monthlyInfrastructureBudget)
  ) {
    conflicts.push({
      id: "C-SLA-BUD-001",
      severity: "Severe",
      message:
        "Very high SLA target conflicts with low infrastructure budget.",
      recommendation:
        "Increase budget or lower SLA target to avoid chronic reliability debt.",
    });
  }

  if (
    (input.complianceFrameworks.includes("hipaa") || input.complianceFrameworks.includes("fedramp")) &&
    input.aiModelStrategy === "external_api" &&
    input.aiDataCanLeaveRegion
  ) {
    conflicts.push({
      id: "C-COMP-AI-001",
      severity: "Severe",
      message:
        "Regulated workload with external AI + data egress risk detected.",
      recommendation:
        "Use private/hybrid model path with strict regional controls and auditability.",
    });
  }

  if (
    input.backwardCompatibilityRequired &&
    input.apiVersioningStrategy === "no_versioning"
  ) {
    conflicts.push({
      id: "C-MIG-API-001",
      severity: "Severe",
      message:
        "Backward compatibility requirement conflicts with no API versioning strategy.",
      recommendation:
        "Introduce explicit API versioning and deprecation windows.",
    });
  }

  if (
    input.migrationRequired &&
    (input.teamMaturityLevel === "solo_founder" || input.teamMaturityLevel === "small_early_stage_team")
  ) {
    conflicts.push({
      id: "C-MIG-TEAM-001",
      severity: "Moderate",
      message:
        "Migration pressure with limited team maturity increases delivery and rollback risk.",
      recommendation:
        "Plan phased migration with dual-write/backfill strategy and explicit rollback checkpoints.",
    });
  }

  if (
    input.costSensitivityIndex === "cost_first" &&
    ["99_99", "99_999"].includes(input.availabilityTarget ?? "")
  ) {
    conflicts.push({
      id: "C-COST-SLA-001",
      severity: "Moderate",
      message:
        "Cost-first priority conflicts with very high availability objective.",
      recommendation:
        "Prioritize SLO tiers by user impact and reserve HA spending for critical paths.",
    });
  }

  return conflicts;
}

export function deriveSignals(
  input: FullRequirementsData,
  pressure: ArchitecturePressureResult,
  stability: StabilityAnalysisResult,
  conflicts: ArchitectureConflict[],
): DerivedSignalsResult {
  const conflictPenalty = conflicts.reduce((sum, conflict) => {
    if (conflict.severity === "Blocking") return sum + 18;
    if (conflict.severity === "Severe") return sum + 10;
    if (conflict.severity === "Moderate") return sum + 5;
    return sum + 2;
  }, 0);

  const capabilityPenalty =
    (input.teamMaturityLevel === "solo_founder" ? 10 : input.teamMaturityLevel === "small_early_stage_team" ? 6 : 0) +
    (input.teamSeniorityLevel === "mostly_juniors" ? 8 : 0) +
    (input.devOpsMaturityLevel === "minimal_manual" ? 8 : input.devOpsMaturityLevel === "basic_ci_cd" ? 4 : 0) +
    (input.securityExpertiseLevel === "none" ? 8 : input.securityExpertiseLevel === "part_time" ? 4 : 0);

  const complexityIndex = clamp10(
    (pressure.dimensionScores.D1_domain_complexity +
      pressure.dimensionScores.D2_data_complexity +
      pressure.dimensionScores.D8_integration_surface +
      pressure.dimensionScores.D9_intelligence_processing +
      pressure.dimensionScores.D10_evolution_horizon) /
      5 +
      capabilityPenalty / 10
  ) * 10;

  const regulatoryBurdenIndex = clamp10(
    pressure.dimensionScores.D4_regulatory_pressure +
      (input.complianceCertificationWithin12Months ? 1 : 0) +
      (input.dataResidencyConstraint === "country_level_isolation" || input.dataResidencyConstraint === "multi_region_isolation_required" ? 1 : 0)
  ) * 10;

  const financialIntegrityIndex = clamp10(
    pressure.dimensionScores.D3_financial_integrity +
      (input.financialAuditRequirement === "double_entry_accounting_required" ? 1 : 0) +
      (input.consistencyRequirement === "eventual_consistency_acceptable" && input.hasFinancialLogic ? 2 : 0)
  ) * 10;

  const scalabilityPressureIndex = clamp10(
    pressure.dimensionScores.D5_scale_load +
      (input.legacyIntegrationRequired ? 0.5 : 0) +
      (input.migrationRequired ? 0.5 : 0)
  ) * 10;

  const operationalRiskIndex = clamp10(
    (100 - stability.stabilityScore) / 10 +
      pressure.dimensionScores.D6_availability_resilience / 3 +
      conflictPenalty / 20 +
      capabilityPenalty / 8 +
      (!input.gracefulDegradationRequired ? 1 : 0) +
      (!input.readOnlyModeAcceptable ? 0.5 : 0) +
      (!input.backgroundJobsCanDelay ? 0.5 : 0) +
      (!input.analyticsCanLag ? 0.5 : 0)
  ) * 10;

  return {
    complexityIndex: Math.round(complexityIndex),
    regulatoryBurdenIndex: Math.round(regulatoryBurdenIndex),
    financialIntegrityIndex: Math.round(financialIntegrityIndex),
    scalabilityPressureIndex: Math.round(scalabilityPressureIndex),
    operationalRiskIndex: Math.round(operationalRiskIndex),
  };
}

export function runStabilityAnalysis(input: FullRequirementsData): StabilityAnalysisResult {
  const tensions: DeterministicTension[] = [];
  const aiProviders = input.aiProvider ?? [];
  const aiFeatures = input.aiFeatures ?? [];

  if (input.fundingStage === "bootstrapped" && input.usersAt12Months === "over_1m") {
    addTension(tensions, {
      id: "T-BS-002",
      severity: "WARN",
      title: "Bootstrap vs scale mismatch",
      description: "Bootstrapped funding with 1M+ users in 12 months is operationally high risk.",
      mitigation: "Reduce launch scope or increase budget before scale milestones.",
    });
  }

  if (input.fundingStage === "bootstrapped" && ["under_50", "50_to_200"].includes(input.monthlyInfrastructureBudget)) {
    addTension(tensions, {
      id: "T-BS-004",
      severity: "WARN",
      title: "Low infra budget pressure",
      description: "Very low infrastructure budget constrains reliability and managed service choices.",
      mitigation: "Prioritize managed essentials and postpone non-critical capabilities.",
    });
  }

  if (input.fundingStage === "bootstrapped" && input.acceptableDowntimePerMonth === "under_5min") {
    addTension(tensions, {
      id: "T-BS-005",
      severity: "CRIT",
      title: "SLA exceeds bootstrap capacity",
      description: "99.99% uptime target is typically incompatible with bootstrap operations.",
      mitigation: "Relax SLA or fund HA multi-region operations.",
    });
  }

  if (input.requiresRealTime && input.mvpTimelineDays <= 14) {
    addTension(tensions, {
      id: "T-TC-003",
      severity: "CRIT",
      title: "Realtime under compressed timeline",
      description: "Realtime infrastructure inside a 14-day window is unlikely to be production ready.",
      mitigation: "Reduce realtime scope or extend MVP timeline.",
    });
  }

  if (input.devTeamSize === "solo" && input.mvpTimelineDays <= 30 && isMidMarketOrHigher(input.usersAt12Months)) {
    addTension(tensions, {
      id: "T-TC-005",
      severity: "CRIT",
      title: "Solo capacity overload",
      description: "Solo team + short timeline + mid-market scale is unstable.",
      mitigation: "Reduce scope or add engineering capacity.",
    });
  }

  if (input.complianceFrameworks.includes("hipaa") && input.fundingStage === "bootstrapped") {
    addTension(tensions, {
      id: "T-CB-001",
      severity: "CRIT",
      title: "HIPAA on bootstrap",
      description: "HIPAA control and audit obligations are expensive for bootstrap operations.",
      mitigation: "Increase budget and compliance staffing before launch.",
    });
  }

  if (input.complianceFrameworks.includes("soc2_type2") && input.fundingStage === "bootstrapped") {
    addTension(tensions, {
      id: "T-CB-002",
      severity: "CRIT",
      title: "SOC2 Type II on bootstrap",
      description: "SOC2 Type II continuous evidence and audit costs are usually incompatible with bootstrap.",
      mitigation: "Stage compliance effort or secure additional funding.",
    });
  }

  if (input.complianceFrameworks.includes("gdpr") && input.fundingStage === "bootstrapped") {
    addTension(tensions, {
      id: "T-CB-003",
      severity: "WARN",
      title: "GDPR operational load",
      description: "GDPR can be done on bootstrap, but requires disciplined data workflows.",
      mitigation: "Implement DSR workflows and retention controls early.",
    });
  }

  if (input.complianceFrameworks.includes("pci_dss") && isAtMostSeed(input.fundingStage)) {
    addTension(tensions, {
      id: "T-CB-004",
      severity: "CRIT",
      title: "PCI-DSS funding mismatch",
      description: "PCI-DSS obligations are heavy for pre-seed/seed budgets.",
      mitigation: "Use tokenized third-party payment handling and defer direct card scope.",
    });
  }

  if (input.complianceFrameworks.includes("fedramp") && isAtMostSeriesA(input.fundingStage)) {
    addTension(tensions, {
      id: "T-CB-005",
      severity: "CRIT",
      title: "FedRAMP readiness mismatch",
      description: "FedRAMP authorization typically exceeds early-stage budget and timeline.",
      mitigation: "Target non-FedRAMP segment first or secure enterprise/government funding.",
    });
  }

  if (input.openTelemetryRequired && input.devTeamSize === "solo") {
    addTension(tensions, {
      id: "T-AT-004",
      severity: "INFO",
      title: "Observability setup overhead",
      description: "Full OpenTelemetry instrumentation is significant for a solo team.",
      mitigation: "Start with critical traces and expand iteratively.",
    });
  }

  if (input.targetApiP95 === "under_100ms" && !input.cacheLayerRequired) {
    addTension(tensions, {
      id: "T-PI-001",
      severity: "WARN",
      title: "Aggressive API latency without cache",
      description: "Sub-100ms p95 without caching can become fragile under load.",
      mitigation: "Enable cache layer for hot paths and rate limits.",
    });
  }

  if (input.coldStartTolerance === "zero" && input.deploymentPlatform === "vercel") {
    addTension(tensions, {
      id: "T-PI-003",
      severity: "CRIT",
      title: "Zero cold-start on serverless",
      description: "Zero cold-start tolerance conflicts with serverless behavior.",
      mitigation: "Use always-on compute or relax cold-start requirement.",
    });
  }

  if (input.targetFCP === "under_1s" && input.renderingStrategy === "csr") {
    addTension(tensions, {
      id: "T-PI-004",
      severity: "WARN",
      title: "FCP target vs CSR",
      description: "Sub-1s FCP is difficult with CSR-only rendering.",
      mitigation: "Use SSR/SSG/ISR on critical routes.",
    });
  }

  if (["1k_to_10k", "over_10k"].includes(input.peakRPS) && input.connectionPooling === "none") {
    addTension(tensions, {
      id: "T-PI-005",
      severity: "CRIT",
      title: "Missing DB pooling at high RPS",
      description: "High RPS without connection pooling can exhaust DB connections.",
      mitigation: "Enable PgBouncer or managed pooler.",
    });
  }

  if (input.requiresRealTime && input.realTimeScale === "over_10k_concurrent" && input.realTimeProtocol === "polling") {
    addTension(tensions, {
      id: "T-RT-001",
      severity: "CRIT",
      title: "Polling at extreme realtime scale",
      description: "Polling at 10k+ concurrent users creates unsustainable server load.",
      mitigation: "Switch to WebSocket/SSE with pub/sub.",
    });
  }

  if (input.requiresRealTime && input.realTimeDeliveryGuarantee === "exactly_once" && input.realTimeProtocol === "server_sent_events") {
    addTension(tensions, {
      id: "T-RT-002",
      severity: "WARN",
      title: "Exactly-once with SSE",
      description: "SSE requires deduplication to emulate exactly-once delivery.",
      mitigation: "Add message IDs and consumer-side dedupe guarantees.",
    });
  }

  if (input.requiresRealTime && input.deploymentPlatform === "vercel" && input.realTimeProtocol === "websockets") {
    addTension(tensions, {
      id: "T-RT-003",
      severity: "WARN",
      title: "WebSocket on serverless constraints",
      description: "Persistent WebSocket connections are constrained on serverless platforms.",
      mitigation: "Use dedicated realtime provider/service.",
    });
  }

  if (input.requiresAI && input.complianceFrameworks.includes("hipaa") && aiProviders.some((p) => p === "openai" || p === "anthropic")) {
    addTension(tensions, {
      id: "T-AC-001",
      severity: "CRIT",
      title: "HIPAA with external AI provider",
      description: "HIPAA workloads may require strict provider agreements and controls.",
      mitigation: "Use HIPAA-eligible deployment path and signed BAA.",
    });
  }

  if (input.requiresAI && input.aiDataPrivacy === "no_external_ai" && aiProviders.some((provider) => EXTERNAL_AI_PROVIDERS.has(provider))) {
    addTension(tensions, {
      id: "T-AC-002",
      severity: "CRIT",
      title: "AI privacy contradiction",
      description: "no_external_ai conflicts with selected external AI providers.",
      mitigation: "Use self-hosted provider or update privacy requirement.",
    });
  }

  if (input.requiresAI && input.aiMonthlyCostCeiling === "under_100" && aiFeatures.includes("text_generation")) {
    addTension(tensions, {
      id: "T-AC-003",
      severity: "WARN",
      title: "AI budget underestimation",
      description: "Meaningful text generation usage often exceeds $100/month.",
      mitigation: "Add caching/quotas or increase AI budget tier.",
    });
  }

  let amplificationDeductions = 0;
  const criticalCount = tensions.filter((t) => t.severity === "CRIT").length;
  if (criticalCount >= 3) amplificationDeductions += 10;
  if (input.fundingStage === "bootstrapped" && input.mvpTimelineDays <= 60 && isMidMarketOrHigher(input.usersAt12Months)) amplificationDeductions += 15;
  if (input.complianceFrameworks.length >= 3 && isAtMostSeed(input.fundingStage)) amplificationDeductions += 10;
  if (input.devTeamSize === "solo" && (input.requiresRealTime || (input.requiresAI && input.aiDataPrivacy === "no_external_ai"))) amplificationDeductions += 10;

  const directDeductions = tensions.reduce((sum, item) => sum + item.deduction, 0);
  const stabilityScore = Math.max(0, 100 - directDeductions - amplificationDeductions);

  let riskLevel: RiskLevel = "Low";
  if (stabilityScore < 25) riskLevel = "Critical";
  else if (stabilityScore < 50) riskLevel = "High";
  else if (stabilityScore < 75) riskLevel = "Medium";

  return {
    baseScore: 100,
    tensions,
    amplificationDeductions,
    stabilityScore,
    riskLevel,
  };
}

export function selectArchetype(input: FullRequirementsData, stability: StabilityAnalysisResult): ArchetypeDecisionResult {
  if (stability.stabilityScore < 50) {
    return {
      selectedArchetype: "monolith",
      selectionMethod: "FORCED",
      forcedReasons: ["stabilityScore < 50"],
    };
  }

  if (
    input.devTeamSize === "solo" ||
    input.devTeamSize === "small" ||
    input.teamMaturityLevel === "solo_founder" ||
    input.teamMaturityLevel === "small_early_stage_team"
  ) {
    return {
      selectedArchetype: "monolith",
      selectionMethod: "FORCED",
      forcedReasons: ["solo/small team favors low operational complexity"],
    };
  }

  if (
    input.teamSeniorityLevel === "mostly_juniors" ||
    input.devOpsMaturityLevel === "minimal_manual"
  ) {
    return {
      selectedArchetype: "monolith",
      selectionMethod: "FORCED",
      forcedReasons: ["team capability maturity indicates reduced allowable architectural complexity"],
    };
  }

  if (input.mvpTimelineDays <= 60) {
    return {
      selectedArchetype: "monolith",
      selectionMethod: "FORCED",
      forcedReasons: ["tight timeline (<= 60 days)"],
    };
  }

  if (
    input.devTeamSize === "enterprise" &&
    ["series_b", "series_c_plus", "enterprise_budget", "government"].includes(input.fundingStage) &&
    isLargeScale(input.usersAt12Months) &&
    input.mvpTimelineDays >= 365
  ) {
    return {
      selectedArchetype: "microservices",
      selectionMethod: "SUGGESTED",
      forcedReasons: [],
    };
  }

  return {
    selectedArchetype: "modular_monolith",
    selectionMethod: "DEFAULT",
    forcedReasons: [],
  };
}

export function runQualityGate(
  prd: ProductRequirementsDoc,
  input: FullRequirementsData,
  stability: StabilityAnalysisResult,
  archetype: ArchetypeDecisionResult,
): QualityGateResult {
  let score = 100;
  const failedChecks: QualityCheckFailure[] = [];

  const fail = (checkId: string, description: string, fix: string) => {
    failedChecks.push({ checkId, description, fix });
    score -= 3;
  };

  if (prd.personas.length === 0) {
    fail("CC-001", "PRD has no personas.", "Add at least one concrete persona.");
  }

  if (prd.features.length === 0) {
    fail("CC-002", "PRD has no feature inventory.", "Generate complete feature list with priorities.");
  }

  const hasP0 = prd.features.some((f) => (f.priority ?? "P1") === "P0");
  if (!hasP0) {
    fail("CC-003", "PRD has no P0 MVP features.", "Mark launch-critical features as P0.");
  }

  if (prd.acceptance_criteria.length === 0) {
    fail("CC-004", "PRD has no acceptance criteria.", "Add GIVEN/WHEN/THEN acceptance criteria.");
  }

  if (input.complianceFrameworks.length > 0 && input.complianceFrameworks[0] !== "none" && prd.non_functional_requirements.length === 0) {
    fail("CC-006", "Compliance declared but NFR section is empty.", "Add compliance NFR controls and audits.");
  }

  if (input.requiresRealTime && !prd.non_functional_requirements.some((item) => item.toLowerCase().includes("concurrent") || item.toLowerCase().includes("real-time"))) {
    fail("CC-013", "Realtime declared but scalability NFR lacks concurrent connection handling.", "Add realtime connection/concurrency NFR.");
  }

  if (input.requiresBackgroundJobs && !prd.non_functional_requirements.some((item) => item.toLowerCase().includes("queue") || item.toLowerCase().includes("retry"))) {
    fail("CC-014", "Background jobs declared but queue/retry requirements are missing.", "Add queue provider and retry semantics to NFR.");
  }

  if (input.readReplicaRequired && !prd.non_functional_requirements.some((item) => item.toLowerCase().includes("read replica") || item.toLowerCase().includes("replica"))) {
    fail("CC-015", "Read replica required but not represented in NFR.", "Add read-replica topology requirement.");
  }

  if (archetype.selectionMethod === "FORCED" && stability.stabilityScore >= 75) {
    fail("CC-011", "Forced archetype with high stability should be justified.", "Add explicit ADR rationale or relax forced rule.");
  }

  if (score < 0) score = 0;

  let status: QualityGateResult["status"] = "QUALITY_GATE_PASSED";
  if (failedChecks.length >= 3) status = "QUALITY_GATE_CONSISTENCY_FAILURE";
  else if (score < 70) status = "QUALITY_GATE_FAILED_HARD";
  else if (score < 85) status = "QUALITY_GATE_FAILED_SOFT";

  return {
    score,
    status,
    failedChecks,
  };
}
