import { NextRequest, NextResponse } from "next/server";
import { generateBlueprint } from "@/lib/archai/decision-engine";
import { createSuccessResponse, createErrorResponse } from "@/types/api";
import { FullRequirementsSchema } from "@/db/requirements-schema";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers, ...input } = body;
    
    // Validate input
    const validatedInput = FullRequirementsSchema.parse(input);

    const blueprint = await generateBlueprint(validatedInput, answers);

    return NextResponse.json(createSuccessResponse(blueprint));
    
  } catch (error) {
    console.error("API Error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        createErrorResponse(
          "Invalid input data", 
          "VALIDATION_ERROR", 
          error.format()
        ),
        { status: 400 }
      );
    }

    return NextResponse.json(
      createErrorResponse("An unexpected error occurred", "INTERNAL_SERVER_ERROR"),
      { status: 500 }
    );
  }
}
