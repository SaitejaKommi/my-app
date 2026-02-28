"use client"

import { useFormContext } from "react-hook-form"
import { FullRequirementsData } from "@/db/requirements-schema"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Step5FinancialIntegrity() {
  const { register, setValue, watch } = useFormContext<FullRequirementsData>()
  const hasFinancialLogic = watch("hasFinancialLogic")

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h3 className="text-lg font-medium">Level 5 — Financial & Transaction Integrity</h3>

        <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
          <input type="checkbox" className="h-4 w-4" {...register("hasFinancialLogic")} />
          <span className="text-sm">Shown only if financial logic exists</span>
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
              <Label>Audit requirements</Label>
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
    </div>
  )
}
