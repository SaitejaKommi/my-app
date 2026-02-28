"use client"

import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { FullRequirementsData } from "@/db/requirements-schema"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Step0Engagement() {
  const { setValue, watch } = useFormContext<FullRequirementsData>()
  const profile = watch("engagementProfile")
  const mode = watch("engagementMode")

  useEffect(() => {
    if (!profile || mode) return
    const inferred =
      profile === "technical_founder" ||
      profile === "engineering_lead_cto" ||
      profile === "enterprise_it_representative"
        ? "technical"
        : "non_technical"
    setValue("engagementMode", inferred)
  }, [profile, mode, setValue])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h3 className="text-lg font-medium">Step 0 — Engagement Profile</h3>
        <p className="text-sm text-muted-foreground">Choose who is completing discovery and the required depth level.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Who is completing this architecture discovery? *</Label>
            <Select
              onValueChange={(v) => setValue("engagementProfile", v as FullRequirementsData["engagementProfile"])}
              defaultValue={profile}
            >
              <SelectTrigger><SelectValue placeholder="Select profile" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="non_technical_founder">Non-technical founder</SelectItem>
                <SelectItem value="product_manager">Product manager</SelectItem>
                <SelectItem value="technical_founder">Technical founder</SelectItem>
                <SelectItem value="engineering_lead_cto">Engineering lead / CTO</SelectItem>
                <SelectItem value="enterprise_it_representative">Enterprise IT representative</SelectItem>
                <SelectItem value="external_consultant">External consultant</SelectItem>
                <SelectItem value="investor_auditor">Investor / auditor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Discovery Mode *</Label>
            <Select
              onValueChange={(v) => setValue("engagementMode", v as FullRequirementsData["engagementMode"])}
              defaultValue={mode}
            >
              <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="non_technical">Non-Technical Mode (advisory)</SelectItem>
                <SelectItem value="technical">Technical Mode (deep controls)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>How detailed should this architecture plan be? *</Label>
          <Select
            onValueChange={(v) => setValue("planningDepth", v as FullRequirementsData["planningDepth"])}
            defaultValue={watch("planningDepth")}
          >
            <SelectTrigger><SelectValue placeholder="Select planning depth" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="quick_startup_blueprint">Quick startup blueprint</SelectItem>
              <SelectItem value="production_grade_system">Production-grade system</SelectItem>
              <SelectItem value="enterprise_compliance_ready">Enterprise-grade compliance-ready</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>System Classification *</Label>
          <Select
            onValueChange={(v) => setValue("systemClassification", v as FullRequirementsData["systemClassification"])}
            defaultValue={watch("systemClassification")}
          >
            <SelectTrigger><SelectValue placeholder="Select system type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="public_web_application">Public web application</SelectItem>
              <SelectItem value="mobile_application">Mobile application</SelectItem>
              <SelectItem value="internal_enterprise_system">Internal enterprise system</SelectItem>
              <SelectItem value="marketplace_platform">Marketplace platform</SelectItem>
              <SelectItem value="financial_transaction_system">Financial transaction system</SelectItem>
              <SelectItem value="healthcare_system">Healthcare system</SelectItem>
              <SelectItem value="government_platform">Government platform</SelectItem>
              <SelectItem value="data_platform_analytics_system">Data platform / analytics system</SelectItem>
              <SelectItem value="iot_hardware_integrated_system">IoT / hardware-integrated system</SelectItem>
              <SelectItem value="media_streaming_system">Media / streaming system</SelectItem>
              <SelectItem value="hybrid_system">Hybrid system</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
