"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Zap,
  Brain,
  CheckCircle2,
  AlertCircle,
  Loader,
  GitBranch,
  Code2,
  Cog,
  Lightbulb,
  Lock,
  Clock,
  ExternalLink,
  Plus,
  RefreshCw,
  Shield,
  Play,
  Pause,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AIDeployConfig {
  id: string
  repoName: string
  owner: string
  branch: string
  lastRun?: Date
  autoAnalyze: boolean
  status: "idle" | "analyzing" | "configuring" | "deploying" | "error"
  aiInsights: {
    detectedFramework: string
    detectedEnvVars: string[]
    recommendations: string[]
    estimatedDeployTime: number
  }
}

interface AIDeploymentRun {
  id: string
  repoName: string
  branch: string
  timestamp: Date
  status: "analyzing" | "configuring" | "deploying" | "success" | "failed"
  aiPhase: string
  progress: number
  insights: string[]
}

export default function AIDeploymentPage() {
  const [selectedConfig, setSelectedConfig] = useState<string>("config-1")
  const [deploymentRuns, setDeploymentRuns] = useState<AIDeploymentRun[]>([
    {
      id: "run-1",
      repoName: "my-app",
      branch: "main",
      timestamp: new Date(Date.now() - 3 * 60000),
      status: "success",
      aiPhase: "Deployed",
      progress: 100,
      insights: [
        "✅ Detected Next.js 14 with TypeScript",
        "✅ Found 4 env vars, all configured securely",
        "✅ Optimized for cold start (2.3s → 1.8s)",
        "✅ Auto-implemented caching strategy",
      ],
    },
    {
      id: "run-2",
      repoName: "my-app",
      branch: "develop",
      timestamp: new Date(Date.now() - 15 * 60000),
      status: "success",
      aiPhase: "Deployed",
      progress: 100,
      insights: [
        "✅ Analyzed codebase structure",
        "✅ Detected API dependencies",
        "✅ Setup preview environment",
      ],
    },
    {
      id: "run-3",
      repoName: "my-app",
      branch: "feature/ai-sdk",
      timestamp: new Date(Date.now() - 45 * 60000),
      status: "failed",
      aiPhase: "Deployment failed",
      progress: 70,
      insights: [
        "❌ Missing GROQ_API_KEY in production env",
        "⚠️  Database migration detected, manual approval needed",
        "💡 Suggestion: Add DB migration step to deploy pipeline",
      ],
    },
  ])

  const aiConfigs: AIDeployConfig[] = [
    {
      id: "config-1",
      repoName: "my-app",
      owner: "NEERASA-VEDA-VARSHIT",
      branch: "main",
      lastRun: new Date(Date.now() - 3 * 60000),
      autoAnalyze: true,
      status: "idle",
      aiInsights: {
        detectedFramework: "Next.js 14 + TypeScript",
        detectedEnvVars: [
          "DATABASE_URL",
          "GROQ_API_KEY",
          "NEXTAUTH_SECRET",
          "NEXT_PUBLIC_API_URL",
        ],
        recommendations: [
          "Add caching layer for /api endpoints",
          "Implement database connection pooling",
          "Setup CDN for static assets",
          "Configure automated backups",
        ],
        estimatedDeployTime: 180,
      },
    },
    {
      id: "config-2",
      repoName: "code-editor",
      owner: "NEERASA-VEDA-VARSHIT",
      branch: "develop",
      autoAnalyze: true,
      status: "idle",
      aiInsights: {
        detectedFramework: "React + Vite",
        detectedEnvVars: ["VITE_API_URL", "VITE_AUTH_TOKEN"],
        recommendations: [
          "Setup code splitting for better performance",
          "Add service worker for offline support",
          "Configure gzip compression",
        ],
        estimatedDeployTime: 120,
      },
    },
  ]

  const selectedConfigData = aiConfigs.find((c) => c.id === selectedConfig)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployProgress, setDeployProgress] = useState(0)
  const [deployPhase, setDeployPhase] = useState("")

  const handleAISimulatedDeploy = async () => {
    setIsDeploying(true)
    setDeployProgress(0)

    const phases = [
      "🔍 Analyzing repository structure...",
      "🧠 Running AI security scan...",
      "⚙️ Detecting dependencies and configuration...",
      "🔐 Validating environment variables...",
      "📦 Optimizing build process...",
      "🚀 Deploying to production...",
      "✅ Running health checks...",
    ]

    for (let i = 0; i < phases.length; i++) {
      setDeployPhase(phases[i])
      await new Promise((r) => setTimeout(r, 1500))
      setDeployProgress(((i + 1) / phases.length) * 100)
    }

    setIsDeploying(false)
    setDeployProgress(0)
    setDeployPhase("")
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Brain className="w-8 h-8 text-white" />
            AI-Automated Deployments
          </h1>
          <p className="text-gray-400">
            Connect GitHub, AI analyzes your code, deploys automatically (like Render/Vercel)
          </p>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: REPO CONFIGS */}
          <div className="space-y-4">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-white" />
                  Connected Repos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {aiConfigs.map((config) => (
                  <button
                    key={config.id}
                    onClick={() => setSelectedConfig(config.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-all",
                      selectedConfig === config.id
                        ? "bg-white/10 border-white/40"
                        : "bg-gray-900/30 border-gray-800 hover:bg-gray-900/50"
                    )}
                  >
                    <p className="font-bold text-white text-sm">{config.repoName}</p>
                    <p className="text-xs text-gray-400 mb-2">{config.owner}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-gray-500">
                        <GitBranch className="w-3 h-3" />
                        {config.branch}
                      </span>
                      <Badge className={cn(
                        "text-[10px]",
                        config.status === "idle"
                          ? "bg-gray-700 text-gray-300"
                          : config.status === "analyzing"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-green-500/20 text-green-400"
                      )}>
                        {config.status === "idle" ? "Ready" : config.status}
                      </Badge>
                    </div>
                    {config.lastRun && (
                      <p className="text-xs text-gray-500 mt-2">
                        Deployed {new Date(config.lastRun).toLocaleTimeString()}
                      </p>
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* AUTO-DEPLOY TOGGLE */}
            {selectedConfigData && (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-sm">Auto-Deploy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-white" />
                      <span className="text-sm text-white font-bold">AI Auto-Deploy</span>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={selectedConfigData.autoAnalyze}
                      className="w-4 h-4"
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    Automatically analyze and deploy on every push to {selectedConfigData.branch}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* CENTER: AI ANALYSIS & DEPLOY */}
          <div className="lg:col-span-2 space-y-6">
            {selectedConfigData && (
              <>
                {/* AI INSIGHTS */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-white" />
                      AI Analysis
                    </CardTitle>
                    <CardDescription>
                      Detected configuration & recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* DETECTED FRAMEWORK */}
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                        Framework Detected
                      </p>
                      <p className="text-lg font-bold text-white">
                        {selectedConfigData.aiInsights.detectedFramework}
                      </p>
                    </div>

                    {/* ENV VARS */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold mb-2">
                        Required Environment Variables
                      </p>
                      <div className="space-y-2">
                        {selectedConfigData.aiInsights.detectedEnvVars.map((env) => (
                          <div
                            key={env}
                            className="flex items-center gap-2 p-2 bg-gray-900 rounded border border-gray-800 text-sm"
                          >
                            <Lock className="w-4 h-4 text-green-400" />
                            <span className="font-mono text-gray-300">{env}</span>
                            <Badge className="bg-green-500/20 text-green-400 text-[10px] ml-auto">
                              Configured
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI RECOMMENDATIONS */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold mb-2">
                        AI Recommendations
                      </p>
                      <div className="space-y-2">
                        {selectedConfigData.aiInsights.recommendations.map((rec, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 p-2 bg-yellow-500/5 rounded border border-yellow-500/20 text-sm"
                          >
                            <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                            <span className="text-yellow-300">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DEPLOY ESTIMATE */}
                    <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">Estimated Deploy Time</span>
                      </div>
                      <span className="font-bold text-white">
                        ~{selectedConfigData.aiInsights.estimatedDeployTime}s
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* DEPLOY BUTTON */}
                {!isDeploying && (
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="pt-6">
                      <Button
                        onClick={handleAISimulatedDeploy}
                        className="w-full bg-white hover:bg-gray-100 text-black font-bold py-6 text-lg flex items-center justify-center gap-3"
                      >
                        <Zap className="w-5 h-5" />
                        Launch AI-Powered Deployment
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                      <p className="text-xs text-gray-400 mt-3 text-center">
                        AI will analyze, configure, and deploy your application automatically
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* DEPLOY PROGRESS */}
                {isDeploying && (
                  <Card className="bg-green-500/10 border-green-500/30">
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-white flex items-center gap-2">
                          <Loader className="w-4 h-4 animate-spin text-green-400" />
                          {deployPhase || "Initializing..."}
                        </p>
                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700">
                          <div
                            className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-300"
                            style={{ width: `${deployProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 text-right">
                          {Math.round(deployProgress)}%
                        </p>
                      </div>

                      <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800 max-h-48 overflow-y-auto">
                        <p className="text-xs font-mono text-green-400">
                          <span className="text-gray-500">$ </span>
                          AI Deployment Process Active
                          <br />
                          <span className="text-blue-400">• Repository analyzed</span>
                          <br />
                          <span className="text-blue-400">• Dependencies detected</span>
                          <br />
                          <span className="text-blue-400">• Environment configured</span>
                          <br />
                          <span className="text-blue-400">• Deploying to production...</span>
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full border-gray-700 text-gray-200 hover:bg-gray-900"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Cancel Deployment
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>

        {/* DEPLOYMENT HISTORY */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Deployment History</CardTitle>
              <Badge className="bg-gray-700 text-gray-300">
                {deploymentRuns.length} deployments
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deploymentRuns.map((run) => (
                <div
                  key={run.id}
                  className="p-4 rounded-lg border border-gray-800 bg-gray-900/30 hover:bg-gray-900/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-white">{run.repoName}</p>
                        <Badge className="bg-gray-700 text-gray-300">
                          <GitBranch className="w-3 h-3 mr-1" />
                          {run.branch}
                        </Badge>
                        <Badge
                          className={cn(
                            "text-[10px]",
                            run.status === "success"
                              ? "bg-green-500/20 text-green-400"
                              : run.status === "failed"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-blue-500/20 text-blue-400"
                          )}
                        >
                          {run.status === "success" && (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                            </>
                          )}
                          {run.status === "failed" && (
                            <>
                              <AlertCircle className="w-3 h-3 mr-1" />
                            </>
                          )}
                          {run.status === "deploying" && (
                            <>
                              <Loader className="w-3 h-3 mr-1 animate-spin" />
                            </>
                          )}
                          {run.aiPhase}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(run.timestamp).toLocaleString()}
                      </p>
                    </div>

                    {/* PROGRESS BAR */}
                    <div className="flex items-center gap-2 ml-4">
                      <div className="w-24 bg-gray-800 rounded-full h-1.5 overflow-hidden border border-gray-700">
                        <div
                          className={cn(
                            "h-full transition-all",
                            run.status === "success"
                              ? "bg-green-400"
                              : run.status === "failed"
                              ? "bg-red-400"
                              : "bg-blue-400"
                          )}
                          style={{ width: `${run.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-400 w-8">
                        {run.progress}%
                      </span>
                    </div>
                  </div>

                  {/* INSIGHTS */}
                  <div className="space-y-1 text-xs text-gray-400">
                    {run.insights.map((insight, i) => (
                      <p key={i} className="ml-2">
                        {insight}
                      </p>
                    ))}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-800">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 text-[12px]"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Redeploy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 text-[12px]"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                    {run.status === "failed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-700/50 text-red-400 hover:bg-red-500/10 text-[12px] ml-auto"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* INFO SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Code2 className="w-5 h-5 text-white mt-1 shrink-0" />
                <div>
                  <p className="font-bold text-white mb-1">Repository Analysis</p>
                  <p className="text-xs text-gray-400">
                    AI analyzes your codebase, detects framework, dependencies, and configuration
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-500/5 border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Cog className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                <div>
                  <p className="font-bold text-white mb-1">Auto Configuration</p>
                  <p className="text-xs text-gray-400">
                    Environment variables, build settings, and deployment configured automatically
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-500/5 border-purple-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-purple-400 mt-1 shrink-0" />
                <div>
                  <p className="font-bold text-white mb-1">Secure Secrets</p>
                  <p className="text-xs text-gray-400">
                    All environment variables encrypted and securely stored, never logged
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
