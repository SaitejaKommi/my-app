"use client"

import { useFormContext } from "react-hook-form"
import { FullRequirementsData } from "@/db/requirements-schema"
import { Label } from "@/components/ui/label"

const advancedCapabilityOptions = [
  ["ai_assistant", "AI assistant"],
  ["fraud_detection", "Fraud detection"],
  ["risk_scoring", "Risk scoring"],
  ["predictive_analytics", "Predictive analytics"],
  ["recommendation_engine", "Recommendation engine"],
  ["search_indexing", "Search indexing"],
  ["document_processing", "Document processing"],
  ["computer_vision", "Computer vision"],
  ["none", "None"],
] as const

const processingModelOptions = [
  ["real_time_inference", "Real-time inference"],
  ["batch_processing", "Batch processing"],
  ["streaming_analytics", "Streaming analytics"],
  ["offline_model_training", "Offline model training"],
  ["external_ai_apis", "External AI APIs"],
  ["self_hosted_models", "Self-hosted models"],
] as const

export function Step9Intelligence() {
  const { setValue, watch } = useFormContext<FullRequirementsData>()
  const advancedCapabilities = watch("advancedCapabilities") ?? []
  const processingModels = watch("processingModels") ?? []

  const toggleAdvancedCapability = (value: NonNullable<FullRequirementsData["advancedCapabilities"]>[number]) => {
    const next = advancedCapabilities.includes(value)
      ? advancedCapabilities.filter((item) => item !== value)
      : [...advancedCapabilities, value]
    setValue("advancedCapabilities", next.length > 0 ? next : ["none"])
  }

  const toggleProcessingModel = (value: NonNullable<FullRequirementsData["processingModels"]>[number]) => {
    const next = processingModels.includes(value)
      ? processingModels.filter((item) => item !== value)
      : [...processingModels, value]
    setValue("processingModels", next)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h3 className="text-lg font-medium">Level 9 — Intelligence & Advanced Processing</h3>

        <div className="space-y-2">
          <Label>Advanced capabilities</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {advancedCapabilityOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleAdvancedCapability(value)}
                className={`rounded-md border px-3 py-2 text-sm text-left ${
                  advancedCapabilities.includes(value)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Processing model</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {processingModelOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleProcessingModel(value)}
                className={`rounded-md border px-3 py-2 text-sm text-left ${
                  processingModels.includes(value)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
