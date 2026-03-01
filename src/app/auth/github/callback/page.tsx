"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  AlertCircle,
  Loader,
  Github,
  Lock,
  Shield,
  ArrowRight,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function GitHubCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"connecting" | "success" | "error">(
    "connecting"
  )
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("Connecting to GitHub...")

  useEffect(() => {
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    // Simulate OAuth flow
    const steps = [
      {
        progress: 20,
        message: "🔗 Received authorization code from GitHub",
      },
      {
        progress: 40,
        message: "🔐 Exchanging code for access token",
      },
      {
        progress: 60,
        message: "👤 Fetching GitHub user information",
      },
      {
        progress: 80,
        message: "📦 Loading your repositories",
      },
      {
        progress: 100,
        message: "✅ Authorization successful!",
      },
    ]

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep]
        setProgress(step.progress)
        setMessage(step.message)
        currentStep++
      } else {
        clearInterval(interval)
        setStatus("success")
      }
    }, 800)

    return () => clearInterval(interval)
  }, [searchParams])

  if (status === "connecting") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="bg-gray-900/50 border-gray-800 w-full max-w-md">
          <CardContent className="pt-8 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
                  <div className="flex items-center justify-center h-full">
                    <Loader className="w-8 h-8 text-white animate-spin" />
                  </div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-white">
                  Connecting to GitHub
                </h2>
                <p className="text-sm text-gray-400">{message}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Authorization Progress</span>
                  <span className="text-white font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700">
                  <div
                    className="h-full bg-gradient-to-r from-white to-gray-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* SECURITY INFO */}
            <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/20 space-y-2">
              <p className="text-xs font-bold text-green-400 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Secure Connection
              </p>
              <ul className="text-xs text-green-300/80 space-y-1 ml-2">
                <li>✓ Your token is never stored in logs</li>
                <li>✓ End-to-end encrypted communication</li>
                <li>✓ OAuth 2.0 secure flow</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="bg-gray-900/50 border-gray-800 w-full max-w-md">
          <CardContent className="pt-8 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">
                  Connected Successfully!
                </h2>
                <p className="text-sm text-gray-400">
                  Your GitHub account is now linked with NexOra Ai
                </p>
              </div>

              {/* SUCCESS DETAILS */}
              <div className="space-y-2 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">GitHub Account</span>
                  <span className="font-bold text-white flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    NEERASA-VEDA-VARSHIT
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Repositories</span>
                  <Badge className="bg-blue-500/20 text-blue-400">2 connected</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <Badge className="bg-green-500/20 text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Ready
                  </Badge>
                </div>
              </div>

              {/* AUTO-FEATURES */}
              <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-2">
                <p className="text-xs font-bold text-white">
                  🤖 AI Features Now Available:
                </p>
                <ul className="text-xs text-gray-300 space-y-1 ml-2">
                  <li>✓ Automatic repository analysis</li>
                  <li>✓ AI-powered deployment recommendations</li>
                  <li>✓ Secure environment variable management</li>
                  <li>✓ One-click automated deployments</li>
                </ul>
              </div>

              <Button
                onClick={() => router.push("/ai-deploy")}
                className="w-full bg-white hover:bg-gray-100 text-black font-bold py-3 flex items-center justify-center gap-2"
              >
                Go to AI Deployment
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => router.push("/settings/integrations")}
                variant="outline"
                className="w-full border-gray-700 text-gray-200 hover:bg-gray-900"
              >
                Manage Integrations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="bg-gray-900/50 border-red-500/20 w-full max-w-md">
        <CardContent className="pt-8 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Connection Failed</h2>
              <p className="text-sm text-gray-400">
                Unable to authorize GitHub connection. Please try again.
              </p>
            </div>

            <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20 text-xs text-red-300 space-y-1">
              <p className="font-bold">Troubleshooting:</p>
              <ul className="ml-2 space-y-1">
                <li>• Check your internet connection</li>
                <li>• Ensure you approved the app authorization</li>
                <li>• Try again in a few moments</li>
              </ul>
            </div>

            <Button
              onClick={() => router.push("/settings/integrations")}
              className="w-full bg-white hover:bg-gray-100 text-black font-bold"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
