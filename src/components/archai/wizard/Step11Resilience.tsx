"use client"

import { useFormContext } from "react-hook-form"
import { FullRequirementsData } from "@/db/requirements-schema"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const observabilityOptions = [
  ["basic_logging", "Basic logging"],
  ["structured_logging", "Structured logs"],
  ["distributed_tracing", "Distributed tracing"],
  ["sla_monitoring", "SLA dashboards"],
  ["alerting", "Real-time alerting"],
  ["immutable_audit_dashboard", "Immutable audit dashboard"],
] as const

export function Step11Resilience() {
  const { setValue, watch, register } = useFormContext<FullRequirementsData>()
  const observability = watch("observabilityRequirementsDesired") ?? []

  const toggleObservability = (value: NonNullable<FullRequirementsData["observabilityRequirementsDesired"]>[number]) => {
    const next = observability.includes(value)
      ? observability.filter((item) => item !== value)
      : [...observability, value]
    setValue("observabilityRequirementsDesired", next)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h3 className="text-lg font-medium">Level 11 — Operational Resilience</h3>

        <div className="space-y-2">
          <Label>Availability target</Label>
          <Select onValueChange={(v) => setValue("availabilityTarget", v as FullRequirementsData["availabilityTarget"])} defaultValue={watch("availabilityTarget")}>
            <SelectTrigger><SelectValue placeholder="Select target" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="best_effort">Best effort</SelectItem>
              <SelectItem value="99">99%</SelectItem>
              <SelectItem value="99_9">99.9%</SelectItem>
              <SelectItem value="99_99">99.99%</SelectItem>
              <SelectItem value="99_999">99.999%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>RTO</Label>
            <Select onValueChange={(v) => setValue("rto", v as FullRequirementsData["rto"])} defaultValue={watch("rto")}>
              <SelectTrigger><SelectValue placeholder="Select RTO" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="under_15min">Under 15 min</SelectItem>
                <SelectItem value="15min_to_1hr">15 min - 1 hr</SelectItem>
                <SelectItem value="1hr_to_4hr">1 hr - 4 hr</SelectItem>
                <SelectItem value="4hr_to_24hr">4 hr - 24 hr</SelectItem>
                <SelectItem value="best_effort">Best effort</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>RPO</Label>
            <Select onValueChange={(v) => setValue("rpo", v as FullRequirementsData["rpo"])} defaultValue={watch("rpo")}>
              <SelectTrigger><SelectValue placeholder="Select RPO" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="zero">Zero data loss</SelectItem>
                <SelectItem value="under_5min">Under 5 min</SelectItem>
                <SelectItem value="under_1hr">Under 1 hr</SelectItem>
                <SelectItem value="under_24hr">Under 24 hr</SelectItem>
                <SelectItem value="best_effort">Best effort</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Observability requirements</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {observabilityOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleObservability(value)}
                className={`rounded-md border px-3 py-2 text-sm text-left ${
                  observability.includes(value)
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
          <Label>Failure mode philosophy</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
              <input type="checkbox" className="h-4 w-4" {...register("gracefulDegradationRequired")} />
              <span className="text-sm">Graceful degradation is required</span>
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
              <input type="checkbox" className="h-4 w-4" {...register("readOnlyModeAcceptable")} />
              <span className="text-sm">Read-only mode acceptable during incidents</span>
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
              <input type="checkbox" className="h-4 w-4" {...register("backgroundJobsCanDelay")} />
              <span className="text-sm">Background jobs can be delayed</span>
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
              <input type="checkbox" className="h-4 w-4" {...register("analyticsCanLag")} />
              <span className="text-sm">Analytics can lag behind real-time</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
