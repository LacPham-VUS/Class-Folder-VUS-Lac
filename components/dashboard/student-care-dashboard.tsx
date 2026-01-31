"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getCenterHeatmap, getOverdueSpecialRequests, getClasses } from "@/lib/data-access"
import type { SpecialRequest, Class } from "@/lib/types"
import { AlertTriangle, TrendingUp, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useUserPreferences } from "@/hooks/use-user-preferences"

interface CenterHeatmapData {
  center: {
    id: string
    name: string
    nameVN: string
    location: string
  }
  Green: number
  Yellow: number
  Red: number
  total: number
}

export function StudentCareDashboard() {
  const { currentUser } = useAuth()
  const { preferences, loading: preferencesLoading } = useUserPreferences()
  const [heatmapData, setHeatmapData] = useState<CenterHeatmapData[]>([])
  const [overdueRequests, setOverdueRequests] = useState<SpecialRequest[]>([])
  const [topRiskClasses, setTopRiskClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      if (!currentUser) return

      setLoading(true)
      try {
        const [heatmap, requests] = await Promise.all([
          getCenterHeatmap(currentUser.id),
          getOverdueSpecialRequests(currentUser.id),
        ])

        setHeatmapData(heatmap)
        setOverdueRequests(requests)

        const assignedCenterIds = currentUser.assignedCenterIds || []
        const allClassesPromises = assignedCenterIds.map((centerId) => getClasses(centerId))
        const allClassesArrays = await Promise.all(allClassesPromises)
        const allClasses = allClassesArrays.flat()

        const riskClasses = allClasses
          .filter((c) => c.riskLevel === "Red" || c.riskLevel === "Yellow")
          .sort((a, b) => {
            const riskOrder = { Red: 3, Yellow: 2, Green: 1 }
            return riskOrder[b.riskLevel || "Green"] - riskOrder[a.riskLevel || "Green"]
          })
          .slice(0, 5)

        setTopRiskClasses(riskClasses)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [currentUser])

  if (loading || preferencesLoading) {
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

  const totalRedClasses = heatmapData.reduce((sum, center) => sum + center.Red, 0)
  const totalYellowClasses = heatmapData.reduce((sum, center) => sum + center.Yellow, 0)

  // Get enabled widgets sorted by order
  const enabledWidgets = preferences.dashboardWidgets
    .filter((w) => w.enabled)
    .sort((a, b) => a.order - b.order)

  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case "overview":
        return renderOverviewWidget()
      case "riskStudents":
        return renderCenterHeatmapWidget()
      case "upcomingSessions":
        return renderTopRiskClassesWidget()
      case "recentNotes":
        return renderOverdueRequestsWidget()
      default:
        return null
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {enabledWidgets.map((widget) => (
        <div key={widget.id}>
          {renderWidget(widget.id)}
        </div>
      ))}
    </div>
  )

  function renderOverviewWidget() {
    return (
      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">High Risk Classes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="text-xl md:text-2xl font-bold text-red-500">{totalRedClasses}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">Requiring immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">Medium Risk Classes</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="text-xl md:text-2xl font-bold text-yellow-500">{totalYellowClasses}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">Need monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">Overdue Requests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="text-xl md:text-2xl font-bold">{overdueRequests.length}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">Past SLA deadline</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  function renderCenterHeatmapWidget() {
    return (
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Center Risk Heatmap</CardTitle>
          <CardDescription className="text-sm">RAG status overview by center</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <div className="space-y-3 md:space-y-4">
            {heatmapData.map((center) => (
              <div key={center.center.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm md:text-base truncate">{center.center.name}</p>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{center.center.location}</p>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground ml-2">{center.total} classes</p>
                </div>
                <div className="flex h-6 md:h-8 overflow-hidden rounded-lg">
                  {center.Green > 0 && (
                    <div
                      className="flex items-center justify-center bg-green-500 text-[10px] md:text-xs font-medium text-white"
                      style={{ width: `${(center.Green / center.total) * 100}%` }}
                    >
                      {center.Green}
                    </div>
                  )}
                  {center.Yellow > 0 && (
                    <div
                      className="flex items-center justify-center bg-yellow-500 text-[10px] md:text-xs font-medium text-white"
                      style={{ width: `${(center.Yellow / center.total) * 100}%` }}
                    >
                      {center.Yellow}
                    </div>
                  )}
                  {center.Red > 0 && (
                    <div
                      className="flex items-center justify-center bg-red-500 text-[10px] md:text-xs font-medium text-white"
                      style={{ width: `${(center.Red / center.total) * 100}%` }}
                    >
                      {center.Red}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  function renderOverdueRequestsWidget() {
    if (overdueRequests.length === 0) return null

    return (
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Overdue Special Requests</CardTitle>
          <CardDescription className="text-sm">Requests past their SLA deadline</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <div className="space-y-2 md:space-y-3">
            {overdueRequests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-red-500/20 bg-card p-3 md:p-4 transition-colors hover:bg-accent gap-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="destructive" className="text-xs">{request.priority}</Badge>
                    <Badge variant="outline" className="border-red-500 text-red-500 text-xs">
                      Overdue
                    </Badge>
                    <span className="font-medium text-sm md:text-base truncate">{request.title}</span>
                  </div>
                  <p className="mt-1 text-xs md:text-sm text-muted-foreground truncate">
                    {request.type} • Due: {request.dueDate}
                  </p>
                </div>
                <Link href={`/requests/${request.id}`}>
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                    View
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  function renderTopRiskClassesWidget() {
    if (topRiskClasses.length === 0) return null

    return (
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Top Risk Classes</CardTitle>
          <CardDescription className="text-sm">Classes requiring immediate intervention</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <div className="space-y-2 md:space-y-3">
            {topRiskClasses.map((cls) => (
              <div
                key={cls.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border bg-card p-3 md:p-4 transition-colors hover:bg-accent gap-2"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <Badge
                    variant="outline"
                    className={
                      cls.riskLevel === "Red"
                        ? "border-red-500 text-red-500"
                        : cls.riskLevel === "Yellow"
                          ? "border-yellow-500 text-yellow-500"
                          : "border-green-500 text-green-500"
                    }
                  >
                    {cls.riskLevel}
                  </Badge>
                  <div className="min-w-0">
                    <p className="font-medium text-sm md:text-base">{cls.code}</p>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">
                      {cls.program} {cls.level} • {cls.studentCount} students
                    </p>
                  </div>
                </div>
                <Link href={`/classes/${cls.id}`}>
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                    View
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
}
