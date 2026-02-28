import { NextRequest, NextResponse } from "next/server";
import { generatePhases } from "@/lib/archai/phases-generator";
import { createSuccessResponse, createErrorResponse } from "@/types/api";
import { Blueprint } from "@/db/output-schema";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { blueprint } = body as { blueprint: Blueprint };

    if (!blueprint) {
      return NextResponse.json(
        createErrorResponse("Blueprint is required", "MISSING_INPUT"),
        { status: 400 }
      );
    }

    // Generate phases with code
    const phases = await generatePhases(blueprint);

    return NextResponse.json(createSuccessResponse({
      id: `phases-${Date.now()}`,
      blueprintId: `blueprint-${Date.now()}`,
      phases,
      createdAt: new Date(),
    }));

  } catch (error) {
    console.error("Phase generation error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        createErrorResponse(
          "Invalid blueprint data",
          "VALIDATION_ERROR",
          error.format()
        ),
        { status: 400 }
      );
    }

    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : "Failed to generate phases",
        "GENERATION_ERROR"
      ),
      { status: 500 }
    );
  }
}
