"use client"

import { useFormContext } from "react-hook-form"
import { FullRequirementsData } from "@/db/requirements-schema"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const integrationSurfaceOptions = [
  ["payment_providers", "Payment providers"],
  ["banking_apis", "Banking APIs"],
  ["erp", "ERP"],
  ["crm", "CRM"],
  ["government_apis", "Government APIs"],
  ["iot_devices", "IoT devices"],
  ["webhooks", "Webhooks"],
  ["data_warehouse", "Data warehouse"],
  ["third_party_saas", "Third-party SaaS"],
  ["hardware_systems", "Hardware systems"],
] as const

export function Step8Integration() {
  const { setValue, watch } = useFormContext<FullRequirementsData>()
  const integrationSurface = watch("integrationSurface") ?? []

  const toggleIntegrationSurface = (value: NonNullable<FullRequirementsData["integrationSurface"]>[number]) => {
    const next = integrationSurface.includes(value)
      ? integrationSurface.filter((item) => item !== value)
      : [...integrationSurface, value]
    setValue("integrationSurface", next)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h3 className="text-lg font-medium">Level 8 — Integration & Ecosystem</h3>

        <div className="space-y-2">
          <Label>External integrations</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {integrationSurfaceOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleIntegrationSurface(value)}
                className={`rounded-md border px-3 py-2 text-sm text-left ${
                  integrationSurface.includes(value)
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
          <Label>API exposure</Label>
          <Select onValueChange={(v) => setValue("apiExposureModel", v as FullRequirementsData["apiExposureModel"])} defaultValue={watch("apiExposureModel")}>
            <SelectTrigger><SelectValue placeholder="Select exposure" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="internal_only">Internal only</SelectItem>
              <SelectItem value="partner_api">Partner API</SelectItem>
              <SelectItem value="public_api">Public API</SelectItem>
              <SelectItem value="sdk_required">SDK required</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
