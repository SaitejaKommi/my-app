"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Copy,
  GitBranch,
  GitCommit,
  Loader,
  Play,
  RefreshCw,
  Server,
  Settings,
  Terminal,
  Trash2,
  X,
  ChevronRight,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DeploymentStep {
  id: string
  name: string
  status: "pending" | "running" | "success" | "failed"
  duration: number
  logs: string[]
}

interface Deployment {
  id: string
  projectName: string
  branch: string
  commit: string
  environment: "Production" | "Preview" | "Development"
  status: "Building" | "Deploying" | "Ready" | "Failed"
  createdAt: Date
  trigger: "Manual" | "Git push"
  qaResult: "Passed" | "Failed"
  steps: DeploymentStep[]
}

const mockDeployments: Deployment[] = [
  {
    id: "deploy-001",
    projectName: "NexOra Ai",
    branch: "main",
    commit: "a3f7e9c2",
    environment: "Production",
    status: "Ready",
    createdAt: new Date(Date.now() - 3 * 60000),
    trigger: "Git push",
    qaResult: "Passed",
    steps: [
      {
        id: "install",
        name: "Install Dependencies",
        status: "success",
        duration: 45,
        logs: [
          "$ npm install",
          "npm WARN deprecated axios@0.27.2",
          "added 287 packages, and audited 288 packages",
          "✓ No vulnerabilities detected",
        ],
      },
      {
        id: "tests",
        name: "Run Tests",
        status: "success",
        duration: 28,
        logs: [
          "$ npm run test:all",
          "PASS  src/tests/unit.test.ts",
          "PASS  src/tests/integration.test.ts",
          "Tests:       89 passed, 89 total",
          "Coverage:    94% statements, 89% branches",
        ],
      },
      {
        id: "build",
        name: "Build Application",
        status: "success",
        duration: 52,
        logs: [
          "$ npm run build",
          "▲ Next.js 14.2.0",
          "✓ Compiled successfully",
          "✓ Analyzed packages",
          "✓ Created optimized production build",
          "Build size: 2.3MB (gzipped: 847KB)",
        ],
      },
      {
        id: "deploy",
        name: "Deploy to Vercel",
        status: "success",
        duration: 35,
        logs: [
          "$ vercel deploy --prod",
          "Deploying to Vercel...",
          "✓ Production URL: https://nexora-ai.vercel.app",
          "✓ DNS configured",
          "✓ SSL certificate active",
          "Deployment complete!",
        ],
      },
    ],
  },
  {
    id: "deploy-002",
    projectName: "NexOra Ai",
    branch: "feature/qa-automation",
    commit: "b4t8f0d3",
    environment: "Preview",
    status: "Ready",
    createdAt: new Date(Date.now() - 15 * 60000),
    trigger: "Git push",
    qaResult: "Passed",
    steps: [
      {
        id: "install",
        name: "Install Dependencies",
        status: "success",
        duration: 42,
        logs: ["$ npm install", "✓ Installation complete"],
      },
      {
        id: "tests",
        name: "Run Tests",
        status: "success",
        duration: 25,
        logs: ["$ npm run test:all", "Tests: 89 passed"],
      },
      {
        id: "build",
        name: "Build Application",
        status: "success",
        duration: 48,
        logs: ["$ npm run build", "✓ Build successful"],
      },
      {
        id: "deploy",
        name: "Deploy to Vercel (Preview)",
        status: "success",
        duration: 30,
        logs: [
          "Deploying to Vercel Preview...",
          "✓ Preview URL: https://nexora-preview.vercel.app",
        ],
      },
    ],
  },
  {
    id: "deploy-003",
    projectName: "NexOra Ai",
    branch: "develop",
    commit: "c5u9g1e4",
    environment: "Development",
    status: "Deploying",
    createdAt: new Date(Date.now() - 2 * 60000),
    trigger: "Manual",
    qaResult: "Passed",
    steps: [
      {
        id: "install",
        name: "Install Dependencies",
        status: "success",
        duration: 44,
        logs: ["$ npm install", "✓ Installation complete"],
      },
      {
        id: "tests",
        name: "Run Tests",
        status: "success",
        duration: 27,
        logs: ["$ npm run test:all", "Tests: 89 passed"],
      },
      {
        id: "build",
        name: "Build Application",
        status: "running",
        duration: 0,
        logs: [
          "$ npm run build",
          "▲ Next.js 14.2.0",
          "Creating an optimized production build...",
        ],
      },
      {
        id: "deploy",
        name: "Deploy to Vercel (Dev)",
        status: "pending",
        duration: 0,
        logs: [],
      },
    ],
  },
  {
    id: "deploy-004",
    projectName: "NexOra Ai",
    branch: "hotfix/perf-issue",
    commit: "d6v0h2f5",
    environment: "Production",
    status: "Failed",
    createdAt: new Date(Date.now() - 45 * 60000),
    trigger: "Git push",
    qaResult: "Failed",
    steps: [
      {
        id: "install",
        name: "Install Dependencies",
        status: "success",
        duration: 45,
        logs: ["$ npm install", "✓ Installation complete"],
      },
      {
        id: "tests",
        name: "Run Tests",
        status: "failed",
        duration: 18,
        logs: [
          "$ npm run test:all",
          "FAIL  src/tests/performance.test.ts",
          "Performance threshold exceeded",
          "Expected: < 2.5s | Actual: 3.2s",
          "❌ Tests failed - Deployment blocked",
        ],
      },
      {
        id: "build",
        name: "Build Application",
        status: "pending",
        duration: 0,
        logs: [],
      },
      {
        id: "deploy",
        name: "Deploy to Vercel",
        status: "pending",
        duration: 0,
        logs: [],
      },
    ],
  },
]

