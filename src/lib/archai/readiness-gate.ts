import { FullRequirementsData } from "@/db/requirements-schema";

export const ENGINE_VERSION = "1.0.0";
export const MIN_SUPPORTED_INTAKE_VERSION = "1.0.0";

export type ReadinessSeverity = "critical" | "warning";

export interface ReadinessIssue {
  checkId: string;
  severity: ReadinessSeverity;
  field: string;
  message: string;
  question: string;
}

export interface ReadinessResult {
  passed: boolean;
  score: number;
  issues: ReadinessIssue[];
  checks: {
    check001_status: boolean;
    check002_required: boolean;
    check003_enum: boolean;
    check004_dependency: boolean;
    check005_ambiguity: boolean;
    check006_version: boolean;
  };
}

const VAGUE_TERMS = /\b(standard|normal|typical|as needed|fast|quick|good|many|lots|enterprise scale)\b/i;

const parseSemver = (value: string): [number, number, number] => {
  const [major = "0", minor = "0", patch = "0"] = value.split(".");
  return [Number(major) || 0, Number(minor) || 0, Number(patch) || 0];
};

const isVersionAtLeast = (value: string, minimum: string) => {
  const a = parseSemver(value);
  const b = parseSemver(minimum);
  if (a[0] !== b[0]) return a[0] > b[0];
  if (a[1] !== b[1]) return a[1] > b[1];
  return a[2] >= b[2];
};

const nonEmpty = (text?: string) => !!text && text.trim().length > 0;

export function runReadinessGate(input: FullRequirementsData): ReadinessResult {
  const issues: ReadinessIssue[] = [];

  const check001_status = ["SUBMITTED", "APPROVED"].includes(input.intakeStatus ?? "");
  if (!check001_status) {
    issues.push({
      checkId: "CHECK-001",
      severity: "critical",
      field: "intakeStatus",
      message: `Intake status is ${input.intakeStatus}. Submit intake first (SUBMITTED or APPROVED required).`,
      question: "Set intake status to SUBMITTED after completing required fields.",
    });
  }

  let check006_version = true;
  if (!isVersionAtLeast(input.intakeSchemaVersion ?? "0.0.0", MIN_SUPPORTED_INTAKE_VERSION)) {
    check006_version = false;
    issues.push({
      checkId: "CHECK-006",
      severity: "critical",
      field: "intakeSchemaVersion",
      message: `Intake schema version ${input.intakeSchemaVersion ?? "unknown"} is not supported. Minimum: ${MIN_SUPPORTED_INTAKE_VERSION}.`,
      question: `Please confirm intake schema version ${MIN_SUPPORTED_INTAKE_VERSION} or above.`,
    });
  }

  const requiredTextFields: Array<{ field: keyof FullRequirementsData; label: string }> = [
    { field: "projectName", label: "Project name" },
    { field: "problemStatement", label: "Problem statement" },
    { field: "solutionSummary", label: "Solution summary" },
  ];

  requiredTextFields.forEach(({ field, label }) => {
    const value = input[field];
    if (typeof value !== "string" || !nonEmpty(value)) {
      issues.push({
        checkId: "CHECK-002",
        severity: "critical",
        field: String(field),
        message: `${label} is required and cannot be empty.`,
        question: `Please provide a concrete ${label.toLowerCase()}.`,
      });
    }
  });

  const check002_required = !issues.some((issue) => issue.checkId === "CHECK-002");

  let check005_ambiguity = true;
  if (VAGUE_TERMS.test(input.problemStatement) || VAGUE_TERMS.test(input.solutionSummary)) {
    check005_ambiguity = false;
    issues.push({
      checkId: "CHECK-005",
      severity: "critical",
      field: "problemStatement",
      message: "Problem/solution statement includes vague terms and cannot be used for deterministic PRD generation.",
      question: "Rewrite problem and solution statements with specific measurable details (users, workflows, constraints).",
    });
  }

  let check004_dependency = true;
  if (input.requiresRealTime && !input.realTimeProtocol) {
    check004_dependency = false;
    issues.push({
      checkId: "CHECK-004",
      severity: "critical",
      field: "realTimeProtocol",
      message: "realTimeProtocol is required when requiresRealTime is true.",
      question: "Which real-time protocol is required (websockets, server_sent_events, polling, long_polling, webrtc)?",
    });
  }

  if (input.requiresBackgroundJobs && !input.jobQueuePreference) {
    issues.push({
      checkId: "CHECK-004",
      severity: "warning",
      field: "jobQueuePreference",
      message: "Background jobs enabled without explicit queue preference.",
      question: "Select queue preference (inngest, pg_boss, bull_redis, temporal, trigger_dev, aws_sqs, vercel_cron).",
    });
  }

  if (input.hasFinancialLogic && input.consistencyRequirement === "eventual_consistency_acceptable") {
    check004_dependency = false;
    issues.push({
      checkId: "CHECK-004",
      severity: "critical",
      field: "consistencyRequirement",
      message: "Financial logic conflicts with eventual consistency.",
      question: "For financial logic, confirm consistency model (strong_consistency_required or transactional_guarantees_required).",
    });
  }

  const check003_enum = true;

  const score = Math.max(
    0,
    100 -
      issues.reduce((total, issue) => total + (issue.severity === "critical" ? 20 : 8), 0)
  );

  return {
    passed: !issues.some((issue) => issue.severity === "critical"),
    score,
    issues,
    checks: {
      check001_status,
      check002_required,
      check003_enum,
      check004_dependency,
      check005_ambiguity,
      check006_version,
    },
  };
}
