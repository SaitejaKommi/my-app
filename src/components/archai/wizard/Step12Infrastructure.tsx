"use client"

import { useFormContext } from "react-hook-form"
import { FullRequirementsData } from "@/db/requirements-schema"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function Step12Infrastructure() {
  const { register, setValue, watch } = useFormContext<FullRequirementsData>()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h3 className="text-lg font-medium">Level 12 — Infrastructure Constraints & Evolution</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Hosting preference</Label>
            <Select onValueChange={(v) => setValue("hostingPreference", v as FullRequirementsData["hostingPreference"])} defaultValue={watch("hostingPreference")}>
              <SelectTrigger><SelectValue placeholder="Select hosting" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fully_managed">Fully managed</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="self_hosted">Self-hosted</SelectItem>
                <SelectItem value="on_prem_required">On-prem required</SelectItem>
                <SelectItem value="multi_cloud_required">Multi-cloud required</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Monthly infrastructure budget</Label>
            <Select onValueChange={(v) => setValue("monthlyInfrastructureBudget", v as FullRequirementsData["monthlyInfrastructureBudget"])} defaultValue={watch("monthlyInfrastructureBudget")}>
              <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="under_50">&lt; $50</SelectItem>
                <SelectItem value="50_to_200">$50 - $200</SelectItem>
                <SelectItem value="200_to_500">$200 - $500</SelectItem>
                <SelectItem value="500_to_2k">$500 - $2k</SelectItem>
                <SelectItem value="2k_to_10k">$2k - $10k</SelectItem>
                <SelectItem value="over_10k">$10k+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cold start sensitivity</Label>
            <Select onValueChange={(v) => setValue("coldStartTolerance", v as FullRequirementsData["coldStartTolerance"])} defaultValue={watch("coldStartTolerance")}>
              <SelectTrigger><SelectValue placeholder="Select sensitivity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="zero">Zero tolerance</SelectItem>
                <SelectItem value="under_500ms">Sub-second required</SelectItem>
                <SelectItem value="under_2s">Acceptable delay</SelectItem>
                <SelectItem value="any">Any</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Expected lifespan</Label>
            <Select onValueChange={(v) => setValue("intendedSystemLifespan", v as FullRequirementsData["intendedSystemLifespan"])} defaultValue={watch("intendedSystemLifespan")}>
              <SelectTrigger><SelectValue placeholder="Select lifespan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="prototype">Prototype</SelectItem>
                <SelectItem value="mvp">MVP</SelectItem>
                <SelectItem value="three_to_five_year_system">3–5 year system</SelectItem>
                <SelectItem value="enterprise_long_term_system">Enterprise-grade long-term system</SelectItem>
                <SelectItem value="long_term_scalable_platform">Long-term scalable platform</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Team maturity level</Label>
            <Select onValueChange={(v) => setValue("teamMaturityLevel", v as FullRequirementsData["teamMaturityLevel"])} defaultValue={watch("teamMaturityLevel")}>
              <SelectTrigger><SelectValue placeholder="Select maturity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="solo_founder">Solo founder</SelectItem>
                <SelectItem value="small_early_stage_team">Small early-stage team</SelectItem>
                <SelectItem value="experienced_startup_team">Experienced startup team</SelectItem>
                <SelectItem value="enterprise_engineering_org">Enterprise engineering org</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Team seniority profile</Label>
            <Select onValueChange={(v) => setValue("teamSeniorityLevel", v as FullRequirementsData["teamSeniorityLevel"])} defaultValue={watch("teamSeniorityLevel")}>
              <SelectTrigger><SelectValue placeholder="Select seniority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mostly_juniors">Mostly juniors</SelectItem>
                <SelectItem value="mixed_mid_senior">Mixed mid/senior</SelectItem>
                <SelectItem value="senior_staff_principal">Senior/staff/principal-heavy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>DevOps maturity</Label>
            <Select onValueChange={(v) => setValue("devOpsMaturityLevel", v as FullRequirementsData["devOpsMaturityLevel"])} defaultValue={watch("devOpsMaturityLevel")}>
              <SelectTrigger><SelectValue placeholder="Select DevOps maturity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal_manual">Minimal / manual</SelectItem>
                <SelectItem value="basic_ci_cd">Basic CI/CD</SelectItem>
                <SelectItem value="automated_platform_engineering">Automated platform engineering</SelectItem>
                <SelectItem value="sre_ready">SRE-ready</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>In-house security expertise</Label>
            <Select onValueChange={(v) => setValue("securityExpertiseLevel", v as FullRequirementsData["securityExpertiseLevel"])} defaultValue={watch("securityExpertiseLevel")}>
              <SelectTrigger><SelectValue placeholder="Select security expertise" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="part_time">Part-time support</SelectItem>
                <SelectItem value="dedicated_engineer">Dedicated security engineer</SelectItem>
                <SelectItem value="security_team">Dedicated security team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cost sensitivity index</Label>
            <Select onValueChange={(v) => setValue("costSensitivityIndex", v as FullRequirementsData["costSensitivityIndex"])} defaultValue={watch("costSensitivityIndex")}>
              <SelectTrigger><SelectValue placeholder="Select cost/performance preference" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cost_first">Cost optimization over performance</SelectItem>
                <SelectItem value="balanced">Balanced cost/performance</SelectItem>
                <SelectItem value="performance_first">Performance over cost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Migration & legacy constraints</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
              <input type="checkbox" className="h-4 w-4" {...register("hasExistingProductionData")} />
              <span className="text-sm">Existing production data already exists</span>
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
              <input type="checkbox" className="h-4 w-4" {...register("migrationRequired")} />
              <span className="text-sm">Data/system migration is required</span>
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
              <input type="checkbox" className="h-4 w-4" {...register("backwardCompatibilityRequired")} />
              <span className="text-sm">Backward compatibility must be preserved</span>
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
              <input type="checkbox" className="h-4 w-4" {...register("legacyIntegrationRequired")} />
              <span className="text-sm">Legacy integrations are required</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Strategic architecture intent</Label>
          <Textarea
            {...register("strategicArchitectureIntent")}
            className="min-h-24"
            placeholder="State long-term architecture direction and constraints"
          />
        </div>
      </div>
    </div>
  )
}
