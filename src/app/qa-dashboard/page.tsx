"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle2,
  AlertCircle,
  XCircle,
  Zap,
  Shield,
  Code,
  BarChart3,
  Clock,
  ChevronDown,
  ChevronUp,
  Radio,
  Download,
  Repeat2,
  Terminal,
  GitBranch,
  GitCommit,
} from "lucide-react"
import { cn } from "@/lib/utils"


interface TestResult {
  id: string
  name: string
  status: "PASS" | "FAIL" | "WARNING"
  duration: number
  details: string[]
}

interface QAMetric {
  label: string
  value: number
  icon: React.ReactNode
  color: "green" | "yellow" | "red"
}

export default function QADashboard() {
  const [hasFailure, setHasFailure] = useState(false)
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set())
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])

  // Initialize test results
  useEffect(() => {
    initializeTests()
  }, [hasFailure])

  const initializeTests = () => {
    const baseTests: TestResult[] = [
      {
        id: "lint",
        name: "Linting (ESLint)",
        status: "PASS",
        duration: 2.3,
        details: [
          "✓ 0 errors found",
          "✓ 0 warnings in production code",
          "✓ All rules configured correctly",
          "✓ Import ordering verified",
          "✓ Type safety passed",
        ],
      },
      {
        id: "unit",
        name: "Unit Tests (Jest)",
        status: "PASS",
        duration: 5.8,
        details: [
          "✓ 89 tests passed",
          "✓ 0 tests failed",
          "✓ 156 assertions verified",
          "✓ Average execution time: 2.3ms/test",
          "✓ Memory footprint: 45MB",
        ],
      },
      {
        id: "integration",
        name: "Integration Tests",
        status: "PASS",
        duration: 8.2,
        details: [
          "✓ 34 integration tests passed",
          "✓ API endpoints validated",
          "✓ Database transactions tested",
          "✓ Service decomposition verified",
          "✓ Error handling confirmed",
        ],
      },
      {
        id: "performance",
        name: "Performance Tests",
        status: hasFailure ? "FAIL" : "PASS",
        duration: 3.5,
        details: hasFailure
          ? [
              "✗ Largest Contentful Paint (LCP) exceeded threshold",
              "  Expected: < 2.5s | Actual: 3.2s",
              "✗ First Input Delay (FID) suboptimal",
              "  Expected: < 100ms | Actual: 145ms",
              "⚠ Cumulative Layout Shift (CLS): 0.08 ✓",
            ]
          : [
              "✓ Largest Contentful Paint (LCP): 1.8s",
              "✓ First Input Delay (FID): 45ms",
              "✓ Cumulative Layout Shift (CLS): 0.05",
              "✓ Time to First Byte (TTFB): 0.3s",
              "✓ Core Web Vitals: All PASS",
            ],
      },
      {
        id: "security",
        name: "Security Scan",
        status: "PASS",
        duration: 4.1,
        details: [
          "✓ 0 critical vulnerabilities",
          "✓ 0 high-severity issues",
          "✓ OWASP Top 10: Clear",
          "✓ Dependency scan: 142 packages audited",
          "✓ Secret scanning: No exposed credentials",
        ],
      },
      {
        id: "ai-risk",
        name: "AI Risk Analysis",
        status: "PASS",
        duration: 2.9,
        details: [
          "✓ Code quality score: 94%",
          "✓ Architecture stability: 96%",
          "✓ No hallucinated dependencies detected",
          "✓ Service decomposition verified",
          "✓ Type safety coverage: 98%",
        ],
      },
    ]

    setTestResults(baseTests)
  }

  const toggleTest = (testId: string) => {
    const newExpanded = new Set(expandedTests)
    if (newExpanded.has(testId)) {
      newExpanded.delete(testId)
    } else {
      newExpanded.add(testId)
    }
    setExpandedTests(newExpanded)
  }

  const runTests = async () => {
    setIsRunning(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    initializeTests()
    setIsRunning(false)
  }

  const allTestsPassed = testResults.every((test) => test.status === "PASS")
  const failedTests = testResults.filter((test) => test.status === "FAIL")
  const warningTests = testResults.filter((test) => test.status === "WARNING")

  const metrics: QAMetric[] = [
    {
      label: "Code Quality",
      value: hasFailure ? 87 : 94,
      icon: <Code className="w-5 h-5" />,
      color: hasFailure ? "yellow" : "green",
    },
    {
      label: "Test Coverage",
      value: 89,
      icon: <BarChart3 className="w-5 h-5" />,
      color: "green",
    },
    {
      label: "Performance Score",
      value: hasFailure ? 72 : 91,
      icon: <Zap className="w-5 h-5" />,
      color: hasFailure ? "red" : "green",
    },
    {
      label: "Security Status",
      value: 100,
      icon: <Shield className="w-5 h-5" />,
      color: "green",
    },
    {
      label: "AI Risk Score",
      value: 96,
      icon: <AlertCircle className="w-5 h-5" />,
      color: "green",
    },
  ]

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">QA Dashboard</h1>
              <p className="text-gray-400 mt-1">Automated Quality Assurance & Continuous Testing</p>
            </div>
            <div className="text-right">
              <Badge className={cn(
                "px-4 py-2 text-base font-bold",
                allTestsPassed 
                  ? "bg-green-500/20 text-green-400 border-green-500/40" 
                  : "bg-red-500/20 text-red-400 border-red-500/40"
              )}>
                {allTestsPassed ? "✓ ALL PASS" : "✗ BLOCKED"}
              </Badge>
            </div>
          </div>

          {/* BUILD INFO */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase font-bold">Build ID</p>
                  <p className="text-sm font-mono text-gray-200">build-v2-026-qa</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase font-bold flex items-center gap-2">
                    <GitBranch className="w-3 h-3" />
                    Branch
                  </p>
                  <p className="text-sm font-mono text-gray-200">feature/qa-automation</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase font-bold flex items-center gap-2">
                    <GitCommit className="w-3 h-3" />
                    Commit
                  </p>
                  <p className="text-sm font-mono text-gray-200">a3f7e9c</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase font-bold flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Time
                  </p>
                  <p className="text-sm font-mono text-gray-200">
                    {new Date().toLocaleTimeString([], { hour12: false })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* DEPLOYMENT GATE BANNER */}
        <div className={cn(
          "px-6 py-4 rounded-xl border-2 flex items-center justify-between",
          allTestsPassed
            ? "bg-green-500/10 border-green-500/40"
            : "bg-red-500/10 border-red-500/40"
        )}>
          <div className="flex items-center gap-4">
            {allTestsPassed ? (
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            ) : (
              <XCircle className="w-8 h-8 text-red-400" />
            )}
            <div>
              <h2 className={cn(
                "text-xl font-bold",
                allTestsPassed ? "text-green-400" : "text-red-400"
              )}>
                {allTestsPassed ? "Deployment Approved ✓" : "Deployment Blocked ✗"}
              </h2>
              <p className="text-sm text-gray-300 mt-1">
                {allTestsPassed
                  ? "All quality checks passed. Ready for production deployment."
                  : `${failedTests.length} critical check(s) failed. Fix before deploying.`}
              </p>
            </div>
          </div>
          <Button
            onClick={runTests}
            disabled={isRunning}
            className="bg-white hover:bg-gray-100 text-black font-bold flex items-center gap-2"
          >
            <Repeat2 className={cn("w-4 h-4", isRunning && "animate-spin")} />
            {isRunning ? "Running..." : "Re-run Tests"}
          </Button>
        </div>

        {/* QUALITY METRICS */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Quality Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {metrics.map((metric, i) => (
              <Card key={i} className="bg-gray-900/50 border-gray-800">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-500 uppercase font-bold">{metric.label}</p>
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center",
                      metric.color === "green" ? "bg-green-500/10 text-green-400" :
                      metric.color === "yellow" ? "bg-yellow-500/10 text-yellow-400" :
                      "bg-red-500/10 text-red-400"
                    )}>
                      {metric.icon}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-white">{metric.value}%</div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          metric.color === "green" ? "bg-green-500" :
                          metric.color === "yellow" ? "bg-yellow-500" :
                          "bg-red-500"
                        )}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* TEST RESULTS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Test Results</h2>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="border-green-500/40 text-green-400 bg-green-500/10">
                {testResults.filter(t => t.status === "PASS").length} passed
              </Badge>
              {failedTests.length > 0 && (
                <Badge variant="outline" className="border-red-500/40 text-red-400 bg-red-500/10">
                  {failedTests.length} failed
                </Badge>
              )}
              {warningTests.length > 0 && (
                <Badge variant="outline" className="border-yellow-500/40 text-yellow-400 bg-yellow-500/10">
                  {warningTests.length} warning
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {testResults.map((test) => (
              <div key={test.id}>
                <button
                  onClick={() => toggleTest(test.id)}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border flex items-center justify-between transition-all",
                    test.status === "PASS"
                      ? "bg-green-500/5 border-green-500/20 hover:bg-green-500/10"
                      : test.status === "FAIL"
                        ? "bg-red-500/5 border-red-500/20 hover:bg-red-500/10"
                        : "bg-yellow-500/5 border-yellow-500/20 hover:bg-yellow-500/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {test.status === "PASS" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : test.status === "FAIL" ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                    )}
                    <div className="text-left">
                      <p className="font-bold text-white">{test.name}</p>
                      <p className="text-xs text-gray-400">
                        {test.status} • {test.duration}s
                      </p>
                    </div>
                  </div>
                  {expandedTests.has(test.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {expandedTests.has(test.id) && (
                  <div className={cn(
                    "px-4 py-3 border-l-2 bg-gray-900/30 rounded-b-lg",
                    test.status === "PASS" ? "border-green-500/40" :
                    test.status === "FAIL" ? "border-red-500/40" :
                    "border-yellow-500/40"
                  )}>
                    <div className="bg-black/40 p-3 rounded font-mono text-[11px] text-gray-300 space-y-1 max-h-48 overflow-y-auto">
                      {test.details.map((detail, idx) => (
                        <div key={idx} className={cn(
                          detail.startsWith("✓") ? "text-green-400" :
                          detail.startsWith("✗") ? "text-red-400" :
                          detail.startsWith("⚠") ? "text-yellow-400" :
                          "text-gray-400"
                        )}>
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* DEMO CONTROLS */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-white" />
              Demo Controls
            </CardTitle>
            <CardDescription>
              Simulate test failures to see real-time QA dashboard updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800">
              <div>
                <p className="font-bold text-white">Simulate Performance Failure</p>
                <p className="text-sm text-gray-400">Toggle to fail the performance test</p>
              </div>
              <button
                onClick={() => setHasFailure(!hasFailure)}
                className={cn(
                  "relative inline-flex h-8 w-14 items-center rounded-full transition-colors",
                  hasFailure
                    ? "bg-red-500/20 border border-red-500/40"
                    : "bg-green-500/20 border border-green-500/40"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform",
                    hasFailure ? "translate-x-7" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-300 space-y-1">
              <p className="font-bold">ℹ Demo Features:</p>
              <ul className="space-y-1 ml-2 text-xs">
                <li>• Toggle the switch to simulate a performance test failure</li>
                <li>• Watch metrics update in real-time (Code Quality & Performance Score)</li>
                <li>• Deployment gate changes from Approved to Blocked</li>
                <li>• Test result expands to show simulated error details</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* SUMMARY STATS */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle>Test Run Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Total Tests</p>
                <p className="text-3xl font-bold text-white">{testResults.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  Passed
                </p>
                <p className="text-3xl font-bold text-green-400">
                  {testResults.filter(t => t.status === "PASS").length}
                </p>
              </div>
              {failedTests.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-2 flex items-center gap-1">
                    <XCircle className="w-3 h-3 text-red-400" />
                    Failed
                  </p>
                  <p className="text-3xl font-bold text-red-400">{failedTests.length}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Total Duration</p>
                <p className="text-3xl font-bold text-white">
                  {testResults.reduce((sum, t) => sum + t.duration, 0).toFixed(1)}s
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QUICK ACTIONS */}
        <div className="flex gap-3 flex-wrap">
          <Button className="bg-white hover:bg-gray-100 text-black font-bold">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" className="border-gray-700 text-gray-200 hover:bg-gray-900">
            <Terminal className="w-4 h-4 mr-2" />
            View Logs
          </Button>
        </div>
      </div>
    </div>
  )
}
