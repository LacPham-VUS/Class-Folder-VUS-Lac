"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getTodaysSessions, getDraftReports, getStudentsNeedingAttention, getClassById } from "@/lib/data-access"
import type { Session, ClassReport, Student, Class } from "@/lib/types"
import { Calendar, FileText, AlertTriangle, ArrowRight } from "lucide-react"
import Link from "next/link"

export function TATeacherDashboard() {
  const { currentRole, currentUser, selectedCenterId } = useAuth()
  const { preferences, loading: preferencesLoading } = useUserPreferences()
  const [todaysSessions, setTodaysSessions] = useState<Session[]>([])
  const [draftReports, setDraftReports] = useState<ClassReport[]>([])
  const [studentsAtRisk, setStudentsAtRisk] = useState<Student[]>([])
  const [classesMap, setClassesMap] = useState<Map<string, Class>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      if (!currentUser) return

      setLoading(true)
      try {
        const [sessions, reports, students] = await Promise.all([
          getTodaysSessions(currentRole, currentUser.id),
          getDraftReports(currentRole, currentUser.id),
          getStudentsNeedingAttention(currentRole, selectedCenterId || undefined),
        ])

        setTodaysSessions(sessions)
        setDraftReports(reports)
        setStudentsAtRisk(students.slice(0, 5))

        // Load class details for sessions
        const classIds = [...new Set(sessions.map((s) => s.classId))]
        const classMap = new Map<string, Class>()
        await Promise.all(
          classIds.map(async (id) => {
            const cls = await getClassById(id)
            if (cls) classMap.set(id, cls)
          }),
        )
        setClassesMap(classMap)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [currentRole, currentUser, selectedCenterId])

  if (loading || preferencesLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

  // Get enabled widgets sorted by order
  const enabledWidgets = preferences.dashboardWidgets
    .filter((w) => w.enabled)
    .sort((a, b) => a.order - b.order)

  console.log('📊 Dashboard widgets:', {
    all: preferences.dashboardWidgets,
    enabled: enabledWidgets,
  })

  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case "overview":
        return renderOverviewWidget()
      case "upcomingSessions":
        return renderUpcomingSessionsWidget()
      case "recentNotes":
        return renderDraftReportsWidget()
      case "riskStudents":
        return renderRiskStudentsWidget()
      case "parentCommunications":
        return null // Not implemented for TA/Teacher
      case "analytics":
        return null // Not implemented for TA/Teacher
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
      <div key="overview" className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">Today's Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="text-xl md:text-2xl font-bold">{todaysSessions.length}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">
              {currentRole === "TA" ? "Pending Reports" : "Reports to Review"}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="text-xl md:text-2xl font-bold">{draftReports.length}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              {currentRole === "TA" ? "Drafts to complete" : "Awaiting approval"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">Students at Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="text-xl md:text-2xl font-bold">{studentsAtRisk.length}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  function renderUpcomingSessionsWidget() {
    return (
      <Card key="upcomingSessions">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Today's Sessions</CardTitle>
          <CardDescription className="text-sm">Your scheduled sessions for today</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          {todaysSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions scheduled for today</p>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {todaysSessions.map((session) => {
                const cls = classesMap.get(session.classId)
                return (
                  <div
                    key={session.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border bg-card p-3 md:p-4 transition-colors hover:bg-accent/5 gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={session.status === "Completed" ? "default" : "secondary"} className="text-xs">
                          {session.status}
                        </Badge>
                        <span className="font-medium text-sm md:text-base">{cls?.code || "Unknown Class"}</span>
                      </div>
                      <p className="mt-1 text-xs md:text-sm text-muted-foreground truncate">
                        {session.topic} • {session.startTime} - {session.endTime}
                      </p>
                    </div>
                    <Link href={`/sessions/${session.id}`}>
                      <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                        View
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  function renderDraftReportsWidget() {
    if (draftReports.length === 0) return null

    return (
      <Card key="recentNotes">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">{currentRole === "TA" ? "Draft Reports" : "Reports to Review"}</CardTitle>
          <CardDescription className="text-sm">
            {currentRole === "TA"
              ? "Sessions with incomplete reports - click to continue editing"
              : "Review and approve submitted reports"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <div className="space-y-2 md:space-y-3">
            {draftReports.map((report) => (
              <div
                key={report.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border bg-card p-3 md:p-4 transition-colors hover:bg-accent/5 gap-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={report.status === "Draft" ? "outline" : "secondary"} className="text-xs">{report.status}</Badge>
                    <span className="font-medium text-sm md:text-base">Session {report.sessionId}</span>
                  </div>
                  <p className="mt-1 text-xs md:text-sm text-muted-foreground truncate">{report.summary.substring(0, 80)}...</p>
                </div>
                <Link href={currentRole === "TA" ? `/sessions/${report.sessionId}` : `/reports/${report.id}`}>
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                    {currentRole === "TA" ? "Continue" : "Review"}
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

  function renderRiskStudentsWidget() {
    if (studentsAtRisk.length === 0) return null

    return (
      <Card key="riskStudents">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Students Needing Attention</CardTitle>
          <CardDescription className="text-sm">Students with risk alerts or attendance concerns</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <div className="space-y-2 md:space-y-3">
            {studentsAtRisk.map((student) => (
              <div
                key={student.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border bg-card p-3 md:p-4 transition-colors hover:bg-accent/5 gap-2"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <Badge
                    variant="outline"
                    className={
                      student.riskLevel === "Red"
                        ? "border-red-500 text-red-500"
                        : student.riskLevel === "Yellow"
                          ? "border-yellow-500 text-yellow-500"
                          : "border-green-500 text-green-500"
                    }
                  >
                    {student.riskLevel}
                  </Badge>
                  <div className="min-w-0">
                    <p className="font-medium text-sm md:text-base truncate">{student.fullName}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">ID: {student.id}</p>
                  </div>
                </div>
                <Link href={`/students/${student.id}`}>
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
