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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          <RequirementsWizard onSubmit={handleGenerate} isLoading={isLoading} />

          {blueprint ? (
            <BlueprintResult
              blueprint={blueprint}
              onClarify={handleClarify}
              isClarifying={isClarifying}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground bg-card">
              Submit the intake to render the generated blueprint here.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
