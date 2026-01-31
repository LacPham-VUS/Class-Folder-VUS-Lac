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

  const totalRedClasses = heatmapData.reduce((sum, center) => sum + center.Red, 0)
  const totalYellowClasses = heatmapData.reduce((sum, center) => sum + center.Yellow, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">High Risk Classes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{totalRedClasses}</div>
            <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Medium Risk Classes</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{totalYellowClasses}</div>
            <p className="text-xs text-muted-foreground">Need monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue Requests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueRequests.length}</div>
            <p className="text-xs text-muted-foreground">Past SLA deadline</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Center Risk Heatmap</CardTitle>
          <CardDescription>RAG status overview by center</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {heatmapData.map((center) => (
              <div key={center.center.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{center.center.name}</p>
                    <p className="text-sm text-muted-foreground">{center.center.location}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{center.total} classes</p>
                </div>
                <div className="flex h-8 overflow-hidden rounded-lg">
                  {center.Green > 0 && (
                    <div
                      className="flex items-center justify-center bg-green-500 text-xs font-medium text-white"
                      style={{ width: `${(center.Green / center.total) * 100}%` }}
                    >
                      {center.Green}
                    </div>
                  )}
                  {center.Yellow > 0 && (
                    <div
                      className="flex items-center justify-center bg-yellow-500 text-xs font-medium text-white"
                      style={{ width: `${(center.Yellow / center.total) * 100}%` }}
                    >
                      {center.Yellow}
                    </div>
                  )}
                  {center.Red > 0 && (
                    <div
                      className="flex items-center justify-center bg-red-500 text-xs font-medium text-white"
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

      {overdueRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Overdue Special Requests</CardTitle>
            <CardDescription>Requests past their SLA deadline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between rounded-lg border border-red-500/20 bg-card p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">{request.priority}</Badge>
                      <Badge variant="outline" className="border-red-500 text-red-500">
                        Overdue
                      </Badge>
                      <span className="font-medium">{request.title}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {request.type} • Due: {request.dueDate}
                    </p>
                  </div>
                  <Link href={`/requests/${request.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {topRiskClasses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Risk Classes</CardTitle>
            <CardDescription>Classes requiring immediate intervention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topRiskClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
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
                    <div>
                      <p className="font-medium">{cls.code}</p>
                      <p className="text-sm text-muted-foreground">
                        {cls.program} {cls.level} • {cls.studentCount} students
                      </p>
                    </div>
                  </div>
                  <Link href={`/classes/${cls.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
