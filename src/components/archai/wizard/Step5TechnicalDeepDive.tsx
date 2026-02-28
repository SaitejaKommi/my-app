"use client"

import { useFormContext } from "react-hook-form"
import { FullRequirementsData } from "@/db/requirements-schema"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Step5TechnicalDeepDive() {
  const { register, setValue, watch } = useFormContext<FullRequirementsData>()
  const isMongo = watch("primaryDatabase") === "mongodb"
  const hasFinancialLogic = watch("hasFinancialLogic")
  const financialAuditRequirement = watch("financialAuditRequirement")
  const consistencyRequirement = watch("consistencyRequirement")
  const relationalWorkflow = ["role_based_approval", "long_running_processes"].includes(
    watch("workflowComplexityLevel") ?? ""
  )
  const relationalWarning = isMongo && relationalWorkflow
  const contradictionSeverity =
    isMongo &&
    hasFinancialLogic &&
    (financialAuditRequirement === "double_entry_accounting_required" || consistencyRequirement === "transactional_guarantees_required")
      ? "Blocking"
      : isMongo && hasFinancialLogic
        ? "Severe"
        : relationalWarning
          ? "Moderate"
          : null

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h3 className="text-lg font-medium">Step 5 — Technical Deep Dive</h3>
        <p className="text-sm text-muted-foreground">Visible in Technical Mode only.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Primary Database</Label>
            <Select onValueChange={(v) => setValue("primaryDatabase", v as FullRequirementsData["primaryDatabase"])} defaultValue={watch("primaryDatabase")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="neon">Neon</SelectItem>
                <SelectItem value="postgresql">PostgreSQL</SelectItem>
                <SelectItem value="supabase">Supabase</SelectItem>
                <SelectItem value="planetscale">PlanetScale</SelectItem>
                <SelectItem value="turso">Turso</SelectItem>
                <SelectItem value="mongodb">MongoDB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>ORM Choice</Label>
            <Select onValueChange={(v) => setValue("ormChoice", v as FullRequirementsData["ormChoice"])} defaultValue={watch("ormChoice")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="prisma">Prisma</SelectItem>
                <SelectItem value="drizzle">Drizzle</SelectItem>
                <SelectItem value="kysely">Kysely</SelectItem>
                <SelectItem value="supabase_client">Supabase Client</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>API Versioning</Label>
            <Select onValueChange={(v) => setValue("apiVersioningStrategy", v as FullRequirementsData["apiVersioningStrategy"])} defaultValue={watch("apiVersioningStrategy")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="url_versioning">URL versioning</SelectItem>
                <SelectItem value="header_versioning">Header versioning</SelectItem>
                <SelectItem value="query_param">Query param versioning</SelectItem>
                <SelectItem value="no_versioning">No versioning</SelectItem>
                <SelectItem value="content_negotiation">Content negotiation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tenant Isolation Model</Label>
            <Select onValueChange={(v) => setValue("tenantIsolationModel", v as FullRequirementsData["tenantIsolationModel"])} defaultValue={watch("tenantIsolationModel")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="shared_schema">Shared schema</SelectItem>
                <SelectItem value="schema_per_tenant">Schema per tenant</SelectItem>
                <SelectItem value="database_per_tenant">Database per tenant</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Auth Model</Label>
            <Select onValueChange={(v) => setValue("authLibrary", v as FullRequirementsData["authLibrary"])} defaultValue={watch("authLibrary")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="authjs_v5">Auth.js v5</SelectItem>
                <SelectItem value="clerk">Clerk</SelectItem>
                <SelectItem value="supabase_auth">Supabase Auth</SelectItem>
                <SelectItem value="lucia">Lucia</SelectItem>
                <SelectItem value="auth0">Auth0</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Session Strategy</Label>
            <Select onValueChange={(v) => setValue("sessionStrategy", v as FullRequirementsData["sessionStrategy"])} defaultValue={watch("sessionStrategy")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="jwt">JWT</SelectItem>
                <SelectItem value="database">Database session</SelectItem>
                <SelectItem value="redis_session">Redis session</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
            <input type="checkbox" className="h-4 w-4" {...register("cacheLayerRequired")} />
            <span className="text-sm">Enable caching strategy controls</span>
          </label>

          {watch("cacheLayerRequired") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border border-border/60 bg-muted/20 p-4">
              <div className="space-y-2">
                <Label>Cache Technology</Label>
                <Select onValueChange={(v) => setValue("cacheTechnology", v as FullRequirementsData["cacheTechnology"])} defaultValue={watch("cacheTechnology")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upstash">Upstash</SelectItem>
                    <SelectItem value="redis">Redis</SelectItem>
                    <SelectItem value="vercel_kv">Vercel KV</SelectItem>
                    <SelectItem value="in_memory">In-memory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cache Invalidation</Label>
                <Select onValueChange={(v) => setValue("cacheInvalidationStrategy", v as FullRequirementsData["cacheInvalidationStrategy"])} defaultValue={watch("cacheInvalidationStrategy")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ttl_based">TTL-based</SelectItem>
                    <SelectItem value="event_based">Event-based</SelectItem>
                    <SelectItem value="tag_based">Tag-based</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {contradictionSeverity && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-900 dark:text-amber-200">
            {contradictionSeverity} contradiction risk: MongoDB selection is under relational/financial pressure. Consider PostgreSQL for ACID integrity and safer reconciliation.
          </div>
        )}
      </div>
    </div>
  )
}
