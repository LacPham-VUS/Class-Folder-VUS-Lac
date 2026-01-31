"use client"
import { use } from "react"
import { RequestDetailClient } from "./request-detail-client"

interface ActivityLogEntry {
  id: string
  timestamp: string
  user: string
  action: string
  details: string
}

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  return <RequestDetailClient requestId={resolvedParams.id} />
}
