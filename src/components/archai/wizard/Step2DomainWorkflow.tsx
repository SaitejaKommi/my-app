"use client"

import { useFormContext } from "react-hook-form"
import { FullRequirementsData } from "@/db/requirements-schema"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const workflowCharacteristicOptions = [
  ["simple_crud", "Simple CRUD"],
  ["conditional_branching", "Conditional branching"],
  ["sla_driven_deadlines", "SLA-driven deadlines"],
  ["background_automation", "Background automation"],
  ["event_triggered_flows", "Event-triggered flows"],
  ["human_in_loop", "Human-in-the-loop"],
  ["external_callback_integration", "External callback integration"],
  ["real_time_decision_engine", "Real-time decision engine"],
  ["high_frequency_transactions", "High-frequency transactions"],
] as const

export function Step2DomainWorkflow() {
  const { register, setValue, watch } = useFormContext<FullRequirementsData>()
  const workflowCharacteristics = watch("workflowCharacteristics") ?? []

  const toggleWorkflowCharacteristic = (value: NonNullable<FullRequirementsData["workflowCharacteristics"]>[number]) => {
    const next = workflowCharacteristics.includes(value)
      ? workflowCharacteristics.filter((item) => item !== value)
      : [...workflowCharacteristics, value]
    setValue("workflowCharacteristics", next)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h3 className="text-lg font-medium">Step 2 — Core Domain & Workflow Modeling</h3>

        <div className="space-y-2">
          <Label>List 3–7 primary business objects (comma-separated)</Label>
          <Textarea
            placeholder="User, Order, Invoice, Ticket"
            className="min-h-20"
            value={(watch("coreDomainObjectsList") ?? []).join(", ")}
            onChange={(e) => {
              const values = e.target.value.split(",").map((item) => item.trim()).filter(Boolean)
              setValue("coreDomainObjectsList", values)
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>For each object: who owns, modifies, approves, and audits it?</Label>
          <Textarea {...register("objectOwnershipNotes")} className="min-h-24" />
        </div>

        <div className="space-y-2">
          <Label>Primary object lifecycle states</Label>
          <Textarea
            {...register("lifecycleStates")}
            placeholder="Draft → Submitted → Reviewed → Approved → Rejected → Archived"
            className="min-h-20"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Are transitions automated or manual?</Label>
            <Select
              onValueChange={(v) => setValue("stateTransitionsMode", v as FullRequirementsData["stateTransitionsMode"])}
              defaultValue={watch("stateTransitionsMode")}
            >
              <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="automated">Automated</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Workflow complexity level</Label>
            <Select
              onValueChange={(v) => setValue("workflowComplexityLevel", v as FullRequirementsData["workflowComplexityLevel"])}
              defaultValue={watch("workflowComplexityLevel")}
            >
              <SelectTrigger><SelectValue placeholder="Select complexity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="no_state_logic">No state logic</SelectItem>
                <SelectItem value="simple_crud">Simple CRUD</SelectItem>
                <SelectItem value="simple_lifecycle">Simple lifecycle</SelectItem>
                <SelectItem value="multi_step_forms">Multi-step forms</SelectItem>
                <SelectItem value="role_based_approval">Role-based approval chains</SelectItem>
                <SelectItem value="financial_settlement_lifecycle">Financial settlement lifecycle</SelectItem>
                <SelectItem value="regulatory_state_transitions">Regulatory state transitions</SelectItem>
                <SelectItem value="irreversible_states">Irreversible states</SelectItem>
                <SelectItem value="long_running_processes">Long-running processes</SelectItem>
                <SelectItem value="human_in_loop">Human-in-the-loop workflows</SelectItem>
                <SelectItem value="external_callbacks">External system callbacks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
            <input type="checkbox" className="h-4 w-4" {...register("stateTransitionsReversible")} />
            <span className="text-sm">Can transitions be reversed?</span>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
            <input type="checkbox" className="h-4 w-4" {...register("stateTransitionsTriggerNotifications")} />
            <span className="text-sm">Do transitions trigger notifications?</span>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
            <input type="checkbox" className="h-4 w-4" {...register("stateTransitionsTriggerFinancialEvents")} />
            <span className="text-sm">Do transitions trigger financial events?</span>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
            <input type="checkbox" className="h-4 w-4" {...register("workflowsConfigurableByAdmins")} />
            <span className="text-sm">Are workflows configurable by admins?</span>
          </label>
        </div>

        <label className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
          <input type="checkbox" className="h-4 w-4" {...register("workflowsDifferByTenant")} />
          <span className="text-sm">Will workflows differ by tenant?</span>
        </label>

        <div className="space-y-2">
          <Label>Workflow characteristics (select all that apply)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {workflowCharacteristicOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleWorkflowCharacteristic(value)}
                className={`rounded-md border px-3 py-2 text-sm text-left ${
                  workflowCharacteristics.includes(value)
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
