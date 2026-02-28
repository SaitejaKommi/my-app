import { z } from "zod";

export const BlueprintSchema = z.object({
  startupSummary: z.string(),
  
  // Interactive State
  clarification: z.object({
    status: z.enum(["pending", "resolved"]),
    questions: z.array(z.object({
      id: z.string(),
      label: z.string(),
      type: z.enum(["text", "choice", "boolean"]),
      options: z.array(z.string()).optional(),
      answer: z.string().optional()
    }))
  }).optional(),
  
  // STEP 3: Product Spec (PRD)
  productSpec: z.object({
    personas: z.array(z.string()),
    coreJourneys: z.array(z.string()),
    nonGoals: z.array(z.string()),
    successCriteria: z.array(z.string()),
  }),

  // STEP 4: Architecture Decision
  recommendedStack: z.object({
    frontend: z.string(),
    backend: z.string(),
    database: z.string(),
    infra: z.string(),
  }),
  services: z.array(z.object({
    name: z.string(),
    responsibility: z.string(),
  })),

  // DOMAIN 4: Engineering Planning
  engineeringSpec: z.object({
    folderStructure: z.array(z.string()),
    keyDependencies: z.array(z.string()),
    envVariables: z.array(z.string()),
    // API Contracts
    apiContracts: z.array(z.object({
      endpoint: z.string(),
      method: z.enum(["GET", "POST", "PUT", "DELETE"]),
      description: z.string(),
      payload: z.string().optional(),
      response: z.string(),
    })),
    // Database Schema
    databaseSchema: z.array(z.object({
      table: z.string(),
      columns: z.array(z.string()),
      indexes: z.array(z.string()).optional(),
    })),
  }),

  // DOMAIN 6: QA & Analysis
  qaReport: z.object({
    score: z.number(),
    securityAudit: z.array(z.string()),
    performanceAudit: z.array(z.string()),
    technicalDebt: z.array(z.string()),
  }),

  // DOMAIN 8: Performance Load Tuning
  performanceReport: z.object({
    maxUsers: z.number(),
    bottleneck: z.string(),
    latencyP99: z.string(),
    recommendations: z.array(z.string()),
  }),

  // DOMAIN 7: Ship (Deployment)
  shipSpec: z.object({
    deploymentStrategy: z.string(),
    ciPipeline: z.string(),
    infraManifest: z.string(),
    environmentConfigs: z.array(z.string()),
  }),

  // DOMAIN 9: Handoff & Documentation
  handoffSpec: z.object({
    readinessScore: z.number(),
    handoffPackageUrl: z.string(),
    nextSteps: z.array(z.string()),
    documentationLinks: z.array(z.object({
      title: z.string(),
      url: z.string(),
    })),
  }),

  // ORCHESTRATION TRACE (Option B: Surface Execution Graph)
  executionAudit: z.object({
    history: z.array(z.object({
      id: z.string(),
      stage: z.string(),
      status: z.enum(["pending", "running", "passed", "repaired", "failed"]),
      attempts: z.number(),
      details: z.string(),
      timestamp: z.string(),
      durationMs: z.number().optional(),
      repairs: z.array(z.string()).optional(),
    })),
    totalRepairs: z.number(),
    totalDurationMs: z.number(),
    orchestratorVersion: z.string(),
  }),

  scalingPlan: z.array(z.object({
    stage: z.string(),
    strategy: z.string(),
  })),
  qualityReport: z.object({
    completenessScore: z.number(),
    consistencyDeduction: z.number(),
    finalScore: z.number(),
    status: z.enum([
      "QUALITY_GATE_PASSED",
      "QUALITY_GATE_FAILED_SOFT",
      "QUALITY_GATE_FAILED_HARD",
      "QUALITY_GATE_CONSISTENCY_FAILURE",
      "READINESS_BLOCKED",
    ]),
    failedSections: z.array(z.object({
      sectionId: z.string(),
      pointsLost: z.number(),
      remediationInstruction: z.string(),
    })).optional(),
    failedChecks: z.array(z.object({
      checkId: z.string(),
      description: z.string(),
      fix: z.string(),
    })).optional(),
  }).optional(),
  governance: z.object({
    prdRunId: z.string(),
    prdVersion: z.string(),
    prdStatus: z.enum([
      "DRAFT",
      "REVISION_REQUIRED",
      "UNDER_REVIEW",
      "APPROVED",
      "FROZEN",
      "MANUAL_REVIEW_REQUIRED",
    ]),
    qualityPassed: z.boolean(),
    iterations: z.number(),
    approvedBy: z.array(z.string()),
    approvedAt: z.string().nullable(),
    frozenAt: z.string().nullable(),
    downstreamUnlocked: z.boolean(),
  }).optional(),
  pipelineMeta: z.object({
    engineVersion: z.string(),
    intakeSchemaVersion: z.string(),
    readinessScore: z.number(),
    qualityScore: z.number(),
    qualityStatus: z.string(),
    freezeEligible: z.boolean(),
  }).optional(),
  risks: z.array(z.string()),
  architectureMode: z.string(),
  stabilityScore: z.number(),
  riskLevel: z.string()
});

export type Blueprint = z.infer<typeof BlueprintSchema>;
