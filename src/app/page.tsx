import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 space-y-10">
        <section className="text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">NexOra</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none">
            NexOra Ai
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate deterministic architecture blueprints from a structured level intake.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button asChild>
              <Link href="/generate">Open Generator</Link>
            </Button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Test Seeds</CardTitle>
              <CardDescription>Pre-filled scenarios for rapid QA runs.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Founder MVP, Regulated Financial, and Scale + AI.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Conflict Severity</CardTitle>
              <CardDescription>Soft, Moderate, Severe, Blocking.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Blocking contradictions are surfaced in deterministic output.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Derived Indexes</CardTitle>
              <CardDescription>Five architecture pressure signals.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Complexity, regulatory, financial, scalability, and operational risk.</CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
