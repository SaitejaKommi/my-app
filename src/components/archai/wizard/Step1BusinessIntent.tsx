"use client"

import { useFormContext } from "react-hook-form"
import { FullRequirementsData } from "@/db/requirements-schema"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const positioningOptions = [
  ["speed_latency", "Speed / latency"],
  ["ai_differentiation", "AI-driven differentiation"],
  ["ux_simplicity", "UX simplicity"],
  ["regulatory_compliance", "Regulatory compliance"],
  ["scalability", "Scalability"],
  ["cost_efficiency", "Cost efficiency"],
  ["network_effects", "Network effects"],
] as const

export function Step1BusinessIntent() {
  const { register, setValue, watch } = useFormContext<FullRequirementsData>()
  const positioning = watch("competitivePositioning") ?? []

  const togglePositioning = (value: NonNullable<FullRequirementsData["competitivePositioning"]>[number]) => {
    const next = positioning.includes(value)
      ? positioning.filter((item) => item !== value)
      : [...positioning, value]
    setValue("competitivePositioning", next)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h3 className="text-lg font-medium">Step 1 — Business & Strategic Intent</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Project Name *</Label>
            <Input {...register("projectName")} placeholder="e.g., AtlasOps Platform" />
          </div>
          <div className="space-y-2">
            <Label>Target Launch Date *</Label>
            <Input type="date" {...register("targetLaunchDate")} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Problem Statement *</Label>
          <Textarea
            {...register("problemStatement")}
            placeholder="Describe the core user/business problem"
            className="min-h-24"
          />
        </div>

        <div className="space-y-2">
          <Label>Solution Summary *</Label>
          <Textarea
            {...register("solutionSummary")}
            placeholder="Describe the solution and how it addresses the problem"
            className="min-h-24"
          />
        </div>

        <div className="space-y-2">
          <Label>What measurable outcome must this system achieve within 12 months? *</Label>
          <Select
            onValueChange={(v) => setValue("businessObjective", v as FullRequirementsData["businessObjective"])}
            defaultValue={watch("businessObjective")}
          >
            <SelectTrigger><SelectValue placeholder="Select objective" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue_generation">Revenue generation</SelectItem>
              <SelectItem value="cost_reduction">Cost reduction</SelectItem>
              <SelectItem value="operational_automation">Operational automation</SelectItem>
              <SelectItem value="regulatory_compliance">Regulatory compliance</SelectItem>
              <SelectItem value="marketplace_enablement">Marketplace enablement</SelectItem>
              <SelectItem value="platform_expansion">Platform expansion</SelectItem>
              <SelectItem value="data_monetization">Data monetization</SelectItem>
              <SelectItem value="internal_productivity">Internal productivity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>What KPI defines success for this initiative? *</Label>
          <Input {...register("businessSuccessKpi")} placeholder="e.g., Reach $50k MRR in 12 months" />
        </div>

        <div className="space-y-2">
          <Label>How will this product generate value? *</Label>
          <Select
            onValueChange={(v) => setValue("revenueArchitecture", v as FullRequirementsData["revenueArchitecture"])}
            defaultValue={watch("revenueArchitecture")}
          >
            <SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="subscription">Subscription</SelectItem>
              <SelectItem value="usage_based">Usage-based</SelectItem>
              <SelectItem value="licensing">Licensing</SelectItem>
              <SelectItem value="transaction_fees">Transaction fees</SelectItem>
              <SelectItem value="commission">Commission</SelectItem>
              <SelectItem value="advertising">Advertising</SelectItem>
              <SelectItem value="government_funding">Government funding</SelectItem>
              <SelectItem value="internal_cost_savings">Internal cost savings</SelectItem>
              <SelectItem value="not_revenue_driven">Not revenue-driven</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
            <input type="checkbox" className="h-4 w-4" {...register("entitlementsVaryByPlan")} />
            <span className="text-sm">Do entitlements vary by plan?</span>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
            <input type="checkbox" className="h-4 w-4" {...register("pricingChangesFrequently")} />
            <span className="text-sm">Will pricing change frequently?</span>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
            <input type="checkbox" className="h-4 w-4" {...register("requiresBillingProration")} />
            <span className="text-sm">Do you require billing proration?</span>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
            <input type="checkbox" className="h-4 w-4" {...register("expectsRefundsCredits")} />
            <span className="text-sm">Are refunds or credits expected?</span>
          </label>
        </div>

        <div className="space-y-2">
          <Label>What must this product outperform competitors in? *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {positioningOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => togglePositioning(value)}
                className={`rounded-md border px-3 py-2 text-sm text-left ${
                  positioning.includes(value)
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
