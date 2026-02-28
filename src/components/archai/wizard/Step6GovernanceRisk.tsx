"use client"

import { useFormContext } from "react-hook-form"
import { FullRequirementsData } from "@/db/requirements-schema"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const adminControlOptions = [
  ["user_management", "User management"],
  ["role_management", "Role management"],
  ["tenant_configuration", "Tenant configuration"],
  ["sla_monitoring", "SLA monitoring"],
  ["escalation_workflows", "Escalation workflows"],
  ["feature_flags", "Feature flags"],
  ["audit_logs", "Audit logs"],
  ["system_announcements", "System-wide announcements"],
] as const

const observabilityOptions = [
  ["basic_logging", "Basic logging"],
  ["error_tracking_only", "Error tracking only"],
  ["structured_logging", "Structured logging"],
  ["distributed_tracing", "Distributed tracing"],
  ["sla_monitoring", "SLA monitoring"],
  ["alerting", "Alerting"],
  ["immutable_audit_dashboard", "Immutable audit dashboard"],
] as const

const authenticationOptions = [
  ["basic_login", "Basic login"],
  ["oauth", "OAuth"],
  ["enterprise_sso", "Enterprise SSO"],
  ["mfa", "MFA"],
  ["passkeys", "Passkeys"],
  ["hardware_token_integration", "Hardware token integration"],
] as const

const authorizationOptions = [
  ["rbac", "RBAC"],
  ["abac", "ABAC"],
  ["policy_based", "Policy-based"],
  ["ownership_based", "Ownership-based"],
  ["field_level_permissions", "Field-level permissions"],
  ["tenant_scoped_isolation", "Tenant-scoped isolation"],
] as const

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

const threatProfileOptions = [
  ["fraud", "Fraud"],
  ["data_theft", "Data theft"],
  ["ddos", "DDoS"],
  ["insider_threats", "Insider threats"],
  ["nation_state_attacks", "Nation-state attacks"],
] as const

export function Step6GovernanceRisk() {
  const { setValue, watch } = useFormContext<FullRequirementsData>()
  const adminControls = watch("adminControlsRequired") ?? []
  const observability = watch("observabilityRequirementsDesired") ?? []
  const integrationSurface = watch("integrationSurface") ?? []
  const threatProfiles = watch("threatProfiles") ?? []
  const authentication = watch("authenticationExpectations") ?? []
  const authorization = watch("authorizationExpectations") ?? []

  const toggleAdminControl = (value: NonNullable<FullRequirementsData["adminControlsRequired"]>[number]) => {
    const next = adminControls.includes(value)
      ? adminControls.filter((item) => item !== value)
      : [...adminControls, value]
    setValue("adminControlsRequired", next)
  }

  const toggleObservability = (value: NonNullable<FullRequirementsData["observabilityRequirementsDesired"]>[number]) => {
    const next = observability.includes(value)
      ? observability.filter((item) => item !== value)
      : [...observability, value]
    setValue("observabilityRequirementsDesired", next)
  }

  const toggleIntegrationSurface = (value: NonNullable<FullRequirementsData["integrationSurface"]>[number]) => {
    const next = integrationSurface.includes(value)
      ? integrationSurface.filter((item) => item !== value)
      : [...integrationSurface, value]
    setValue("integrationSurface", next)
  }

  const toggleThreatProfile = (value: NonNullable<FullRequirementsData["threatProfiles"]>[number]) => {
    const next = threatProfiles.includes(value)
      ? threatProfiles.filter((item) => item !== value)
      : [...threatProfiles, value]
    setValue("threatProfiles", next)
  }

  const toggleAuthentication = (value: NonNullable<FullRequirementsData["authenticationExpectations"]>[number]) => {
    const next = authentication.includes(value)
      ? authentication.filter((item) => item !== value)
      : [...authentication, value]
    setValue("authenticationExpectations", next)
  }

  const toggleAuthorization = (value: NonNullable<FullRequirementsData["authorizationExpectations"]>[number]) => {
    const next = authorization.includes(value)
      ? authorization.filter((item) => item !== value)
      : [...authorization, value]
    setValue("authorizationExpectations", next)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h3 className="text-lg font-medium">Step 6 — Governance & Risk Modeling</h3>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Recovery Time Objective (RTO)</Label>
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
            <Label>Recovery Point Objective (RPO)</Label>
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
          <Label>Threat profile</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {threatProfileOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleThreatProfile(value)}
                className={`rounded-md border px-3 py-2 text-sm text-left ${
                  threatProfiles.includes(value)
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
          <Label>Authentication expectations</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {authenticationOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleAuthentication(value)}
                className={`rounded-md border px-3 py-2 text-sm text-left ${
                  authentication.includes(value)
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
          <Label>Authorization model expectations</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {authorizationOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleAuthorization(value)}
                className={`rounded-md border px-3 py-2 text-sm text-left ${
                  authorization.includes(value)
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
          <Label>Administrative controls required</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {adminControlOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleAdminControl(value)}
                className={`rounded-md border px-3 py-2 text-sm text-left ${
                  adminControls.includes(value)
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
      </div>
    </div>
  )
}
