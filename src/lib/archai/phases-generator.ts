import { Blueprint } from "@/db/output-schema";
import { Phase, CodeBlock, PhaseSchema } from "@/db/phases-schema";
import { callLLM } from "./llm-client";

/**
 * Generate implementation phases with code blocks based on the blueprint
 * Follows the pattern: UI → API → Database → Integration → Testing
 */
export async function generatePhases(blueprint: Blueprint): Promise<Phase[]> {
  const phases: Phase[] = [];

  // Phase 1: UI Components
  phases.push(await generateUIPhase(blueprint));

  // Phase 2: API Routes
  phases.push(await generateAPIPhase(blueprint));

  // Phase 3: Database Schema
  phases.push(await generateDatabasePhase(blueprint));

  // Phase 4: Integration & Services
  phases.push(await generateIntegrationPhase(blueprint));

  // Phase 5: Testing & Documentation
  phases.push(await generateTestingPhase(blueprint));

  return phases;
}

async function generateUIPhase(blueprint: Blueprint): Promise<Phase> {
  const prompt = `You are a React/TypeScript expert. Based on this architecture blueprint, generate 3-4 key UI components that should be built first.

Blueprint Summary:
${blueprint.startupSummary}

Core Journeys:
${blueprint.productSpec.coreJourneys.join("\n")}

IMPORTANT: Respond ONLY with valid JSON (no markdown, no backticks, no extra text). Use this exact structure:
{
  "blocks": [
    {
      "language": "tsx",
      "filename": "ComponentName.tsx",
      "description": "What this component does",
      "code": "... complete TSX code ..."
    }
  ],
  "reasoning": "Why these components are critical path",
  "estimatedDays": 3
}`;

  try {
    const response = await callLLM(prompt);
    const parsed = JSON.parse(response);

    return {
      id: "phase-1-ui",
      name: "UI Components",
      description: "Build core React components for user journeys",
      order: 1,
      status: "complete",
      blocks: parsed.blocks || [],
      reasoning: parsed.reasoning,
      estimatedDays: parsed.estimatedDays || 3,
    };
  } catch (error) {
    console.error("UI phase generation failed:", error);
    return {
      id: "phase-1-ui",
      name: "UI Components",
      description: "Build core React components for user journeys",
      order: 1,
      status: "error",
      blocks: [],
      reasoning: `Error generating UI components: ${error instanceof Error ? error.message : "Unknown error"}`,
      estimatedDays: 3,
    };
  }
}

async function generateAPIPhase(blueprint: Blueprint): Promise<Phase> {
  const prompt = `You are a Next.js API design expert. Based on this architecture blueprint, generate 3-4 critical API route handlers.

Database: ${blueprint.recommendedStack.database}
Backend: ${blueprint.recommendedStack.backend}

Core Journeys:
${blueprint.productSpec.coreJourneys.join("\n")}

IMPORTANT: Respond ONLY with valid JSON (no markdown, no backticks, no extra text). Use this exact structure:
{
  "blocks": [
    {
      "language": "typescript",
      "filename": "api/route.ts",
      "description": "What this endpoint does",
      "code": "... complete TS code ..."
    }
  ],
  "reasoning": "Why these API endpoints are critical",
  "estimatedDays": 4
}`;

  try {
    const response = await callLLM(prompt);
    const parsed = JSON.parse(response);

    return {
      id: "phase-2-api",
      name: "API Routes",
      description: "Implement backend API endpoints",
      order: 2,
      status: "complete",
      blocks: parsed.blocks || [],
      reasoning: parsed.reasoning,
      estimatedDays: parsed.estimatedDays || 4,
    };
  } catch (error) {
    console.error("API phase generation failed:", error);
    return {
      id: "phase-2-api",
      name: "API Routes",
      description: "Implement backend API endpoints",
      order: 2,
      status: "error",
      blocks: [],
      reasoning: `Error generating API routes: ${error instanceof Error ? error.message : "Unknown error"}`,
      estimatedDays: 4,
    };
  }
}

