"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getSessions, getClasses } from "@/lib/data-access"
import type { Session, Class } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, FileText, Plus } from "lucide-react"
import Link from "next/link"

export default function SessionsPage() {
  const { currentRole, currentUser, selectedClassId } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        let sessionsData: Session[] = []
        const classesData = await getClasses()
        setClasses(classesData)

        if (currentRole === "TA" || currentRole === "Teacher") {
          const userClasses = classesData.filter(
            (c) => c.teacherId === currentUser?.id || c.taIds.includes(currentUser?.id || ""),
          )

          if (selectedClassId && selectedClassId !== "all") {
            sessionsData = await getSessions(selectedClassId)
          } else {
            const allSessions = await getSessions()
            const userClassIds = userClasses.map((c) => c.id)
            sessionsData = allSessions.filter((s) => userClassIds.includes(s.classId))
          }
        } else {
          sessionsData = await getSessions()
        }

        setSessions(sessionsData)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [currentRole, currentUser, selectedClassId])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-96 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  const upcomingSessions = sessions.filter((s) => s.status === "Scheduled" || s.status === "InProgress")
  const completedSessions = sessions.filter((s) => s.status === "Completed")

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Sessions</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage class sessions and reports</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Session
        </Button>
      </div>

      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="text-2xl font-bold">{sessions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="text-2xl font-bold mb-3">{upcomingSessions.length}</div>
            {upcomingSessions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Next Sessions:</p>
                {upcomingSessions.slice(0, 3).map((session) => {
                  const cls = classes.find((c) => c.id === session.classId)
                  return (
                    <Link key={session.id} href={`/sessions/${session.id}`}>
                      <div className="flex items-center justify-between rounded-md border bg-background/50 p-2 transition-colors hover:bg-accent/5 hover:border-primary">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{cls?.code || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">
                            Session {session.sessionNumber} • {session.scheduledDate}
                          </p>
                        </div>
                        {session.status === "InProgress" && (
                          <Badge variant="default" className="ml-2 text-xs px-1.5 py-0">
                            Live
                          </Badge>
                        )}
                      </div>
                    </Link>
                  )
                })}
                {upcomingSessions.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">+{upcomingSessions.length - 3} more</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 md:p-6">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="text-2xl font-bold">{completedSessions.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="upcoming" className="space-y-4">
        <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
          <TabsList className="inline-flex w-max md:w-auto">
            <TabsTrigger value="upcoming" className="text-xs md:text-sm">Upcoming</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs md:text-sm">Completed</TabsTrigger>
            <TabsTrigger value="all" className="text-xs md:text-sm">All</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">Upcoming Sessions</CardTitle>
              <CardDescription className="text-xs md:text-sm">Sessions scheduled or in progress</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="space-y-3">
                {upcomingSessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming sessions</p>
                ) : (
                  upcomingSessions.map((session) => {
                    const cls = classes.find((c) => c.id === session.classId)
                    return (
                      <Link key={session.id} href={`/sessions/${session.id}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border bg-card p-3 md:p-4 transition-colors hover:bg-accent hover:text-accent-foreground gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant={session.status === "InProgress" ? "default" : "secondary"}>
                                {session.status}
                              </Badge>
                              <span className="font-medium truncate">{cls?.code || "Unknown Class"}</span>
                              <span className="text-xs md:text-sm opacity-90">Session {session.sessionNumber}</span>
                            </div>
                            <p className="mt-1 text-xs md:text-sm opacity-80 truncate">
                              {session.topic} • {session.scheduledDate} • {session.startTime} - {session.endTime}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                            View
                          </Button>
                        </div>
                      </Link>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">Completed Sessions</CardTitle>
              <CardDescription className="text-xs md:text-sm">Past sessions and their reports</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="space-y-3">
                {completedSessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No completed sessions</p>
                ) : (
                  completedSessions.map((session) => {
                    const cls = classes.find((c) => c.id === session.classId)
                    return (
                      <Link key={session.id} href={`/sessions/${session.id}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border bg-card p-3 md:p-4 transition-colors hover:bg-accent hover:text-accent-foreground gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge>Completed</Badge>
                              <span className="font-medium truncate">{cls?.code || "Unknown Class"}</span>
                              <span className="text-xs md:text-sm opacity-90">Session {session.sessionNumber}</span>
                              {session.hasReport && <FileText className="h-4 w-4 opacity-80" />}
                            </div>
                            <p className="mt-1 text-xs md:text-sm opacity-80 truncate">
                              {session.topic} • {session.actualDate || session.scheduledDate}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                            View
                          </Button>
                        </div>
                      </Link>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">All Sessions</CardTitle>
              <CardDescription className="text-xs md:text-sm">Complete session history</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="space-y-3">
                {sessions.map((session) => {
                  const cls = classes.find((c) => c.id === session.classId)
                  return (
                    <Link key={session.id} href={`/sessions/${session.id}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border bg-card p-3 md:p-4 transition-colors hover:bg-accent hover:text-accent-foreground gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant={
                                session.status === "Completed"
                                  ? "default"
                                  : session.status === "InProgress"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {session.status}
                            </Badge>
                            <span className="font-medium truncate">{cls?.code || "Unknown Class"}</span>
                            <span className="text-xs md:text-sm opacity-90">Session {session.sessionNumber}</span>
                            {session.hasReport && <FileText className="h-4 w-4 opacity-80" />}
                          </div>
                          <p className="mt-1 text-xs md:text-sm opacity-80 truncate">
                            {session.topic} • {session.scheduledDate}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                          View
                        </Button>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