export default function DeploymentsPage() {
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(
    mockDeployments[0]
  )
  const [deployments, setDeployments] = useState<Deployment[]>(mockDeployments)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    if (selectedDeployment) {
      const allLogs: string[] = []
      selectedDeployment.steps.forEach((step) => {
        allLogs.push(`\n[${step.name.toUpperCase()}]`)
        allLogs.push(...step.logs)
      })
      setLogs(allLogs)
    }
  }, [selectedDeployment])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready":
      case "success":
        return "bg-green-500/10 text-green-400 border-green-500/30"
      case "Deploying":
      case "Building":
      case "running":
        return "bg-white/10 text-white border-white/30"
      case "Failed":
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/30"
      case "pending":
        return "bg-gray-500/10 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Ready":
      case "success":
        return <CheckCircle2 className="w-5 h-5" />
      case "Deploying":
      case "Building":
      case "running":
        return <Loader className="w-5 h-5 animate-spin" />
      case "Failed":
      case "failed":
        return <AlertCircle className="w-5 h-5" />
      case "pending":
        return <Clock className="w-5 h-5" />
      default:
        return null
    }
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  const environments = [
    { name: "Production", deployment: deployments[0] },
    { name: "Preview", deployment: deployments[1] },
    { name: "Development", deployment: deployments[2] },
  ]

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Deployments</h1>
          <p className="text-gray-400">Manage and monitor your application deployments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDE - DEPLOYMENTS LIST */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Recent Deployments</h2>
              <Button
                size="sm"
                className="bg-white hover:bg-gray-100 text-black flex items-center gap-2"
              >
                <Play className="w-3 h-3" />
                New Deploy
              </Button>
            </div>

            <div className="space-y-2 max-h-[800px] overflow-y-auto pr-2">
              {deployments.map((deployment) => (
                <button
                  key={deployment.id}
                  onClick={() => setSelectedDeployment(deployment)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border transition-all",
                    selectedDeployment?.id === deployment.id
                      ? "bg-gray-900 border-gray-700"
                      : "bg-gray-900/50 border-gray-800 hover:bg-gray-900/70"
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-white text-sm">{deployment.projectName}</p>
                      <Badge className={cn("text-xs border", getStatusColor(deployment.status))}>
                        {getStatusIcon(deployment.status)}
                        <span className="ml-1">{deployment.status}</span>
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-2">
                      <GitBranch className="w-3 h-3" />
                      {deployment.branch}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(deployment.createdAt)}
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-[10px] border-gray-700 bg-gray-900">
                        {deployment.environment}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] border",
                          deployment.qaResult === "Passed"
                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                            : "bg-red-500/10 text-red-400 border-red-500/30"
                        )}
                      >
                        {deployment.qaResult === "Passed" ? "✓" : "✗"} QA
                      </Badge>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE - DEPLOYMENT DETAILS */}
          {selectedDeployment && (
            <div className="lg:col-span-2 space-y-6">
              {/* DEPLOYMENT SUMMARY */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Deployment <span className="font-mono text-sm text-gray-400">#{selectedDeployment.id}</span>
                      </CardTitle>
                      <CardDescription>{selectedDeployment.projectName}</CardDescription>
                    </div>
                    <Badge className={cn("border text-base", getStatusColor(selectedDeployment.status))}>
                      {getStatusIcon(selectedDeployment.status)}
                      <span className="ml-2">{selectedDeployment.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Branch</p>
                      <p className="text-sm font-mono text-gray-300 flex items-center gap-2">
                        <GitBranch className="w-4 h-4" />
                        {selectedDeployment.branch}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Commit</p>
                      <p className="text-sm font-mono text-gray-300 flex items-center gap-2">
                        <GitCommit className="w-4 h-4" />
                        {selectedDeployment.commit}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Environment</p>
                      <p className="text-sm text-gray-300">{selectedDeployment.environment}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Trigger</p>
                      <p className="text-sm text-gray-300">{selectedDeployment.trigger}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-4">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">QA Gate Result</p>
                    <Badge
                      className={cn(
                        "border text-sm",
                        selectedDeployment.qaResult === "Passed"
                          ? "bg-green-500/10 text-green-400 border-green-500/30"
                          : "bg-red-500/10 text-red-400 border-red-500/30"
                      )}
                    >
                      {selectedDeployment.qaResult === "Passed" ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          {selectedDeployment.qaResult}
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {selectedDeployment.qaResult}
                        </>
                      )}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* DEPLOYMENT STEPS */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle>Deployment Pipeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedDeployment.steps.map((step, idx) => (
                    <div key={step.id}>
                      <button
                        onClick={() => {
                          // Step expansion logic can be added here
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-lg border flex items-center justify-between transition-all",
                          step.status === "success"
                            ? "bg-green-500/5 border-green-500/20"
                            : step.status === "running"
                              ? "bg-gray-800/50 border-gray-700"
                              : step.status === "failed"
                                ? "bg-red-500/5 border-red-500/20"
                                : "bg-gray-900/50 border-gray-800"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(step.status)}
                          <div>
                            <p className="font-bold text-white text-sm">{step.name}</p>
                            <p className="text-xs text-gray-400">
                              {step.duration > 0 ? `${step.duration}s` : "pending"}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </button>

                      {/* Step connector */}
                      {idx < selectedDeployment.steps.length - 1 && (
                        <div className="flex justify-center py-1">
                          <div className="w-0.5 h-4 bg-gray-700" />
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* DEPLOYMENT CONTROLS */}
              <div className="flex gap-3">
                {selectedDeployment.status !== "Ready" && selectedDeployment.status !== "Failed" && (
                  <Button
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel Deployment
                  </Button>
                )}
                <Button className="bg-white hover:bg-gray-100 text-black flex-1 sm:flex-none">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Redeploy
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ENVIRONMENTS SECTION */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Environment Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {environments.map((env) => (
              <Card key={env.name} className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-white" />
                    {env.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">Current Status</p>
                    <Badge className={cn("border text-sm", getStatusColor(env.deployment.status))}>
                      {getStatusIcon(env.deployment.status)}
                      <span className="ml-2">{env.deployment.status}</span>
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between text-gray-300">
                      <span className="text-gray-400">Last deployed:</span>
                      <span className="font-mono text-xs">{formatTimeAgo(env.deployment.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300">
                      <span className="text-gray-400">Branch:</span>
                      <span className="font-mono text-xs">{env.deployment.branch}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300">
                      <span className="text-gray-400">QA Result:</span>
                      <span
                        className={cn(
                          "font-mono text-xs bold",
                          env.deployment.qaResult === "Passed"
                            ? "text-green-400"
                            : "text-red-400"
                        )}
                      >
                        {env.deployment.qaResult === "Passed" ? "✓" : "✗"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDeployment(env.deployment)}
                    className="w-full px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs font-bold text-white transition-all"
                  >
                    View Details
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* LOGS VIEWER */}
        {selectedDeployment && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-white" />
                Live Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black/60 p-4 rounded-lg border border-gray-800 font-mono text-sm text-green-400 max-h-64 overflow-y-auto space-y-1">
                {logs.length > 0 ? (
                  logs.map((log, idx) => (
                    <div key={idx} className={cn(
                      log.startsWith("✓") ? "text-green-400" :
                      log.startsWith("✗") || log.startsWith("FAIL") ? "text-red-400" :
                      log.startsWith("[") ? "text-white font-bold" :
                      log.includes("error") || log.includes("Error") ? "text-red-400" :
                      "text-green-400"
                    )}>
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No logs available</div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
