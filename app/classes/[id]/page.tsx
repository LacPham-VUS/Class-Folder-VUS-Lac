"use client"

import { useEffect, useState } from "react"
import {
  getClassById,
  getCenters,
  getSessions,
  getStudentsByClass,
  getSpecialRequests,
  mockUsers,
  mockClassReports,
} from "@/lib/data-access"
import type { Class, Center, Session, Student, SpecialRequest, User, ClassReport } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Users, FileText, AlertCircle, FolderOpen, BarChart } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params

  return <ClassDetailPageClient classId={resolvedParams.id} />
}

function ClassDetailPageClient({ classId }: { classId: string }) {
  const router = useRouter()
  const [classData, setClassData] = useState<Class | null>(null)
  const [center, setCenter] = useState<Center | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [specialRequests, setSpecialRequests] = useState<SpecialRequest[]>([])
  const [teacher, setTeacher] = useState<User | null>(null)
  const [classReports, setClassReports] = useState<ClassReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const cls = await getClassById(classId)
        if (!cls) {
          router.push("/classes")
          return
        }
        setClassData(cls)

        const [centersData, sessionsData, studentsData, requestsData] = await Promise.all([
          getCenters(),
          getSessions(cls.id),
          getStudentsByClass(cls.id),
          getSpecialRequests({ classId: cls.id }),
        ])

        setCenter(centersData.find((c) => c.id === cls.centerId) || null)
        setSessions(sessionsData)
        setStudents(studentsData)
        setSpecialRequests(requestsData)
        setTeacher(mockUsers.find((u) => u.id === cls.teacherId) || null)

        const sessionIds = sessionsData.map((s) => s.id)
        const reports = mockClassReports.filter((r) => sessionIds.includes(r.sessionId))
        setClassReports(reports)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [classId, router])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-96 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (!classData) {
    return null
  }

  const completedSessions = sessions.filter((s) => s.status === "Completed").length
  const openRequests = specialRequests.filter((r) => r.status === "Open" || r.status === "InProgress").length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/classes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{classData.code}</h1>
            {classData.riskLevel && (
              <Badge
                variant="outline"
                className={
                  classData.riskLevel === "Red"
                    ? "border-red-500 text-red-500"
                    : classData.riskLevel === "Yellow"
                      ? "border-yellow-500 text-yellow-500"
                      : "border-green-500 text-green-500"
                }
              >
                {classData.riskLevel}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{center?.name}</p>
        </div>
        <Button>Edit Class</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.studentCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedSessions} / {sessions.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={classData.status === "Active" ? "default" : "secondary"}>{classData.status}</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="reports">Class Reports</TabsTrigger>
          <TabsTrigger value="requests">Special Requests</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Class Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Program</span>
                  <span className="font-medium">
                    {classData.program} {classData.level}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shift</span>
                  <span className="font-medium">{classData.shift}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium">{classData.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date</span>
                  <span className="font-medium">{classData.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Teacher</span>
                  <span className="font-medium">{teacher?.name || "N/A"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Schedule</CardTitle>
              <CardDescription>All sessions for this class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <Link key={session.id} href={`/sessions/${session.id}`}>
                    <div className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={session.status === "Completed" ? "default" : "secondary"}>
                            {session.status}
                          </Badge>
                          <span className="font-medium">Session {session.sessionNumber}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {session.topic} • {session.scheduledDate}
                        </p>
                      </div>
                      {session.hasReport && <FileText className="h-5 w-5 text-primary" />}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
              <CardDescription>{students.length} students in this class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      {student.riskLevel && (
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
                      )}
                      <div>
                        <p className="font-medium">{student.fullName}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    <Link href={`/students/${student.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Reports</CardTitle>
              <CardDescription>Daily class reports for all sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classReports.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No class reports yet</p>
                ) : (
                  classReports
                    .sort((a, b) => {
                      const sessionA = sessions.find((s) => s.id === a.sessionId)
                      const sessionB = sessions.find((s) => s.id === b.sessionId)
                      return (sessionB?.sessionNumber || 0) - (sessionA?.sessionNumber || 0)
                    })
                    .map((report) => {
                      const session = sessions.find((s) => s.id === report.sessionId)
                      const submitter = mockUsers.find((u) => u.id === report.submittedBy)
                      const approver = report.approvedBy ? mockUsers.find((u) => u.id === report.approvedBy) : null

                      return (
                        <Link key={report.id} href={`/sessions/${session?.id}`}>
                          <div className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    report.status === "Approved"
                                      ? "default"
                                      : report.status === "Submitted"
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {report.status}
                                </Badge>
                                <span className="font-medium">Session {session?.sessionNumber}</span>
                                <span className="text-sm text-muted-foreground">• {session?.scheduledDate}</span>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                                {report.summary || "No summary"}
                              </p>
                              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                {submitter && <span>By: {submitter.name}</span>}
                                {approver && <span>Approved by: {approver.name}</span>}
                              </div>
                            </div>
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </Link>
                      )
                    })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Special Requests</CardTitle>
              <CardDescription>Requests related to this class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {specialRequests.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No special requests for this class</p>
                ) : (
                  specialRequests.map((request) => (
                    <Link key={request.id} href={`/requests/${request.id}`}>
                      <div className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                request.priority === "Urgent" || request.priority === "High"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {request.priority}
                            </Badge>
                            <Badge variant="outline">{request.status}</Badge>
                            <span className="font-medium">{request.title}</span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{request.type}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Files</CardTitle>
              <CardDescription>Documents and materials for this class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No files uploaded yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
