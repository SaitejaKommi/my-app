"use client"

import { useFormContext } from "react-hook-form"
import { FullRequirementsData } from "@/db/requirements-schema"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const computeNeedOptions = [
  ["scheduled_background_jobs", "Scheduled background jobs"],
  ["real_time_notifications", "Real-time notifications"],
  ["file_media_processing", "File/media processing"],
  ["large_file_uploads", "Large file uploads"],
  ["heavy_compute_tasks", "Heavy compute tasks"],
  ["ai_inference", "AI inference"],
  ["streaming_responses", "Streaming responses"],
] as const

const requestCharacteristicOptions = [
  ["small_payloads", "Small payloads"],
  ["large_uploads", "Large uploads"],
  ["streaming_required", "Streaming required"],
  ["long_lived_connections", "Long-lived connections"],
  ["websockets_required", "WebSockets required"],
  ["grpc_required", "gRPC required"],
] as const

export function Step7ScaleLoad() {
  const { setValue, watch } = useFormContext<FullRequirementsData>()
  const computeNeeds = watch("computeNeeds") ?? []
  const requestCharacteristics = watch("requestCharacteristics") ?? []

  const toggleComputeNeed = (value: NonNullable<FullRequirementsData["computeNeeds"]>[number]) => {
    const next = computeNeeds.includes(value)
      ? computeNeeds.filter((item) => item !== value)
      : [...computeNeeds, value]
    setValue("computeNeeds", next)
  }

  const toggleRequestCharacteristic = (value: NonNullable<FullRequirementsData["requestCharacteristics"]>[number]) => {
    const next = requestCharacteristics.includes(value)
      ? requestCharacteristics.filter((item) => item !== value)
      : [...requestCharacteristics, value]
    setValue("requestCharacteristics", next)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
        <h3 className="text-lg font-medium">Level 7 — Scale & Load Modeling</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Launch users</Label>
            <Select onValueChange={(v) => setValue("usersAtLaunch", v as FullRequirementsData["usersAtLaunch"])} defaultValue={watch("usersAtLaunch")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="under_100">&lt; 100</SelectItem>
                <SelectItem value="100_to_1k">100 - 1k</SelectItem>
                <SelectItem value="1k_to_10k">1k - 10k</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>12-month projection</Label>
            <Select onValueChange={(v) => setValue("usersAt12Months", v as FullRequirementsData["usersAt12Months"])} defaultValue={watch("usersAt12Months")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10k_to_100k">10k - 100k</SelectItem>
                <SelectItem value="100k_to_1m">100k - 1M</SelectItem>
                <SelectItem value="over_1m">1M+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>36-month projection</Label>
            <Select onValueChange={(v) => setValue("usersAt36Months", v as FullRequirementsData["usersAt36Months"])} defaultValue={watch("usersAt36Months")}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10k_to_100k">10k - 100k</SelectItem>
                <SelectItem value="100k_to_1m">100k - 1M</SelectItem>
                <SelectItem value="over_1m">1M+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Traffic pattern</Label>
            <Select onValueChange={(v) => setValue("trafficProfile", v as FullRequirementsData["trafficProfile"])} defaultValue={watch("trafficProfile")}>
              <SelectTrigger><SelectValue placeholder="Select pattern" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="predictable_steady">Predictable steady load</SelectItem>
                <SelectItem value="seasonal_spikes">Seasonal spikes</SelectItem>
                <SelectItem value="viral_unpredictable">Viral burst traffic</SelectItem>
                <SelectItem value="always_on_high_concurrency">Constant high throughput</SelectItem>
                <SelectItem value="high_frequency_event_ingestion">High-frequency event ingestion</SelectItem>
                <SelectItem value="edge_device_ingestion">Edge device ingestion</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Peak concurrent users/connections</Label>
            <Select onValueChange={(v) => setValue("peakConcurrentUsers", v as FullRequirementsData["peakConcurrentUsers"])} defaultValue={watch("peakConcurrentUsers")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="under_50">&lt; 100</SelectItem>
                <SelectItem value="50_to_500">100 - 1k</SelectItem>
                <SelectItem value="500_to_5k">1k - 10k</SelectItem>
                <SelectItem value="5k_to_50k">10k - 100k</SelectItem>
                <SelectItem value="over_50k">100k+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Compute & processing needs</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {computeNeedOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleComputeNeed(value)}
                className={`rounded-md border px-3 py-2 text-sm text-left ${
                  computeNeeds.includes(value)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Request characteristics</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {requestCharacteristicOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleRequestCharacteristic(value)}
                className={`rounded-md border px-3 py-2 text-sm text-left ${
                  requestCharacteristics.includes(value)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
