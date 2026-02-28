import { z } from "zod";

export const CodeBlockSchema = z.object({
  language: z.string().describe("Programming language (tsx, ts, json, sql, etc)"),
  filename: z.string().describe("Suggested filename for the code"),
  description: z.string().describe("What this code does"),
  code: z.string().describe("The actual code content"),
});

export const PhaseSchema = z.object({
  id: z.string().describe("Unique phase identifier"),
  name: z.string().describe("Phase name (e.g., 'UI Components', 'API Routes', 'Database Schema')"),
  description: z.string().describe("What is delivered in this phase"),
  order: z.number().describe("Execution order (1, 2, 3, etc)"),
  status: z.enum(["pending", "generating", "complete", "error"]).default("pending"),
  blocks: z.array(CodeBlockSchema).describe("Generated code blocks for this phase"),
  reasoning: z.string().optional().describe("Why these code choices were made"),
  estimatedDays: z.number().optional().describe("Estimated time to complete this phase"),
});

export const PhaseChainSchema = z.object({
  id: z.string(),
  blueprintId: z.string(),
  phases: z.array(PhaseSchema),
  createdAt: z.date().optional(),
  completedAt: z.date().optional(),
});

export type CodeBlock = z.infer<typeof CodeBlockSchema>;
export type Phase = z.infer<typeof PhaseSchema>;
export type PhaseChain = z.infer<typeof PhaseChainSchema>;
