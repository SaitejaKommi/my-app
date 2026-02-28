"use client"

import { useFormContext } from "react-hook-form"
import { FullRequirementsData } from "@/db/requirements-schema"
import { Label } from "@/components/ui/label"

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

const threatProfileOptions = [
  ["fraud", "Fraud"],
  ["data_theft", "Data theft"],
  ["ddos", "DDoS"],
  ["insider_threats", "Insider threats"],
  ["nation_state_attacks", "Nation-state attacks"],
] as const

export function Step10Security() {
  const { setValue, watch } = useFormContext<FullRequirementsData>()
  const authentication = watch("authenticationExpectations") ?? []
  const authorization = watch("authorizationExpectations") ?? []
  const threatProfiles = watch("threatProfiles") ?? []

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

  const toggleThreatProfile = (value: NonNullable<FullRequirementsData["threatProfiles"]>[number]) => {
    const next = threatProfiles.includes(value)
      ? threatProfiles.filter((item) => item !== value)
      : [...threatProfiles, value]
    setValue("threatProfiles", next)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h3 className="text-lg font-medium">Level 10 — Security Architecture</h3>

        <div className="space-y-2">
          <Label>Authentication</Label>
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
          <Label>Authorization</Label>
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
      </div>
    </div>
  )
}
