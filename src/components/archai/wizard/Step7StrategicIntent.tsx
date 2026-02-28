"use client"

import { useFormContext } from "react-hook-form"
import { FullRequirementsData } from "@/db/requirements-schema"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Step7StrategicIntent() {
  const { register, setValue, watch } = useFormContext<FullRequirementsData>()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h3 className="text-lg font-medium">Step 7 — Strategic Architecture Intent</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Hosting Preference</Label>
            <Select onValueChange={(v) => setValue("hostingPreference", v as FullRequirementsData["hostingPreference"])} defaultValue={watch("hostingPreference")}>
              <SelectTrigger><SelectValue placeholder="Select hosting model" /></SelectTrigger>
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
                <SelectItem value="under_2s">Acceptable short delay</SelectItem>
                <SelectItem value="any">Any</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Intended system lifespan</Label>
            <Select onValueChange={(v) => setValue("intendedSystemLifespan", v as FullRequirementsData["intendedSystemLifespan"])} defaultValue={watch("intendedSystemLifespan")}>
              <SelectTrigger><SelectValue placeholder="Select lifespan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="prototype">Prototype</SelectItem>
                <SelectItem value="mvp">MVP</SelectItem>
                <SelectItem value="mvp_1_to_2_years">MVP (1–2 years)</SelectItem>
                <SelectItem value="three_to_five_year_system">3–5 year system</SelectItem>
                <SelectItem value="long_term_scalable_platform">Long-term scalable platform</SelectItem>
                <SelectItem value="enterprise_grade_system">Enterprise-grade system</SelectItem>
                <SelectItem value="enterprise_long_term_system">Enterprise-grade long-term system</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Exit vision</Label>
            <Select onValueChange={(v) => setValue("exitVision", v as FullRequirementsData["exitVision"])} defaultValue={watch("exitVision")}>
              <SelectTrigger><SelectValue placeholder="Select vision" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="acquisition">Acquisition</SelectItem>
                <SelectItem value="ipo_scale">IPO-scale</SelectItem>
                <SelectItem value="cash_flow_lifestyle">Cash-flow positive lifestyle business</SelectItem>
                <SelectItem value="internal_tool_only">Internal tool only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Strategic architecture intent</Label>
          <Textarea
            {...register("strategicArchitectureIntent")}
            className="min-h-28"
            placeholder="Describe long-term architecture direction, constraints, and non-negotiables"
          />
        </div>
      </div>
    </div>
  )
}
