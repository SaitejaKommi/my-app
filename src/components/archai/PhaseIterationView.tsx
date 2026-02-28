"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phase } from "@/db/phases-schema"
import { 
  ChevronRight, 
  ChevronDown,
  FileCode,
  Folder,
  Copy,
  Download,
  Play,
  Eye,
  EyeOff,
  ArrowRight
} from "lucide-react"

interface PhaseIterationViewProps {
  phases: Phase[]
}

interface FileNode {
  name: string
  path: string
  isFolder: boolean
  children?: FileNode[]
  content?: string
  phase: number
  language?: string
}

type ViewMode = "code" | "preview" | "split"

export function PhaseIterationView({ phases }: PhaseIterationViewProps) {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["root"]))
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("split")
  const [copiedFile, setCopiedFile] = useState<string | null>(null)

  const phase = phases[currentPhase]

  // Build file tree from code blocks
  const buildFileTree = (): FileNode => {
    const root: FileNode = {
      name: "project-root",
      path: "root",
      isFolder: true,
      children: [],
      phase: currentPhase,
    }

    // Group files by phase up to current phase
    for (let p = 0; p <= currentPhase; p++) {
      const phaseData = phases[p]
      
      phaseData.blocks.forEach((block) => {
        const parts = block.filename.split("/")
        let current = root

        // Navigate/create folder structure
        for (let i = 0; i < parts.length - 1; i++) {
          const folderName = parts[i]
          let folder = current.children?.find(
            (c) => c.isFolder && c.name === folderName
          )

          if (!folder) {
            folder = {
              name: folderName,
              path: `${current.path}/${folderName}`,
              isFolder: true,
              children: [],
              phase: p,
            }
            current.children = [...(current.children || []), folder]
          }
          current = folder
        }

        // Add file
        const fileName = parts[parts.length - 1]
        const file: FileNode = {
          name: fileName,
          path: `${current.path}/${fileName}`,
          isFolder: false,
          content: block.code,
          language: block.language,
          phase: p,
        }

        current.children = [...(current.children || []), file]
      })
    }

    return root
  }

  const fileTree = buildFileTree()
  const currentFile = selectedFile ? findFileByPath(fileTree, selectedFile) : null

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedFile(selectedFile)
    setTimeout(() => setCopiedFile(null), 2000)
  }

  const downloadFile = (code: string, filename: string) => {
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

  return (
    <div className="space-y-4">
      {/* Phase Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {phases.map((p, idx) => (
          <div key={p.id} className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentPhase(idx)
                setSelectedFile(null)
              }}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
                currentPhase === idx
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs">
                  {p.order}
                </div>
                <span>{p.name}</span>
              </div>
            </button>
            {idx < phases.length - 1 && (
              <ArrowRight className="w-4 h-4 text-zinc-600" />
            )}
          </div>
        ))}
      </div>

      {/* Phase Info */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{phase.name}</CardTitle>
              <p className="text-sm text-zinc-400 mt-1">{phase.description}</p>
            </div>
            {phase.estimatedDays && (
              <Badge variant="outline" className="text-xs">
                ~{phase.estimatedDays} days
              </Badge>
            )}
          </div>
        </CardHeader>
        {phase.reasoning && (
          <CardContent className="bg-blue-500/5 border-t border-blue-500/20 text-sm text-zinc-300">
            {phase.reasoning}
          </CardContent>
        )}
      </Card>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode("code")}
          className={`px-3 py-1.5 rounded text-sm font-bold transition-colors ${
            viewMode === "code"
              ? "bg-blue-600 text-white"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          <FileCode className="w-4 h-4 inline mr-1" />
          Code
        </button>
        <button
          onClick={() => setViewMode("preview")}
          className={`px-3 py-1.5 rounded text-sm font-bold transition-colors ${
            viewMode === "preview"
              ? "bg-blue-600 text-white"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          <Eye className="w-4 h-4 inline mr-1" />
          Preview
        </button>
        <button
          onClick={() => setViewMode("split")}
          className={`px-3 py-1.5 rounded text-sm font-bold transition-colors ${
            viewMode === "split"
              ? "bg-blue-600 text-white"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          <div className="w-4 h-4 inline mr-1 text-xs">↔</div>
          Split
        </button>
      </div>

      {/* Main Editor Area */}
      <div
        className={`grid gap-4 ${
          viewMode === "split" ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        {/* File Explorer + Code */}
        {(viewMode === "code" || viewMode === "split") && (
          <Card className="bg-black border-zinc-800 overflow-hidden flex flex-col h-[600px]">
            <div className="grid grid-cols-2 border-b border-zinc-800 h-full overflow-hidden">
              {/* File Tree */}
              <div className="border-r border-zinc-800 bg-zinc-950 overflow-y-auto">
                <div className="p-3 font-bold text-xs uppercase text-zinc-600 border-b border-zinc-800 sticky top-0 bg-zinc-950">
                  Files
                </div>
                <div className="p-2 space-y-1">
                  <FileTreeNode
                    node={fileTree}
                    expanded={expandedFolders}
                    onToggle={toggleFolder}
                    onSelectFile={setSelectedFile}
                    selectedFile={selectedFile}
                    currentPhase={currentPhase}
                  />
                </div>
              </div>

              {/* Code Editor */}
              <div className="bg-zinc-900 overflow-y-auto flex flex-col">
                {currentFile ? (
                  <>
                    {/* File Header */}
                    <div className="flex items-center justify-between p-3 bg-zinc-950 border-b border-zinc-800 sticky top-0">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-blue-400" />
                        <span className="font-mono text-sm text-zinc-300">
                          {currentFile.name}
                        </span>
                        {currentFile.language && (
                          <Badge
                            variant="outline"
                            className="text-[10px] text-xs"
                          >
                            {currentFile.language}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            currentFile.content &&
                            copyCode(currentFile.content)
                          }
                          className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
                          title="Copy"
                        >
                          {copiedFile === selectedFile ? (
                            <span className="text-xs text-green-400">✓</span>
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-zinc-400" />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            currentFile.content &&
                            downloadFile(currentFile.content, currentFile.name)
                          }
                          className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5 text-zinc-400" />
                        </button>
                      </div>
                    </div>

                    {/* Code Content */}
                    <pre className="flex-1 p-4 font-mono text-xs leading-relaxed text-zinc-300 overflow-auto whitespace-pre-wrap break-words bg-black">
                      <code>{currentFile.content}</code>
                    </pre>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
                    Select a file to view code
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Preview */}
        {(viewMode === "preview" || viewMode === "split") && (
          <Card className="bg-zinc-900 border-zinc-800 overflow-hidden flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Live Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 relative overflow-hidden">
              <PhasePreview phase={phase} phaseIndex={currentPhase} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function FileTreeNode({
  node,
  expanded,
  onToggle,
  onSelectFile,
  selectedFile,
  currentPhase,
}: {
  node: FileNode
  expanded: Set<string>
  onToggle: (path: string) => void
  onSelectFile: (path: string) => void
  selectedFile: string | null
  currentPhase: number
}): React.ReactElement {
  const isExpanded = expanded.has(node.path)
  const isDisabled = node.phase > currentPhase

  if (node.isFolder && node.name === "project-root") {
    return (
      <>
        {node.children?.map((child) => (
          <FileTreeNode
            key={child.path}
            node={child}
            expanded={expanded}
            onToggle={onToggle}
            onSelectFile={onSelectFile}
            selectedFile={selectedFile}
            currentPhase={currentPhase}
          />
        ))}
      </>
    )
  }

  return (
    <div key={node.path}>
      {node.isFolder ? (
        <>
          <button
            onClick={() => onToggle(node.path)}
            className={`w-full flex items-center gap-1 px-2 py-1 rounded text-xs font-mono transition-colors ${
              isDisabled
                ? "text-zinc-700 opacity-50 cursor-not-allowed"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            }`}
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
            <Folder className="w-3 h-3" />
            <span>{node.name}</span>
          </button>
          {isExpanded &&
            node.children?.map((child) => (
              <div key={child.path} className="ml-3">
                <FileTreeNode
                  node={child}
                  expanded={expanded}
                  onToggle={onToggle}
                  onSelectFile={onSelectFile}
                  selectedFile={selectedFile}
                  currentPhase={currentPhase}
                />
              </div>
            ))}
        </>
      ) : (
        <button
          onClick={() => !isDisabled && onSelectFile(node.path)}
          className={`w-full flex items-center gap-1 px-2 py-1 rounded text-xs font-mono transition-colors text-left ${
            isDisabled
              ? "text-zinc-700 opacity-50 cursor-not-allowed"
              : selectedFile === node.path
              ? "bg-blue-600 text-white"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          }`}
        >
          <FileCode className="w-3 h-3" />
          <span className="truncate">{node.name}</span>
          {node.phase < currentPhase && (
            <span className="text-xs text-green-400 ml-auto">✓</span>
          )}
        </button>
      )}
    </div>
  )
}

function PhasePreview({
  phase,
  phaseIndex,
}: {
  phase: Phase
  phaseIndex: number
}) {
  const getPreviewContent = () => {
    switch (phaseIndex) {
      case 0: // UI Phase
        return (
          <div className="p-8 space-y-6">
            <div className="text-sm text-zinc-400 mb-4">
              📦 Phase 1: Building UI Components
            </div>

            {/* Component Preview */}
            <div className="space-y-4">
              {phase.blocks.slice(0, 3).map((block, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-blue-500/30 rounded-lg bg-blue-500/5 animate-in fade-in"
                  style={{ animationDelay: `${idx * 200}ms` }}
                >
                  <h3 className="font-bold text-blue-400 mb-2">
                    ⚛️ {block.filename.split("/").pop()}
                  </h3>
                  <div className="text-xs text-zinc-400 space-y-1">
                    <div>Description: {block.description}</div>
                    <div>Language: {block.language}</div>
                    <div className="mt-2 p-2 bg-black/40 rounded font-mono text-[10px]">
                      {block.code.split("\n").slice(0, 5).join("\n")}
                      {block.code.split("\n").length > 5 && (
                        <div className="text-zinc-600">...</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 1: // API Phase
        return (
          <div className="p-8 space-y-6">
            <div className="text-sm text-zinc-400 mb-4">
              🔌 Phase 2: Building API Routes
            </div>

            <div className="space-y-4">
              {phase.blocks.slice(0, 3).map((block, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-green-500/30 rounded-lg bg-green-500/5 animate-in fade-in"
                  style={{ animationDelay: `${idx * 200}ms` }}
                >
                  <h3 className="font-bold text-green-400 mb-2">
                    GET/POST {block.filename.split("/").pop()}
                  </h3>
                  <div className="text-xs text-zinc-400">
                    <div>{block.description}</div>
                    <div className="mt-2 p-2 bg-black/40 rounded font-mono text-[10px]">
                      {block.code.split("\n").slice(0, 4).join("\n")}
                      ...
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 2: // Database Phase
        return (
          <div className="p-8 space-y-6">
            <div className="text-sm text-zinc-400 mb-4">
              🗄️ Phase 3: Building Database Schema
            </div>

            <div className="space-y-4">
              {phase.blocks.slice(0, 3).map((block, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-purple-500/30 rounded-lg bg-purple-500/5 animate-in fade-in"
                  style={{ animationDelay: `${idx * 200}ms` }}
                >
                  <h3 className="font-bold text-purple-400 mb-2">
                    🗂️ {block.filename.split("/").pop()}
                  </h3>
                  <div className="text-xs text-zinc-400">
                    <div>{block.description}</div>
                    <div className="mt-2 p-2 bg-black/40 rounded font-mono text-[10px] max-h-32 overflow-y-auto">
                      {block.code.split("\n").slice(0, 5).join("\n")}
                      ...
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 3: // Services Phase
        return (
          <div className="p-8 space-y-6">
            <div className="text-sm text-zinc-400 mb-4">
              ⚙️ Phase 4: Building Services & Integration
            </div>

            <div className="space-y-4">
              {phase.blocks.slice(0, 3).map((block, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-orange-500/30 rounded-lg bg-orange-500/5 animate-in fade-in"
                  style={{ animationDelay: `${idx * 200}ms` }}
                >
                  <h3 className="font-bold text-orange-400 mb-2">
                    🔧 {block.filename.split("/").pop()}
                  </h3>
                  <div className="text-xs text-zinc-400">
                    <div>{block.description}</div>
                    <div className="mt-2 p-2 bg-black/40 rounded font-mono text-[10px]">
                      {block.code.split("\n").slice(0, 4).join("\n")}
                      ...
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 4: // Testing Phase
        return (
          <div className="p-8 space-y-6">
            <div className="text-sm text-zinc-400 mb-4">
              ✅ Phase 5: Building Tests & QA
            </div>

            <div className="space-y-4">
              {phase.blocks.slice(0, 3).map((block, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-red-500/30 rounded-lg bg-red-500/5 animate-in fade-in"
                  style={{ animationDelay: `${idx * 200}ms` }}
                >
                  <h3 className="font-bold text-red-400 mb-2">
                    🧪 {block.filename.split("/").pop()}
                  </h3>
                  <div className="text-xs text-zinc-400">
                    <div>{block.description}</div>
                    <div className="mt-2 p-2 bg-black/40 rounded font-mono text-[10px]">
                      {block.code.split("\n").slice(0, 4).join("\n")}
                      ...
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return <div className="text-zinc-500">No preview available</div>
    }
  }

  return (
    <div className="space-y-4 text-sm">
      {getPreviewContent()}

      {/* Build Progress */}
      <div className="mt-8 pt-6 border-t border-zinc-800">
        <div className="text-xs text-zinc-600 mb-3">Build Timeline:</div>
        <div className="space-y-2">
          {[
            { step: 1, name: "UI Components" },
            { step: 2, name: "API Routes" },
            { step: 3, name: "Database" },
            { step: 4, name: "Services" },
            { step: 5, name: "Testing" },
          ].map((item) => (
            <div
              key={item.step}
              className={`flex items-center gap-2 text-xs ${
                item.step <= phaseIndex + 1
                  ? "text-green-400"
                  : "text-zinc-600"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  item.step <= phaseIndex + 1
                    ? "bg-green-500"
                    : "bg-zinc-700"
                }`}
              />
              {item.step <= phaseIndex + 1 ? "✓" : "○"} {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function findFileByPath(node: FileNode, path: string): FileNode | null {
  if (node.path === path) return node
  if (node.children) {
    for (const child of node.children) {
      const found = findFileByPath(child, path)
      if (found) return found
    }
  }
  return null
}
