"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Blueprint } from "@/db/output-schema"
import { cn } from "@/lib/utils"
import { 
  Package, 
  Cpu, 
  FileCode, 
  Info, 
  Layers, 
  ArrowUpRight, 
  FolderTree, 
  Terminal, 
  Users, 
  Map, 
  XCircle,
  CheckCircle2,
  AlertCircle,
  Zap,
  ShieldCheck,
  Rocket,
  Activity,
  History,
  Download,
  FileBox,
  FileText
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { dispatchBuild } from "@/lib/archai/build-dispatcher"
import { runBuildSession } from "@/lib/archai/build-agent"
import { PhasesView } from "./PhasesView"
import type { Phase, PhaseChain } from "@/db/phases-schema"

interface BlueprintResultProps {
  blueprint: Blueprint
  onClarify?: (answers: Record<string, string>) => void
  isClarifying?: boolean
}

type TabType = "overview" | "product" | "architecture"
type BuildState = "idle" | "dispatching" | "building" | "qa" | "shipping" | "done"

export function BlueprintResult({ blueprint, onClarify, isClarifying }: BlueprintResultProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [buildState, setBuildState] = useState<BuildState>("idle")
  const [buildLogs, setBuildLogs] = useState<string[]>([])
  const [phases, setPhases] = useState<Phase[]>([])
  const [phasesLoading, setPhasesLoading] = useState(false)
  const logEndRef = useRef<HTMLDivElement>(null)

  const tabs = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "product", label: "Product Spec", icon: Package },
    { id: "architecture", label: "Architecture", icon: Cpu },
  ]

  const downloadArtifact = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const prdContent = [
    "# Product Requirements Document",
    "",
    "## Executive Summary",
    blueprint.startupSummary.split("\n\n[ORCHESTRATOR]")[0],
    "",
    "## Users & Personas",
    ...blueprint.productSpec.personas.map((persona) => `- ${persona}`),
    "",
    "## Core Journeys",
    ...blueprint.productSpec.coreJourneys.map((journey, index) => `${index + 1}. ${journey}`),
    "",
    "## Success Criteria",
    ...blueprint.productSpec.successCriteria.map((criterion) => `- ${criterion}`),
    "",
    "## Risks",
    ...blueprint.risks.map((risk) => `- ${risk}`),
    "",
    "## Stability",
    `- Stability Score: ${blueprint.stabilityScore}%`,
    `- Risk Level: ${blueprint.riskLevel}`,
    `- Architecture Mode: ${blueprint.architectureMode}`,
  ].join("\n")

  const techStackContent = [
    "# Tech Stack",
    "",
    "## Recommended Stack",
    `- Frontend: ${blueprint.recommendedStack.frontend}`,
    `- Backend: ${blueprint.recommendedStack.backend}`,
    `- Database: ${blueprint.recommendedStack.database}`,
    `- Infrastructure: ${blueprint.recommendedStack.infra}`,
    "",
    "## Services",
    ...blueprint.services.map((service) => `- ${service.name}: ${service.responsibility}`),
    "",
    "## Key Dependencies",
    ...blueprint.engineeringSpec.keyDependencies.map((dependency) => `- ${dependency}`),
    "",
    "## Environment Variables",
    ...blueprint.engineeringSpec.envVariables.map((envVar) => `- ${envVar}`),
  ].join("\n")

  const detailedContent = [
    "# Detailed Engineering Specification",
    "",
    "## Folder Structure",
    ...blueprint.engineeringSpec.folderStructure.map((entry) => `- ${entry}`),
    "",
    "## API Contracts",
    ...blueprint.engineeringSpec.apiContracts.flatMap((api) => [
      `### ${api.method} ${api.endpoint}`,
      `- Description: ${api.description}`,
      `- Payload: ${api.payload || "n/a"}`,
      `- Response: ${api.response}`,
      "",
    ]),
    "## Database Schema",
    ...blueprint.engineeringSpec.databaseSchema.flatMap((table) => [
      `### ${table.table}`,
      "- Columns:",
      ...table.columns.map((column) => `  - ${column}`),
      ...(table.indexes && table.indexes.length > 0
        ? ["- Indexes:", ...table.indexes.map((indexName) => `  - ${indexName}`)]
        : ["- Indexes: none"]),
      "",
    ]),
  ].join("\n")

  const handleStartBuild = async () => {
    setBuildState("dispatching")
    setBuildLogs(["[DOMAIN 5] Dispatching Parallel Build Agents..."])
    
    // 1. Dispatch Build Instructions
    const session = await dispatchBuild(blueprint)
    
    // 2. Execute Build Phase (Domain 5)
    setBuildState("building")
    await runBuildSession(session, blueprint, (log) => {
      setBuildLogs(prev => [...prev, log])
    })

    // 3. Simulated Downstream Domains (6, 7, 9)
    // Domain 6: QA Simulation
    setTimeout(() => {
      setBuildState("qa")
      setBuildLogs(prev => [...prev, 
        "[DOMAIN 6] Starting Static Analysis...",
        "[DOMAIN 6] Running smoke tests for contracts...",
        "[DOMAIN 6] 12 Unit tests passed. 0 Failures."
      ])
    }, 1500)

    // Domain 7: Ship Simulation
    setTimeout(() => {
      setBuildState("shipping")
      setBuildLogs(prev => [...prev, 
        "[DOMAIN 7] Provisioning Vercel deployment...",
        "[DOMAIN 7] Validating infrastructure health...",
        "[DOMAIN 7] Assets uploaded. SSL secured."
      ])
    }, 4500)

    // Domain 9: Done
    setTimeout(() => {
      setBuildState("done")
      setBuildLogs(prev => [...prev, 
        "[DOMAIN 9] Handoff Package Generated.",
        "[SYSTEM] Build Success. Live at: https://arch-ai.sh/v1-demo"
      ])
    }, 7000)
  }

  const [clarificationAnswers, setClarificationAnswers] = useState<Record<string, string>>({})

  const handleClarifySubmit = () => {
    if (onClarify) onClarify(clarificationAnswers)
  }

  const handleGeneratePhases = async () => {
    setPhasesLoading(true)
    try {
      const response = await fetch("/api/v1/phases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprint }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate phases")
      }

      const data = await response.json()
      if (data.success) {
        setPhases(data.data.phases || [])
      }
    } catch (error) {
      console.error("Error generating phases:", error)
      // Fallback: show error message
      setPhases([])
    } finally {
      setPhasesLoading(false)
    }
  }

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [buildLogs])

  // --- SPECIAL RENDER: Clarification Required ---
  if (blueprint.clarification?.status === "pending") {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <Card className="border-amber-500/20 bg-zinc-950 shadow-2xl overflow-hidden">
          <div className="h-1.5 w-full bg-amber-500/50" />
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">Engineering Clarification Required</CardTitle>
                <CardDescription className="text-zinc-400">
                  The orchestrator detected potential architectural instability. Please resolve these constraints to continue.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6">
              {blueprint.clarification.questions.map((q) => (
                <div key={q.id} className="space-y-3">
                  <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {q.label}
                  </label>
                  
                  {q.type === "text" && (
                    <textarea 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                      placeholder="Type your response..."
                      rows={3}
                      onChange={(e) => setClarificationAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    />
                  )}

                  {q.type === "choice" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {q.options?.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setClarificationAnswers(prev => ({ ...prev, [q.id]: opt }))}
                          className={cn(
                            "p-3 rounded-lg border text-left text-xs font-bold transition-all",
                            clarificationAnswers[q.id] === opt 
                              ? "bg-blue-600/10 border-blue-500 text-blue-400" 
                              : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {q.type === "boolean" && (
                    <div className="flex gap-2">
                      {["Yes", "No"].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setClarificationAnswers(prev => ({ ...prev, [q.id]: opt }))}
                          className={cn(
                            "px-6 py-2 rounded-lg border text-xs font-bold transition-all",
                            clarificationAnswers[q.id] === opt 
                              ? "bg-blue-600/10 border-blue-500 text-blue-400" 
                              : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={handleClarifySubmit}
              disabled={isClarifying || Object.keys(clarificationAnswers).length < blueprint.clarification.questions.length}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isClarifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Synchronizing Decisions...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Finalize Architecture
                </>
              )}
            </button>
          </CardContent>
        </Card>

        {/* Audit Mini-Trace */}
        <div className="p-4 bg-zinc-900/40 rounded-xl border border-border/10">
          <div className="flex items-center gap-2 mb-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
            <History className="w-3 h-3" />
            Active Orchestration Pass: D1 (Halted)
          </div>
          <p className="text-xs text-zinc-400">The system has generated a potential execution graph but requires your input to finalize service decomposition strategy (D3) and engineering contracts (D4).</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-border/40 bg-zinc-950 shadow-2xl overflow-hidden">
        <div className={cn(
          "h-1.5 w-full",
          blueprint.riskLevel === "Low" ? "bg-green-500" : blueprint.riskLevel === "Medium" ? "bg-yellow-500" : "bg-red-500"
        )} />
        
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              Project Manifest
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Generated Technical & Product Strategy
            </CardDescription>
          </div>
          <div className="text-right">
            <Badge variant={blueprint.riskLevel === "High" ? "destructive" : "outline"} className="font-bold border-zinc-700 text-zinc-300">
              {blueprint.stabilityScore}% Stability
            </Badge>
            <div className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-widest text-[11px]">
              {blueprint.architectureMode}
            </div>
          </div>
        </CardHeader>

        {/* Tab Navigation */}
        <div className="px-6 flex gap-1 border-y border-border/10 bg-zinc-900/50 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === (tab.id as TabType)
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative whitespace-nowrap",
                  isActive ? "text-blue-400" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                )}
              </button>
            )
          })}
        </div>

        <CardContent className="p-6">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-zinc-900/40 p-5 rounded-lg border border-border/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Info className="w-12 h-12" />
                  </div>
                  <h4 className="text-sm font-bold uppercase text-zinc-500 mb-2 tracking-wider">Startup Summary</h4>
                  <p className="text-zinc-200 leading-relaxed font-medium italic">
                    &ldquo;{blueprint.startupSummary.split("\n\n[ORCHESTRATOR]")[0]}&rdquo;
                  </p>
                </div>

                {blueprint.startupSummary.includes("[ORCHESTRATOR]") && (
                  <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg flex gap-3 animate-in slide-in-from-left-4">
                    <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold uppercase text-blue-500 mb-1 tracking-widest">Autonomous Orchestrator Audit (D5.5)</h5>
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        {blueprint.startupSummary.split("[ORCHESTRATOR]")[1]}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    Critical Risks
                  </h4>
                  <ul className="space-y-2">
                    {blueprint.risks.map((risk, i) => (
                      <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
                    <ArrowUpRight className="w-3 h-3 text-green-400" />
                    Scaling Strategy
                  </h4>
                  <div className="space-y-3">
                    {blueprint.scalingPlan.map((step, i) => (
                      <div key={i} className="text-sm border-l-2 border-zinc-800 pl-3">
                        <span className="text-xs font-bold text-zinc-500 block">{step.stage}</span>
                        <span className="text-zinc-400">{step.strategy}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCT TAB */}
          {activeTab === "product" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase text-zinc-500 flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-400" />
                    Target Personas
                  </h4>
                  <div className="grid gap-2">
                    {blueprint.productSpec.personas.map((p, i) => (
                      <div key={i} className="p-3 bg-zinc-900/50 rounded border border-border/5 border-l-orange-500/50 border-l-2 text-zinc-300 text-sm">
                        {p}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase text-zinc-500 flex items-center gap-2">
                    <Map className="w-4 h-4 text-purple-400" />
                    Core User Journeys
                  </h4>
                  <ul className="space-y-3">
                    {blueprint.productSpec.coreJourneys.map((j, i) => (
                      <li key={i} className="text-sm text-zinc-400 flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center text-[10px] shrink-0 border border-purple-500/20 font-bold">
                          {i + 1}
                        </span>
                        {j}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-border/10">
                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase text-zinc-500 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-zinc-600" />
                    Non-Goals (Scope V1)
                  </h4>
                  <ul className="space-y-2">
                    {blueprint.productSpec.nonGoals.map((g, i) => (
                      <li key={i} className="text-sm text-zinc-500 line-through decoration-zinc-800">
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase text-zinc-500 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Success Criteria
                  </h4>
                  <ul className="space-y-2">
                    {blueprint.productSpec.successCriteria.map((c, i) => (
                      <li key={i} className="text-sm text-zinc-400 flex items-center gap-2">
                        <ArrowUpRight className="w-3 h-3 text-green-500/50" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ARCHITECTURE TAB */}
          {activeTab === "architecture" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.entries(blueprint.recommendedStack) as [string, string][]).map(([key, value]) => (
                  <div key={key} className="p-4 bg-zinc-900/50 rounded-lg border border-border/10 group hover:border-blue-500/30 transition-colors">
                    <div className="text-[10px] font-bold uppercase text-zinc-500 mb-1 group-hover:text-blue-400 transition-colors">{key}</div>
                    <div className="text-sm text-zinc-200 font-medium">{value}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-border/10">
                <h4 className="text-sm font-bold uppercase text-zinc-500">Service Decomposition</h4>
                <div className="grid grid-cols-1 gap-3">
                  {blueprint.services.map((service, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-lg border border-border/5 group hover:bg-zinc-900/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 transition-all">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-200">{service.name}</div>
                          <div className="text-xs text-zinc-500">{service.responsibility}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] opacity-40 border-zinc-700">Ready</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Implement Button */}
              <div className="flex gap-3 pt-6 border-t border-border/10">
                <button
                  onClick={() => setActiveTab("overview")}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg font-bold text-sm transition-all border border-zinc-700"
                >
                  Back
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                >
                  <Rocket className="w-4 h-4" />
                  Implement
                </button>
              </div>
            </div>
          )}
        </CardContent>

        {/* BUILD LOGS OVERLAY */}
        {buildState !== "idle" && (
          <div className="px-6 pb-6 animate-in slide-in-from-top-4 duration-300">
            <div className="bg-black/80 rounded-lg border border-blue-500/30 overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              <div className="bg-zinc-900 px-3 py-1.5 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[9px] font-mono text-zinc-500 ml-2">archai-autonomous-pipeline.log</span>
                </div>
                <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-blue-500/30 text-blue-400 animate-pulse">
                  {buildState.toUpperCase()}
                </Badge>
              </div>
              <div className="p-4 h-32 overflow-y-auto font-mono text-[10px] text-zinc-300 space-y-1 no-scrollbar">
                {buildLogs.map((log, i) => (
                  <div key={i} className={cn(
                    "flex gap-3",
                    log.includes("[DOMAIN 9]") || log.includes("[SYSTEM]") ? "text-green-400 font-bold" : 
                    log.includes("[DOMAIN") ? "text-blue-400" : "text-zinc-500"
                  )}>
                    <span className="text-zinc-700">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                    <span>{log}</span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>

            {/* PIPELINE PROGRESS BAR */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[
                { domain: 5, label: "Build", state: "building", min: "building" },
                { domain: 6, label: "QA", state: "qa", min: "qa" },
                { domain: 7, label: "Ship", state: "shipping", min: "shipping" },
                { domain: 9, label: "Done", state: "done", min: "done" }
              ].map((step) => {
                const statesOrder: BuildState[] = ["dispatching", "building", "qa", "shipping", "done"]
                const currentIdx = statesOrder.indexOf(buildState)
                const targetIdx = statesOrder.indexOf(step.state as BuildState)
                const isCompleted = currentIdx >= targetIdx
                
                return (
                  <div key={step.domain} className="space-y-2">
                    <div className={cn(
                      "h-1 rounded-full transition-all duration-1000",
                      isCompleted ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" : "bg-zinc-800"
                    )} />
                    <div className="flex justify-between items-center px-1">
                      <span className={cn(
                        "text-[9px] font-bold uppercase",
                        isCompleted ? "text-blue-400" : "text-zinc-600"
                      )}>D{step.domain}: {step.label}</span>
                      {isCompleted && <CheckCircle2 className="w-2.5 h-2.5 text-blue-500" />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
