"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Github,
  Lock,
  Plus,
  Settings,
  Trash2,
  Code,
  GitBranch,
  Zap,
  Shield,
  Key,
  Link as LinkIcon,
  Database,
  Mail,
  FileCode,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface EnvVariable {
  id: string
  key: string
  value: string
  isHidden: boolean
  isSecure: boolean
}

interface ConnectedRepo {
  id: string
  name: string
  owner: string
  url: string
  branch: string
  isConnected: boolean
  lastDeploy?: Date
}

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<"github" | "env">("github")
  const [showGithubConnectModal, setShowGithubConnectModal] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [selectedRepo, setSelectedRepo] = useState<ConnectedRepo | null>(null)

  const [envVariables, setEnvVariables] = useState<EnvVariable[]>([
    {
      id: "1",
      key: "DATABASE_URL",
      value: "postgresql://user:pass@localhost:5432/db",
      isHidden: true,
      isSecure: true,
    },
    {
      id: "2",
      key: "NEXT_PUBLIC_API_URL",
      value: "https://api.nexora.ai/v1",
      isHidden: false,
      isSecure: false,
    },
    {
      id: "3",
      key: "GROQ_API_KEY",
      value: "gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      isHidden: true,
      isSecure: true,
    },
    {
      id: "4",
      key: "NEXTAUTH_SECRET",
      value: "your-secret-key-here",
      isHidden: true,
      isSecure: true,
    },
  ])

  const [newEnvKey, setNewEnvKey] = useState("")
  const [newEnvValue, setNewEnvValue] = useState("")
  const [showNewValue, setShowNewValue] = useState(false)

  const connectedRepos: ConnectedRepo[] = [
    {
      id: "repo-1",
      name: "my-app",
      owner: "NEERASA-VEDA-VARSHIT",
      url: "https://github.com/NEERASA-VEDA-VARSHIT/my-app",
      branch: "main",
      isConnected: true,
      lastDeploy: new Date(Date.now() - 2 * 60000),
    },
    {
      id: "repo-2",
      name: "code-editor",
      owner: "NEERASA-VEDA-VARSHIT",
      url: "https://github.com/NEERASA-VEDA-VARSHIT/code-editor",
      branch: "develop",
      isConnected: true,
      lastDeploy: new Date(Date.now() - 45 * 60000),
    },
  ]

  const toggleEnvVisibility = (id: string) => {
    setEnvVariables(
      envVariables.map((env) =>
        env.id === id ? { ...env, isHidden: !env.isHidden } : env
      )
    )
  }

  const deleteEnvVariable = (id: string) => {
    setEnvVariables(envVariables.filter((env) => env.id !== id))
  }

  const addEnvVariable = () => {
    if (newEnvKey && newEnvValue) {
      const newId = Date.now().toString()
      setEnvVariables([
        ...envVariables,
        {
          id: newId,
          key: newEnvKey,
          value: newEnvValue,
          isHidden: true,
          isSecure: true,
        },
      ])
      setNewEnvKey("")
      setNewEnvValue("")
      setShowNewValue(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleGithubConnect = () => {
    // Simulate GitHub OAuth flow
    setIsConnected(true)
    setShowGithubConnectModal(false)
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Integrations & Settings
          </h1>
          <p className="text-gray-400">
            Connect GitHub, manage environment variables, and configure automated deployments
          </p>
        </div>

        {/* TABS */}
        <div className="flex gap-2 border-b border-gray-800">
          <button
            onClick={() => setActiveTab("github")}
            className={cn(
              "px-6 py-3 font-bold text-sm transition-all border-b-2",
              activeTab === "github"
                ? "text-white border-white"
                : "text-gray-400 border-transparent hover:text-gray-300"
            )}
          >
            <Github className="w-4 h-4 inline mr-2" />
            GitHub Integration
          </button>
          <button
            onClick={() => setActiveTab("env")}
            className={cn(
              "px-6 py-3 font-bold text-sm transition-all border-b-2",
              activeTab === "env"
                ? "text-white border-white"
                : "text-gray-400 border-transparent hover:text-gray-300"
            )}
          >
            <Key className="w-4 h-4 inline mr-2" />
            Environment Variables
          </button>
        </div>

        {/* GITHUB INTEGRATION TAB */}
        {activeTab === "github" && (
          <div className="space-y-6">
            {/* CONNECTION STATUS */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="w-5 h-5 text-white" />
                  GitHub Connection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full",
                        isConnected ? "bg-green-400" : "bg-red-400"
                      )}
                    />
                    <div>
                      <p className="font-bold text-white">
                        {isConnected
                          ? "Connected to GitHub"
                          : "Not Connected"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {isConnected
                          ? "Account: NEERASA-VEDA-VARSHIT"
                          : "Connect your GitHub account"}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowGithubConnectModal(true)}
                    className={cn(
                      isConnected
                        ? "bg-red-600 hover:bg-red-500"
                        : "bg-white hover:bg-gray-100",
                      isConnected ? "text-white" : "text-black",
                      "font-bold"
                    )}
                  >
                    {isConnected ? "Disconnect" : "Connect GitHub"}
                  </Button>
                </div>

                <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-300">
                  <p className="font-bold mb-2">ℹ️ How it works:</p>
                  <ul className="space-y-1 text-xs ml-2">
                    <li>• Connect your GitHub account using OAuth</li>
                    <li>• Authorize NexOra Ai to access your repositories</li>
                    <li>• Select repos for AI-automated deployments</li>
                    <li>• Your env files and secrets are stored securely</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* CONNECTED REPOSITORIES */}
            {isConnected && (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Connected Repositories</CardTitle>
                    <Button
                      size="sm"
                      className="bg-white hover:bg-gray-100 text-black flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Repository
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {connectedRepos.map((repo) => (
                    <button
                      key={repo.id}
                      onClick={() => setSelectedRepo(repo)}
                      className={cn(
                        "w-full text-left p-4 rounded-lg border transition-all",
                        selectedRepo?.id === repo.id
                          ? "bg-gray-800 border-gray-700"
                          : "bg-gray-900/50 border-gray-800 hover:bg-gray-900/70"
                      )}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-white flex items-center gap-2">
                            <Github className="w-4 h-4" />
                            {repo.name}
                          </p>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Connected
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400">{repo.owner}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <GitBranch className="w-3 h-3" />
                            {repo.branch}
                          </span>
                          {repo.lastDeploy && (
                            <span>
                              Last deployed:{" "}
                              {new Date(repo.lastDeploy).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* DEPLOYMENT CONFIGURATION */}
            {selectedRepo && (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle>Deployment Configuration</CardTitle>
                  <CardDescription>For {selectedRepo.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">
                        Repository URL
                      </label>
                      <div className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-300 font-mono flex items-center justify-between">
                        <span>{selectedRepo.url}</span>
                        <button
                          onClick={() => copyToClipboard(selectedRepo.url)}
                          className="hover:text-white transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">
                        Default Branch
                      </label>
                      <div className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-300 font-mono flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-white" />
                        {selectedRepo.branch}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">
                      Auto-Deploy on Push
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4"
                      />
                      <p className="text-sm text-gray-300">
                        Automatically deploy when code is pushed to the default branch
                      </p>
                    </div>
                  </div>

                  <Button className="w-full bg-white hover:bg-gray-100 text-black font-bold">
                    <Zap className="w-4 h-4 mr-2" />
                    Save Configuration
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ENVIRONMENT VARIABLES TAB */}
        {activeTab === "env" && (
          <div className="space-y-6">
            {/* SECURITY INFO */}
            <Card className="bg-green-500/5 border-green-500/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-green-400 mb-1">Secure Environment Storage</p>
                    <p className="text-sm text-gray-300">
                      All environment variables are encrypted at rest and transmitted securely.
                      Sensitive values are hidden by default and never logged.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ADD NEW VARIABLE */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-white" />
                  Add Environment Variable
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">
                      Variable Key
                    </label>
                    <Input
                      placeholder="DATABASE_URL"
                      value={newEnvKey}
                      onChange={(e) => setNewEnvKey(e.target.value)}
                      className="bg-gray-900 border-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">
                      Value
                    </label>
                    <div className="relative">
                      <input
                        type={showNewValue ? "text" : "password"}
                        placeholder="your-secret-value"
                        value={newEnvValue}
                        onChange={(e) => setNewEnvValue(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/50"
                      />
                      <button
                        onClick={() => setShowNewValue(!showNewValue)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showNewValue ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={addEnvVariable}
                  disabled={!newEnvKey || !newEnvValue}
                  className="w-full bg-white hover:bg-gray-100 text-black disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variable
                </Button>
              </CardContent>
            </Card>

            {/* EXISTING VARIABLES */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Configured Variables</CardTitle>
                <CardDescription>
                  {envVariables.length} variables set
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {envVariables.map((env) => (
                  <div
                    key={env.id}
                    className="p-4 rounded-lg border border-gray-800 bg-gray-900/30 hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-mono font-bold text-white">{env.key}</p>
                          {env.isSecure && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">
                              <Lock className="w-2.5 h-2.5 mr-1" />
                              Secure
                            </Badge>
                          )}
                        </div>
                        <p
                          className={cn(
                            "font-mono text-sm",
                            env.isHidden ? "text-gray-500" : "text-gray-300"
                          )}
                        >
                          {env.isHidden
                            ? "•".repeat(Math.min(env.value.length, 20))
                            : env.value}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleEnvVisibility(env.id)}
                          className="p-2 hover:bg-gray-800 rounded transition-colors text-gray-400 hover:text-gray-300"
                        >
                          {env.isHidden ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(env.value)}
                          className="p-2 hover:bg-gray-800 rounded transition-colors text-gray-400 hover:text-gray-300"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEnvVariable(env.id)}
                          className="p-2 hover:bg-red-500/10 rounded transition-colors text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* ENV FILE UPLOAD */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-white" />
                  Import from .env File
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-400">
                  Upload your .env file to automatically import all variables. Sensitive values will be marked as secure.
                </p>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-white/40 transition-colors cursor-pointer">
                  <Database className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                  <p className="font-bold text-white mb-1">Drop .env file here</p>
                  <p className="text-xs text-gray-400">or click to select file</p>
                </div>
              </CardContent>
            </Card>

            {/* DEPLOYMENT ENVIRONMENTS */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Deployment Environments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Production", "Preview", "Development"].map((env) => (
                  <div
                    key={env}
                    className="p-3 rounded-lg border border-gray-800 bg-gray-900/30 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Server className="w-4 h-4 text-white" />
                      <p className="text-sm font-bold text-white">{env}</p>
                    </div>
                    <Badge variant="outline" className="border-gray-700 text-gray-400">
                      {envVariables.length} vars
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* GITHUB CONNECT MODAL */}
      {showGithubConnectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-900 border-gray-800 w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                Connect GitHub
              </CardTitle>
              <CardDescription>
                Authorize NexOra Ai to access your repositories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-300 space-y-2">
                <p className="font-bold">Permissions requested:</p>
                <ul className="text-xs ml-2 space-y-1">
                  <li>• Read access to repositories</li>
                  <li>• Webhook access for auto-deploy</li>
                  <li>• No write access to code</li>
                </ul>
              </div>

              <Button
                onClick={handleGithubConnect}
                className="w-full bg-white hover:bg-gray-100 text-black font-bold flex items-center justify-center gap-2"
              >
                <Github className="w-4 h-4" />
                Continue with GitHub
              </Button>

              <Button
                onClick={() => setShowGithubConnectModal(false)}
                variant="outline"
                className="w-full border-gray-700 text-gray-200 hover:bg-gray-900"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

const Server = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <rect x="2" y="2" width="20" height="8" />
    <rect x="2" y="14" width="20" height="8" />
    <line x1="6" y1="6" x2="6" y2="6.01" />
    <line x1="6" y1="18" x2="6" y2="18.01" />
  </svg>
)