async function generateDatabasePhase(blueprint: Blueprint): Promise<Phase> {
  const prompt = `You are a database architect. Based on this architecture blueprint, design the database schema.

Database: ${blueprint.recommendedStack.database}
Personas: ${blueprint.productSpec.personas.join(", ")}

Core Journeys:
${blueprint.productSpec.coreJourneys.join("\n")}

IMPORTANT: Respond ONLY with valid JSON (no markdown, no backticks, no extra text). Use this exact structure:
{
  "blocks": [
    {
      "language": "prisma",
      "filename": "schema.prisma",
      "description": "Database schema definition",
      "code": "... complete schema ..."
    }
  ],
  "reasoning": "Design decisions and rationale",
  "estimatedDays": 2
}`;

  try {
    const response = await callLLM(prompt);
    const parsed = JSON.parse(response);

    return {
      id: "phase-3-database",
      name: "Database Schema",
      description: "Design and implement database schema",
      order: 3,
      status: "complete",
      blocks: parsed.blocks || [],
      reasoning: parsed.reasoning,
      estimatedDays: parsed.estimatedDays || 2,
    };
  } catch (error) {
    console.error("Database phase generation failed:", error);
    return {
      id: "phase-3-database",
      name: "Database Schema",
      description: "Design and implement database schema",
      order: 3,
      status: "error",
      blocks: [],
      reasoning: `Error generating database schema: ${error instanceof Error ? error.message : "Unknown error"}`,
      estimatedDays: 2,
    };
  }
}

async function generateIntegrationPhase(blueprint: Blueprint): Promise<Phase> {
  const prompt = `You are a full-stack integration expert. Generate critical service layers and utilities.

Database: ${blueprint.recommendedStack.database}
Services: ${blueprint.services.map(s => s.name).join(", ")}

IMPORTANT: Respond ONLY with valid JSON (no markdown, no backticks, no extra text). Use this exact structure:
{
  "blocks": [
    {
      "language": "typescript",
      "filename": "services/ServiceName.ts",
      "description": "What this service does",
      "code": "... complete TS code ..."
    }
  ],
  "reasoning": "Integration strategy rationale",
  "estimatedDays": 3
}`;

  try {
    const response = await callLLM(prompt);
    const parsed = JSON.parse(response);

    return {
      id: "phase-4-integration",
      name: "Services & Integration",
      description: "Implement service layers and integrations",
      order: 4,
      status: "complete",
      blocks: parsed.blocks || [],
      reasoning: parsed.reasoning,
      estimatedDays: parsed.estimatedDays || 3,
    };
  } catch (error) {
    console.error("Integration phase generation failed:", error);
    return {
      id: "phase-4-integration",
      name: "Services & Integration",
      description: "Implement service layers and integrations",
      order: 4,
      status: "error",
      blocks: [],
      reasoning: `Error generating integration code: ${error instanceof Error ? error.message : "Unknown error"}`,
      estimatedDays: 3,
    };
  }
}

async function generateTestingPhase(blueprint: Blueprint): Promise<Phase> {
  const prompt = `You are a testing expert. Generate testing setup and test examples.

Database: ${blueprint.recommendedStack.database}
Stability Score: ${blueprint.stabilityScore}
Risk Level: ${blueprint.riskLevel}

IMPORTANT: Respond ONLY with valid JSON (no markdown, no backticks, no extra text). Use this exact structure:
{
  "blocks": [
    {
      "language": "typescript",
      "filename": "jest.config.ts",
      "description": "Testing setup or test example",
      "code": "... complete code ..."
    }
  ],
  "reasoning": "Testing strategy based on risk profile",
  "estimatedDays": 2
}`;

  try {
    const response = await callLLM(prompt);
    const parsed = JSON.parse(response);

    return {
      id: "phase-5-testing",
      name: "Testing & QA",
      description: "Set up testing infrastructure and test suites",
      order: 5,
      status: "complete",
      blocks: parsed.blocks || [],
      reasoning: parsed.reasoning,
      estimatedDays: parsed.estimatedDays || 2,
    };
  } catch (error) {
    console.error("Testing phase generation failed:", error);
    return {
      id: "phase-5-testing",
      name: "Testing & QA",
      description: "Set up testing infrastructure and test suites",
      order: 5,
      status: "error",
      blocks: [],
      reasoning: `Error generating testing setup: ${error instanceof Error ? error.message : "Unknown error"}`,
      estimatedDays: 2,
    };
  }
}
