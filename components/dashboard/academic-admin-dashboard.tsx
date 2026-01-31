"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getCommentSnippets, mockSessions } from "@/lib/data-access"
import type { CommentSnippet } from "@/lib/types"
import { FileText, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export function AcademicAdminDashboard() {
  const [snippets, setSnippets] = useState<CommentSnippet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true)
      try {
        const snippetsData = await getCommentSnippets()
        setSnippets(snippetsData)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const totalSessions = mockSessions.length
  const completedSessions = mockSessions.filter((s) => s.status === "Completed").length
  const sessionsWithReports = mockSessions.filter((s) => s.hasReport).length
  const complianceRate = completedSessions > 0 ? Math.round((sessionsWithReports / completedSessions) * 100) : 0

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
            <CardTitle className="text-sm font-medium">Comment Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="text-2xl font-bold">{snippets.length}</div>
            <p className="text-xs text-muted-foreground">Active templates available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
            <CardTitle className="text-sm font-medium">Report Compliance</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="text-2xl font-bold">{complianceRate}%</div>
            <p className="text-xs text-muted-foreground">
              {sessionsWithReports} of {completedSessions} sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
            <CardTitle className="text-sm font-medium">Missing Reports</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="text-2xl font-bold">{completedSessions - sessionsWithReports}</div>
            <p className="text-xs text-muted-foreground">Completed sessions without reports</p>
          </CardContent>
        </Card>
      </div>

      {/* Template Health */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl">Template Usage Analytics</CardTitle>
          <CardDescription className="text-xs md:text-sm">Most and least used comment templates</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">Most Used Templates</h3>
              <div className="space-y-2">
                {snippets
                  .sort((a, b) => b.usageCount - a.usageCount)
                  .slice(0, 3)
                  .map((snippet) => (
                    <div key={snippet.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border bg-card p-3 gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{snippet.category}</p>
                        <p className="text-xs md:text-sm text-muted-foreground truncate">{snippet.textEN}</p>
                      </div>
                      <Badge variant="secondary" className="w-fit">{snippet.usageCount} uses</Badge>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Least Used Templates</h3>
              <div className="space-y-2">
                {snippets
                  .sort((a, b) => a.usageCount - b.usageCount)
                  .slice(0, 3)
                  .map((snippet) => (
                    <div key={snippet.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border bg-card p-3 gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{snippet.category}</p>
                        <p className="text-xs md:text-sm text-muted-foreground truncate">{snippet.textEN}</p>
                      </div>
                      <Badge variant="outline" className="w-fit">{snippet.usageCount} uses</Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
          <CardDescription className="text-xs md:text-sm">Manage templates and system settings</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
            <Link href="/templates">
              <Button variant="outline" className="h-auto w-full flex-col items-start gap-2 p-3 md:p-4 bg-transparent">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="font-medium text-sm">Manage Templates</span>
                </div>
                <p className="text-left text-xs md:text-sm text-muted-foreground">
                  Add, edit, or remove comment snippets and checklists
                </p>
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>

            <Link href="/reports">
              <Button variant="outline" className="h-auto w-full flex-col items-start gap-2 p-3 md:p-4 bg-transparent">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="font-medium text-sm">Review Reports</span>
                </div>
                <p className="text-left text-xs md:text-sm text-muted-foreground">
                  Monitor report submission and quality across all classes
                </p>
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
