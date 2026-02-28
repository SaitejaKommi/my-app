"use client"

import { useFormContext } from "react-hook-form"
import { FullRequirementsData } from "@/db/requirements-schema"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const analyticsOptions = [
  ["basic_usage_metrics", "Basic usage metrics"],
  ["funnel_analytics", "Funnel analytics"],
  ["financial_reporting", "Financial reporting"],
  ["bi_dashboards", "BI dashboards"],
  ["real_time_analytics", "Real-time analytics"],
  ["data_warehouse_export_required", "Data warehouse export required"],
] as const

const aiRoleOptions = [
  ["chat_assistant", "Chat assistant"],
  ["search_rag", "Search / RAG"],
  ["document_processing", "Document processing"],
  ["content_generation", "Content generation"],
  ["personalization", "Personalization"],
  ["computer_vision", "Computer vision"],
] as const

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

export function Step4DataAi() {
  const { register, setValue, watch } = useFormContext<FullRequirementsData>()
  const analytics = watch("analyticsExpectations") ?? []
  const aiRoles = watch("aiFunctionalRoles") ?? []
  const requiresAI = watch("requiresAI")
  const hasFinancialLogic = watch("hasFinancialLogic")
  const advancedCapabilities = watch("advancedCapabilities") ?? []
  const processingModels = watch("processingModels") ?? []

  const toggleAnalyticsExpectation = (value: NonNullable<FullRequirementsData["analyticsExpectations"]>[number]) => {
    const next = analytics.includes(value)
      ? analytics.filter((item) => item !== value)
      : [...analytics, value]
    setValue("analyticsExpectations", next)
  }

  const toggleAiRole = (value: NonNullable<FullRequirementsData["aiFunctionalRoles"]>[number]) => {
    const next = aiRoles.includes(value)
      ? aiRoles.filter((item) => item !== value)
      : [...aiRoles, value]
    setValue("aiFunctionalRoles", next)
  }

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
        <h3 className="text-lg font-medium">Step 4 — Data Architecture & AI</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data structure type</Label>
            <Select onValueChange={(v) => setValue("dataStructureType", v as FullRequirementsData["dataStructureType"])} defaultValue={watch("dataStructureType")}>
              <SelectTrigger><SelectValue placeholder="Select data type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="strongly_relational">Strongly relational</SelectItem>
                <SelectItem value="document_oriented">Document-oriented</SelectItem>
                <SelectItem value="time_series">Time-series</SelectItem>
                <SelectItem value="graph_relationships">Graph relationships</SelectItem>
                <SelectItem value="key_value">Key-value</SelectItem>
                <SelectItem value="large_binary_media_storage">Large binary/media storage</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data volume projection (12 months)</Label>
            <Select onValueChange={(v) => setValue("dataVolumeAt12Months", v as FullRequirementsData["dataVolumeAt12Months"])} defaultValue={watch("dataVolumeAt12Months")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="under_1gb">&lt; 1GB</SelectItem>
                <SelectItem value="1gb_to_10gb">1 - 10GB</SelectItem>
                <SelectItem value="10gb_to_100gb">10 - 100GB</SelectItem>
                <SelectItem value="100gb_to_1tb">100GB - 1TB</SelectItem>
                <SelectItem value="1tb_to_10tb">1TB - 10TB</SelectItem>
                <SelectItem value="over_10tb">10TB+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Retention policy</Label>
            <Select onValueChange={(v) => setValue("retentionPolicy", v as FullRequirementsData["retentionPolicy"])} defaultValue={watch("retentionPolicy")}>
              <SelectTrigger><SelectValue placeholder="Select retention" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="permanent_storage">Permanent storage</SelectItem>
                <SelectItem value="regulatory_retention_period">Regulatory retention period</SelectItem>
                <SelectItem value="time_bound_deletion">Time-bound deletion</SelectItem>
                <SelectItem value="user_controlled_deletion">User-controlled deletion</SelectItem>
                <SelectItem value="auto_archival">Auto-archival</SelectItem>
                <SelectItem value="regulatory_driven_retention">Regulatory-driven retention</SelectItem>
                <SelectItem value="immutable_record_storage_required">Immutable record storage required</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Consistency requirement</Label>
          <Select onValueChange={(v) => setValue("consistencyRequirement", v as FullRequirementsData["consistencyRequirement"])} defaultValue={watch("consistencyRequirement")}>
            <SelectTrigger><SelectValue placeholder="Select consistency" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="strong_consistency_required">Strong consistency required</SelectItem>
              <SelectItem value="eventual_consistency_acceptable">Eventual consistency acceptable</SelectItem>
              <SelectItem value="mixed_consistency">Mixed consistency</SelectItem>
              <SelectItem value="transactional_guarantees_required">Transactional guarantees required</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Data residency requirement</Label>
          <Select onValueChange={(v) => setValue("dataResidencyConstraint", v as FullRequirementsData["dataResidencyConstraint"])} defaultValue={watch("dataResidencyConstraint")}>
            <SelectTrigger><SelectValue placeholder="Select residency" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="no_restriction">No restriction</SelectItem>
              <SelectItem value="regional_storage_required">Regional storage required</SelectItem>
              <SelectItem value="country_level_isolation">Country-level isolation</SelectItem>
              <SelectItem value="multi_region_redundancy_required">Multi-region redundancy required</SelectItem>
              <SelectItem value="eu_only">EU-only</SelectItem>
              <SelectItem value="us_only">US-only</SelectItem>
              <SelectItem value="multi_region_isolation_required">Multi-region isolation required</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Analytics expectations</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {analyticsOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleAnalyticsExpectation(value)}
                className={`rounded-md border px-3 py-2 text-sm text-left ${
                  analytics.includes(value)
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

      <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h4 className="text-base font-medium">Financial & Transaction Integrity (Conditional)</h4>

        <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
          <input type="checkbox" className="h-4 w-4" {...register("hasFinancialLogic")} />
          <span className="text-sm">System contains financial transactions / settlement logic</span>
        </label>

        {hasFinancialLogic && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border border-border/60 bg-muted/20 p-4">
            <div className="space-y-2">
              <Label>Transaction model</Label>
              <Select onValueChange={(v) => setValue("financialTransactionModel", v as FullRequirementsData["financialTransactionModel"])} defaultValue={watch("financialTransactionModel")}>
                <SelectTrigger><SelectValue placeholder="Select transaction model" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple_payments">Simple payments</SelectItem>
                  <SelectItem value="escrow">Escrow</SelectItem>
                  <SelectItem value="multi_party_settlement">Multi-party settlement</SelectItem>
                  <SelectItem value="ledger_based_accounting">Ledger-based accounting</SelectItem>
                  <SelectItem value="real_time_reconciliation">Real-time reconciliation</SelectItem>
                  <SelectItem value="multi_currency">Multi-currency</SelectItem>
                  <SelectItem value="cross_border">Cross-border</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Audit requirement</Label>
              <Select onValueChange={(v) => setValue("financialAuditRequirement", v as FullRequirementsData["financialAuditRequirement"])} defaultValue={watch("financialAuditRequirement")}>
                <SelectTrigger><SelectValue placeholder="Select audit requirement" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic_logs_sufficient">Basic logs sufficient</SelectItem>
                  <SelectItem value="immutable_audit_logs_required">Immutable audit logs required</SelectItem>
                  <SelectItem value="double_entry_accounting_required">Double-entry accounting required</SelectItem>
                  <SelectItem value="external_audit_integrations_required">External audit integrations required</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h4 className="text-base font-medium">AI Architecture (Conditional)</h4>

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

        <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
          <input type="checkbox" className="h-4 w-4" {...register("requiresAI")} />
          <span className="text-sm">Enable AI capabilities</span>
        </label>

        {requiresAI && (
          <>
            <div className="space-y-2">
              <Label>AI functional role</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {aiRoleOptions.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleAiRole(value)}
                    className={`rounded-md border px-3 py-2 text-sm text-left ${
                      aiRoles.includes(value)
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
                <Label>Model strategy</Label>
                <Select onValueChange={(v) => setValue("aiModelStrategy", v as FullRequirementsData["aiModelStrategy"])} defaultValue={watch("aiModelStrategy")}>
                  <SelectTrigger><SelectValue placeholder="Select model strategy" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="external_api">External API-based</SelectItem>
                    <SelectItem value="self_hosted">Self-hosted models</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Latency requirement</Label>
                <Select onValueChange={(v) => setValue("aiLatencyRequirement", v as FullRequirementsData["aiLatencyRequirement"])} defaultValue={watch("aiLatencyRequirement")}>
                  <SelectTrigger><SelectValue placeholder="Select latency" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_200ms">&lt; 200ms</SelectItem>
                    <SelectItem value="under_1s">&lt; 1s</SelectItem>
                    <SelectItem value="under_3s">&lt; 3s</SelectItem>
                    <SelectItem value="async_acceptable">Async acceptable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
                <input type="checkbox" className="h-4 w-4" {...register("aiDataCanLeaveRegion")} />
                <span className="text-sm">Can data leave region?</span>
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
                <input type="checkbox" className="h-4 w-4" {...register("aiRequiresPrivateModels")} />
                <span className="text-sm">Must models be private?</span>
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
                <input type="checkbox" className="h-4 w-4" {...register("aiPromptAuditRequired")} />
                <span className="text-sm">Audit of prompts required?</span>
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
