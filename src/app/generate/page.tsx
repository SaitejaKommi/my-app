"use client"

import { useState } from "react"
import { RequirementsWizard } from "@/components/archai/wizard/RequirementsWizard"
import { BlueprintResult } from "@/components/archai/BlueprintResult"
import { Blueprint } from "@/db/output-schema"
import { FullRequirementsData } from "@/db/requirements-schema"
import { ApiResponse } from "@/types/api"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import nProgress from "nprogress"
import "nprogress/nprogress.css"

export default function GeneratorPage() {
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null)
  const [lastInput, setLastInput] = useState<FullRequirementsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isClarifying, setIsClarifying] = useState(false)
  const [stage, setStage] = useState<"intake" | "clarification" | "result">("intake")

  const handleGenerate = async (data: FullRequirementsData, answersOrEvent?: unknown) => {
    let retries = 0
    let success = false

    const isEvent =
      answersOrEvent &&
      typeof answersOrEvent === "object" &&
      ("nativeEvent" in answersOrEvent || "preventDefault" in answersOrEvent)
    const answers = isEvent ? undefined : answersOrEvent

    if (answers) {
      setIsClarifying(true)
    } else {
      setIsLoading(true)
      setLastInput(data)
      setBlueprint(null)
      setStage("intake")
    }

    nProgress.start()

    while (retries >= 0 && !success) {
      try {
        const response = await fetch("/api/v1/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, answers }),
        })

        if (!response.ok) throw new Error("Network response was not ok")

        const result: ApiResponse<Blueprint> = await response.json()

        if (result.success) {
          setBlueprint(result.data)
          if (result.data.clarification?.status === "pending") {
            setStage("clarification")
          } else {
            setStage("result")
          }
          success = true
        } else {
          throw new Error(result.error?.message || "Generation failed")
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error"
        if (retries === 0) {
          alert("Generation failed: " + message)
        }
        retries--
        if (retries >= 0) await new Promise((r) => setTimeout(r, 1000))
      }
    }

    setIsLoading(false)
    setIsClarifying(false)
    nProgress.done()
  }

  const handleClarify = (answers: Record<string, string>) => {
    if (!lastInput) return
    handleGenerate(lastInput, answers)
  }

  const handleStartOver = () => {
    setBlueprint(null)
    setLastInput(null)
    setIsLoading(false)
    setIsClarifying(false)
    setStage("intake")
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-[1400px] mx-auto px-4 py-8 md:py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Architecture Generator</h1>
            <p className="text-sm text-muted-foreground">Use seeded scenarios to speed up end-to-end testing.</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/">Back Home</Link>
          </Button>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-3 text-sm">
            <span className={stage === "intake" ? "font-semibold text-foreground" : "text-muted-foreground"}>1. Intake Questions</span>
            <span className="mx-2 text-muted-foreground">→</span>
            <span className={stage === "clarification" ? "font-semibold text-foreground" : "text-muted-foreground"}>2. Clarification Questions</span>
            <span className="mx-2 text-muted-foreground">→</span>
            <span className={stage === "result" ? "font-semibold text-foreground" : "text-muted-foreground"}>3. Final PRD</span>
          </div>

          {stage === "intake" && (
            <RequirementsWizard onSubmit={handleGenerate} isLoading={isLoading} />
          )}

          {stage !== "intake" && blueprint && (
            <BlueprintResult
              blueprint={blueprint}
              onClarify={handleClarify}
              isClarifying={isClarifying}
            />
          )}

          {stage !== "intake" && (
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleStartOver}>Start Over</Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
