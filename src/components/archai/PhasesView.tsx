"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phase } from "@/db/phases-schema"
import { 
  Copy, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  ChevronDown,
  ChevronUp,
  Zap,
  Grid2x2
} from "lucide-react"
import { PhaseIterationView } from "./PhaseIterationView"

interface PhasesViewProps {
  phases: Phase[]
}

type ViewType = "detailed" | "iterations"

export function PhasesView({ phases }: PhasesViewProps) {
  const [viewType, setViewType] = useState<ViewType>("detailed")
  const [expandedPhase, setExpandedPhase] = useState<string | null>(phases[0]?.id || null)
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null)

  const sortedPhases = [...phases].sort((a, b) => a.order - b.order)

  const copyToClipboard = (code: string, blockId: string) => {
    navigator.clipboard.writeText(code)
    setCopiedBlock(blockId)
    setTimeout(() => setCopiedBlock(null), 2000)
  }

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      case "generating":
        return "bg-blue-100 text-blue-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="w-4 h-4" />
      case "error":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Implementation Phases</h2>
          <p className="text-gray-600">
            AI-generated code for each phase. Follow the sequence for optimal development.
          </p>
        </div>

        {/* View Type Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewType("detailed")}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
              viewType === "detailed"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-900 text-gray-400 hover:bg-gray-800"
            }`}
          >
            <Grid2x2 className="w-4 h-4" />
            All Phases
          </button>
          <button
            onClick={() => setViewType("iterations")}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
              viewType === "iterations"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-900 text-gray-400 hover:bg-gray-800"
            }`}
          >
            <Zap className="w-4 h-4" />
            Build Step-by-Step
          </button>
        </div>
      </div>

      {/* Iterations View */}
      {viewType === "iterations" && <PhaseIterationView phases={phases} />}

      {/* Detailed View */}
      {viewType === "detailed" && (
        <>
          {sortedPhases.map((phase) => (
            <Card key={phase.id} className="overflow-hidden">
          <button
            onClick={() =>
              setExpandedPhase(
                expandedPhase === phase.id ? null : phase.id
              )
            }
            className="w-full text-left"
          >
            <CardHeader className="pb-3 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold">
                      {phase.order}
                    </div>
                    <h3 className="text-lg font-semibold">{phase.name}</h3>
                    <Badge className={`${getStatusColor(phase.status)} border-0`}>
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(phase.status)}
                        <span>{phase.status}</span>
                      </div>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{phase.description}</p>
                  {phase.estimatedDays && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{phase.estimatedDays} days estimated</span>
                    </div>
                  )}
                </div>
                <div className="text-gray-400">
                  {expandedPhase === phase.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>
            </CardHeader>
          </button>

          {expandedPhase === phase.id && (
            <>
              {phase.reasoning && (
                <CardContent className="pt-0 pb-4 bg-blue-50 border-t">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Reasoning</h4>
                    <p className="text-sm text-gray-700">{phase.reasoning}</p>
                  </div>
                </CardContent>
              )}

              <CardContent className="pt-6 space-y-6">
                {phase.blocks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No code blocks generated for this phase</p>
                  </div>
                ) : (
                  phase.blocks.map((block, idx) => (
                    <div key={idx} className="space-y-2 border rounded-lg overflow-hidden">
                      {/* Code Block Header */}
                      <div className="bg-gray-900 text-gray-100 px-4 py-3 flex items-center justify-between">
                        <div>
                          <div className="font-mono text-sm font-semibold">
                            {block.filename}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {block.language}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(block.code, `${phase.id}-${idx}`)}
                            className="p-2 hover:bg-gray-800 rounded transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedBlock === `${phase.id}-${idx}` ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                          <button
                            onClick={() => downloadCode(block.code, block.filename)}
                            className="p-2 hover:bg-gray-800 rounded transition-colors"
                            title="Download file"
                          >
                            <Download className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      {block.description && (
                        <div className="px-4 py-2 bg-gray-50 border-b">
                          <p className="text-sm text-gray-700">
                            {block.description}
                          </p>
                        </div>
                      )}

                      {/* Code Block with Syntax Highlighting */}
                      <div className="overflow-x-auto">
                        <pre className="bg-gray-900 text-gray-100 p-4 font-mono text-sm leading-relaxed">
                          <code>{block.code}</code>
                        </pre>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </>
          )}
        </Card>
      ))}

      {/* Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">Implementation Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortedPhases.map((phase) => (
              <div key={phase.id} className="flex items-center justify-between text-sm">
                <span className="font-medium">{phase.name}</span>
                <span className="text-gray-600">
                  {phase.estimatedDays ? `~${phase.estimatedDays} days` : "TBD"}
                </span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2 flex items-center justify-between font-semibold">
              <span>Total Effort</span>
              <span className="text-blue-700">
                ~{sortedPhases.reduce((sum, p) => sum + (p.estimatedDays || 0), 0)} days
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
        </>
      )}
    </div>
  )
}
