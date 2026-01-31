"use client"
import { RequestDetailClient } from "./request-detail-client"

interface ActivityLogEntry {
  id: string
  timestamp: string
  user: string
  action: string
  details: string
}

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <RequestDetailClient requestId={resolvedParams.id} />
}
