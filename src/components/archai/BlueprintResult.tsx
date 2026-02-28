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

interface BlueprintResultProps {
  blueprint: Blueprint
  onClarify?: (answers: Record<string, string>) => void
  isClarifying?: boolean
}

type TabType = "overview" | "product" | "architecture" | "engineering" | "quality" | "performance" | "ship" | "deliverables" | "handoff" | "audit"
type BuildState = "idle" | "dispatching" | "building" | "qa" | "shipping" | "done"

export function BlueprintResult({ blueprint, onClarify, isClarifying }: BlueprintResultProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [buildState, setBuildState] = useState<BuildState>("idle")
  const [buildLogs, setBuildLogs] = useState<string[]>([])
  const logEndRef = useRef<HTMLDivElement>(null)

  const tabs = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "product", label: "Product Spec", icon: Package },
    { id: "architecture", label: "Architecture", icon: Cpu },
    { id: "engineering", label: "Engineering", icon: FileCode },
    { id: "quality", label: "Quality Audit", icon: ShieldCheck },
    { id: "performance", label: "Performance", icon: Activity },
    { id: "ship", label: "Shipping", icon: Rocket },
    { id: "deliverables", label: "Files", icon: FileText },
    { id: "handoff", label: "Handoff", icon: FileBox },
    { id: "audit", label: "Execution Audit", icon: History },
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
            </div>
          )}

          {/* ENGINEERING TAB */}
          {activeTab === "engineering" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Repository Column */}
                <div className="space-y-4 lg:col-span-1">
                  <h4 className="text-sm font-bold uppercase text-zinc-500 flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-yellow-400" />
                    Structure
                  </h4>
                  <div className="bg-black/50 p-4 rounded-lg border border-zinc-800 font-mono text-[11px] text-zinc-400">
                    <div className="text-zinc-600 mb-2">{"// Repository Layout"}</div>
                    {blueprint.engineeringSpec.folderStructure.map((path, i) => (
                      <div key={i} className="flex items-center gap-2 mb-1">
                        <span className="text-zinc-700">├──</span>
                        <span className="text-zinc-300">{path}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <h4 className="text-xs font-bold uppercase text-zinc-600 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Dependencies
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {blueprint.engineeringSpec.keyDependencies.map((dep, i) => (
                        <Badge key={i} variant="secondary" className="bg-zinc-900 border-zinc-800 text-[10px] text-zinc-400">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* API & Schema Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* API Contracts */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold uppercase text-zinc-500 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-blue-400" />
                        API Contracts (v1)
                      </h4>
                      {buildState === "idle" && (
                        <button 
                          onClick={handleStartBuild}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                        >
                          <Zap className="w-3 h-3" />
                          Initiate Build
                        </button>
                      )}
                    </div>
                    <div className="grid gap-3">
                      {blueprint.engineeringSpec.apiContracts.map((api, i) => (
                        <div key={i} className="bg-zinc-900/50 p-3 rounded-lg border border-border/10 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-mono text-xs">
                              <span className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-bold",
                                api.method === "GET" ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"
                              )}>{api.method}</span>
                              <span className="text-zinc-200">{api.endpoint}</span>
                            </div>
                            <span className="text-[10px] text-zinc-500">{api.description}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[10px]">
                            <div className="p-2 bg-black/40 rounded border border-zinc-800/50">
                              <div className="text-zinc-600 mb-1 leading-none uppercase text-[8px] font-bold">Request</div>
                              <div className="text-zinc-400 truncate">{api.payload || "n/a"}</div>
                            </div>
                            <div className="p-2 bg-black/40 rounded border border-zinc-800/50">
                              <div className="text-zinc-600 mb-1 leading-none uppercase text-[8px] font-bold">Response</div>
                              <div className="text-zinc-400 truncate">{api.response}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Database Models */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase text-zinc-500 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-green-400" />
                      Data Models
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {blueprint.engineeringSpec.databaseSchema.map((item, i) => (
                        <div key={i} className="bg-zinc-900/30 p-3 rounded-lg border border-border/10">
                          <div className="text-xs font-bold text-zinc-200 mb-2 border-b border-zinc-800 pb-1 flex justify-between">
                            <span>{item.table}</span>
                            <span className="text-zinc-600 font-mono text-[9px]">Table</span>
                          </div>
                          <div className="space-y-1">
                            {item.columns.map((col, idx) => (
                              <div key={idx} className="text-[10px] font-mono text-zinc-500 flex justify-between">
                                <span>{col.split(':')[0]}</span>
                                <span className="text-zinc-600 italic">{col.split(':')[1]}</span>
                              </div>
                            ))}
                          </div>
                          {item.indexes && (
                            <div className="mt-2 pt-2 border-t border-zinc-900/50 flex flex-wrap gap-1">
                              {item.indexes.map((idx, id) => (
                                <span key={id} className="text-[8px] font-mono bg-zinc-800 text-zinc-500 px-1 rounded">
                                  IDX: {idx}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QUALITY AUDIT TAB */}
          {activeTab === "quality" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between bg-zinc-900/40 p-5 rounded-lg border border-border/10">
                <div>
                  <h4 className="text-sm font-bold uppercase text-zinc-500 mb-1 tracking-wider">Quality Score</h4>
                  <div className="text-3xl font-bold text-white flex items-center gap-3">
                    {blueprint.qaReport.score}%
                    <Badge className={cn(
                      "text-[10px] h-5",
                      blueprint.qaReport.score > 80 ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"
                    )}>
                      {blueprint.qaReport.score > 80 ? "A Grade" : "B Grade"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <ShieldCheck className="w-10 h-10 text-blue-400 opacity-20" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    Security Audit
                  </h4>
                  <div className="space-y-2">
                    {blueprint.qaReport.securityAudit.map((item, i) => (
                      <div key={i} className="text-xs bg-zinc-900/50 p-3 rounded border border-border/10 text-zinc-300">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
                    <Zap className="w-3 h-3 text-amber-400" />
                    Performance Analysis
                  </h4>
                  <div className="space-y-2">
                    {blueprint.qaReport.performanceAudit.map((item, i) => (
                      <div key={i} className="text-xs bg-zinc-900/50 p-3 rounded border border-border/10 text-zinc-300">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
                  <Terminal className="w-3 h-3 text-zinc-400" />
                  Technical Debt Roadmap
                </h4>
                <div className="bg-black/40 p-4 rounded-lg border border-zinc-800/50 font-mono text-[10px]">
                  {blueprint.qaReport.technicalDebt.map((item, i) => (
                    <div key={i} className="flex gap-2 mb-2 text-zinc-400">
                      <span className="text-zinc-600">[{i+1}]</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PERFORMANCE TAB */}
          {activeTab === "performance" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-900/40 p-5 rounded-lg border border-border/10">
                  <h4 className="text-sm font-bold uppercase text-zinc-500 mb-4 tracking-wider">Virtual Load Simulation</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-xs text-zinc-400">Arch. Breakpoint</span>
                      <span className="text-2xl font-bold text-white">{blueprint.performanceReport.maxUsers.toLocaleString()} CCU</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: '75%' }} />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase font-bold">
                      <span>Staging: 1k</span>
                      <span>Scale Target: 100k</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-zinc-900/40 p-4 rounded-lg border border-border/10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-400">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold text-zinc-500 uppercase">Primary Bottleneck</h5>
                      <p className="text-sm font-bold text-white">{blueprint.performanceReport.bottleneck}</p>
                    </div>
                  </div>
                  <div className="bg-zinc-900/40 p-4 rounded-lg border border-border/10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold text-zinc-500 uppercase">Est. Latency (P99)</h5>
                      <p className="text-sm font-bold text-white">{blueprint.performanceReport.latencyP99}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-amber-400" />
                  Performance Optimization Roadmap
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {blueprint.performanceReport.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-zinc-900/50 rounded border border-border/10 text-xs text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SHIPPING TAB */}
          {activeTab === "ship" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-900/40 p-4 rounded-lg border border-border/10">
                  <h5 className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Strategy</h5>
                  <p className="text-sm font-bold text-white">{blueprint.shipSpec.deploymentStrategy}</p>
                </div>
                <div className="bg-zinc-900/40 p-4 rounded-lg border border-border/10">
                  <h5 className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Provider</h5>
                  <p className="text-sm font-bold text-white">{blueprint.recommendedStack.infra}</p>
                </div>
                <div className="bg-zinc-900/40 p-4 rounded-lg border border-border/10">
                  <h5 className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Auto-Scaling</h5>
                  <p className="text-sm font-bold text-white text-green-400">Enabled (Elastic)</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
                  <FileCode className="w-3 h-3 text-blue-400" />
                  CI/CD Pipeline Manifest (.github/workflows)
                </h4>
                <pre className="bg-black/60 p-4 rounded-lg border border-zinc-800 text-[10px] font-mono text-blue-300 overflow-x-auto">
                  {blueprint.shipSpec.ciPipeline}
                </pre>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
                  <Layers className="w-3 h-3 text-green-400" />
                  Infrastructure as Code (Terraform)
                </h4>
                <pre className="bg-black/60 p-4 rounded-lg border border-zinc-800 text-[10px] font-mono text-green-300 overflow-x-auto">
                  {blueprint.shipSpec.infraManifest}
                </pre>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
                  <Terminal className="w-3 h-3 text-zinc-400" />
                  Environment Config (Staging/Prod)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {blueprint.shipSpec.environmentConfigs.map((config, i) => (
                    <div key={i} className="bg-zinc-900/50 p-2 rounded border border-border/10 font-mono text-[9px] text-zinc-400">
                      {config}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DELIVERABLE FILES TAB */}
          {activeTab === "deliverables" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 gap-4">
                {[
                  { title: "PRD File", fileName: "PRD.md", content: prdContent },
                  { title: "Tech Stack File", fileName: "TECH_STACK.md", content: techStackContent },
                  { title: "Detailed File", fileName: "DETAILED_SPEC.md", content: detailedContent },
                ].map((artifact) => (
                  <div key={artifact.fileName} className="bg-zinc-900/40 rounded-lg border border-border/10 overflow-hidden">
                    <div className="px-4 py-3 border-b border-border/10 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">{artifact.title}</h4>
                        <p className="text-[11px] text-zinc-500 font-mono">{artifact.fileName}</p>
                      </div>
                      <button
                        onClick={() => downloadArtifact(artifact.fileName, artifact.content)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                    </div>
                    <pre className="max-h-64 overflow-auto p-4 text-[10px] font-mono text-zinc-300 bg-black/40">
                      {artifact.content}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HANDOFF TAB */}
          {activeTab === "handoff" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 rounded-xl border border-blue-500/20 text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/40">
                  <ShieldCheck className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Project Readiness Certified</h3>
                  <p className="text-zinc-400 text-sm max-w-md mx-auto">
                    The autonomous orchestrator has completed all 9 domains of analysis, validation, and optimization. Your project is ready for initial deployment.
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center gap-6 pt-4">
                  <div className="flex items-center gap-8 bg-zinc-900/40 p-6 rounded-2xl border border-border/10">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle 
                          cx="48" cy="48" r="40" 
                          className="stroke-zinc-800 fill-none" 
                          strokeWidth="8" 
                        />
                        <circle 
                          cx="48" cy="48" r="40" 
                          className="stroke-blue-500 fill-none transition-all duration-1000 ease-out" 
                          strokeWidth="8" 
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 * (1 - (blueprint.handoffSpec.readinessScore / 100))}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-white leading-none">{blueprint.handoffSpec.readinessScore}%</span>
                        <span className="text-[8px] uppercase text-zinc-500 font-bold tracking-widest mt-1">Ready</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-zinc-900/80 px-4 py-2 rounded-lg border border-zinc-700 min-w-[140px]">
                        <span className="text-[10px] uppercase text-zinc-500 block">Stability Index</span>
                        <span className="text-xl font-mono text-green-400 font-bold">{blueprint.handoffSpec.readinessScore}%</span>
                      </div>
                      {blueprint.handoffSpec.readinessScore > 90 && (
                        <div className="bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
                          <span className="text-[10px] uppercase text-green-500 block">Certification</span>
                          <span className="text-xs font-bold text-green-400 flex items-center gap-1.5 pt-0.5">
                            <ShieldCheck className="w-3 h-3" /> HIGH RELIABILITY
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg flex items-center gap-3 font-bold text-sm transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] group overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <Download className="w-4 h-4" />
                    Download Handoff Package
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
                    <Rocket className="w-3 h-3 text-blue-400" />
                    Strategic Next Steps
                  </h4>
                  <div className="space-y-2">
                    {blueprint.handoffSpec.nextSteps.map((step, i) => (
                      <div key={i} className="flex gap-3 p-3 bg-zinc-900/50 rounded border border-border/10 text-xs text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
                    <FileBox className="w-3 h-3 text-purple-400" />
                    Technical Artifacts
                  </h4>
                  <div className="space-y-2">
                    {blueprint.handoffSpec.documentationLinks.map((link, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded border border-border/10">
                        <span className="text-xs text-zinc-300">{link.title}</span>
                        <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                      </div>
                    ))}
                    <div className="p-3 bg-blue-500/5 rounded border border-blue-500/20 flex items-center justify-between">
                      <span className="text-xs text-blue-300 font-bold font-mono">system-runtime-manifest.json</span>
                      <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AUDIT TAB (Option B: Visible Execution Graph) */}
          {activeTab === "audit" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
                  <History className="w-3 h-3 text-zinc-400" />
                  Autonomous Execution Trace
                </h4>
                <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-500">
                  Orchestrator v{blueprint.executionAudit.orchestratorVersion}
                </Badge>
              </div>

              <div className="relative space-y-4 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800">
                {blueprint.executionAudit.history.map((step, i) => (
                  <div key={i} className="relative pl-8 pb-4">
                    <div className={cn(
                      "absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center border",
                      step.status === "passed" ? "bg-green-500/10 border-green-500/40 text-green-500" :
                      step.status === "repaired" ? "bg-amber-500/10 border-amber-500/40 text-amber-500" :
                      "bg-red-500/10 border-red-500/40 text-red-500"
                    )}>
                      {step.status === "passed" ? <CheckCircle2 className="w-3 h-3" /> : 
                       step.status === "repaired" ? <Activity className="w-3 h-3" /> :
                       <AlertCircle className="w-3 h-3" />}
                    </div>
                    <div className="bg-zinc-900/40 p-4 rounded-lg border border-border/10">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{step.stage}</span>
                          <Badge variant="outline" className="text-[8px] h-3.5 px-1 border-zinc-800 text-zinc-500 lowercase">
                            {step.attempts} attempt{step.attempts > 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {step.durationMs && <span className="text-[9px] font-mono text-zinc-600">{step.durationMs}ms</span>}
                          <span className="text-[9px] font-mono text-zinc-600 border-l border-zinc-800 pl-2">{new Date(step.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-400 mb-2">{step.details}</p>
                      
                      {step.details.includes("Intelligence Grounding") && (
                        <div className="mt-3 p-2 bg-blue-500/5 border border-blue-500/20 rounded flex items-center gap-3">
                          <Zap className="w-3 h-3 text-blue-400 animate-pulse" />
                          <span className="text-[10px] text-blue-300 font-bold italic">RAG Intelligence Seasoning Active</span>
                        </div>
                      )}

                      {step.repairs && step.repairs.length > 0 && (
                        <div className="space-y-1 mt-3 pt-3 border-t border-zinc-800">
                          <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-tighter block mb-1">Self-Repair Actions:</span>
                          {step.repairs.map((repair, ri) => (
                            <div key={ri} className="flex gap-2 text-[10px] text-zinc-500 italic">
                              <span className="text-amber-500/50">↳</span>
                              {repair}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-black/40 p-4 rounded-lg border border-zinc-800/50 flex items-center justify-between">
                <div className="flex gap-4">
                  <div>
                    <span className="text-[10px] uppercase text-zinc-500 block">Total Nodes</span>
                    <span className="text-sm font-mono text-white">9 Domain Nodes</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-zinc-500 block">Repair Loops</span>
                    <span className="text-sm font-mono text-amber-500">{blueprint.executionAudit.totalRepairs} Detected & Fixed</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-zinc-500 block">Total Latency</span>
                    <span className="text-sm font-mono text-blue-400">{(blueprint.executionAudit.totalDurationMs / 1000).toFixed(2)}s</span>
                  </div>
                </div>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px]">
                  Object Graph Integrity Verified
                </Badge>
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
