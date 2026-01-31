"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth-context"
import {
  getSessions,
  getClasses,
  getCenters,
  getAllClassReports,
  getStudents,
  getEnrollments,
  getAttendance,
  getStudentNotes,
} from "@/lib/data-access"
import type { ClassReport, Session, Class, Center, Student, Attendance, StudentNote } from "@/lib/types"
import { format } from "date-fns"
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Users,
  BookOpen,
  MessageSquare,
  CheckSquare,
  User,
  AlertTriangle,
  ThumbsUp,
  Lightbulb,
  Edit,
  Download,
  Printer,
} from "lucide-react"
import Link from "next/link"
import { RiskIndicator } from "@/components/risk-indicator"
import { use } from "react"

interface ReportWithDetails extends ClassReport {
  session: Session
  class: Class
  center: Center
}

interface StudentWithAttendance extends Student {
  attendance?: Attendance
  notes: StudentNote[]
}

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  return <ReportDetailClient reportId={resolvedParams.id} />
}

function ReportDetailClient({ reportId }: { reportId: string }) {
  const router = useRouter()
  const { currentUser } = useAuth()
  const [report, setReport] = useState<ReportWithDetails | null>(null)
  const [students, setStudents] = useState<StudentWithAttendance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (reportId) {
      loadReport()
    }
  }, [reportId])

  const loadReport = async () => {
    setLoading(true)
    try {
      const allReports = await getAllClassReports()
      const sessionsData = await getSessions()
      const classesData = await getClasses()
      const centersData = await getCenters(currentUser?.id)

      console.log("[v0] Looking for report ID:", reportId)
      console.log(
        "[v0] Available reports:",
        allReports.map((r) => ({ id: r.id, sessionId: r.sessionId })),
      )

      const foundReport = allReports.find((r) => r.id === reportId || r.sessionId === reportId)

      if (!foundReport) {
        console.log("[v0] Report not found for ID:", reportId)
        setLoading(false)
        return
      }

      const session = sessionsData.find((s) => s.id === foundReport.sessionId)
      if (!session) {
        setLoading(false)
        return
      }

      const classData = classesData.find((c) => c.id === session.classId)
      if (!classData) {
        setLoading(false)
        return
      }

      const center = centersData.find((c) => c.id === classData.centerId)

      setReport({
        ...foundReport,
        session,
        class: classData,
        center: center!,
      })

      const allStudents = await getStudents()
      const enrollments = await getEnrollments()
      const attendanceData = await getAttendance(session.id)
      const notesData = await getStudentNotes(session.id)

      const classEnrollments = enrollments.filter((e) => e.classId === classData.id && e.status === "Active")
      const classStudents = classEnrollments
        .map((enrollment) => {
          const student = allStudents.find((s) => s.id === enrollment.studentId)
          if (!student) return null

          const attendance = attendanceData.find((a) => a.studentId === student.id)
          const notes = notesData.filter((n) => n.studentId === student.id)

          return {
            ...student,
            attendance,
            notes,
          }
        })
        .filter(Boolean) as StudentWithAttendance[]

      setStudents(classStudents)
    } catch (error) {
      console.error("Error loading report:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const config: Record<
      string,
      { variant: "default" | "secondary" | "outline"; icon: React.ReactNode; className: string }
    > = {
      Draft: {
        variant: "secondary",
        icon: <Clock className="h-3 w-3" />,
        className: "bg-gray-100 text-gray-700 border-gray-300",
      },
      Submitted: {
        variant: "outline",
        icon: <FileText className="h-3 w-3" />,
        className: "bg-blue-50 text-blue-700 border-blue-300",
      },
      Approved: {
        variant: "outline",
        icon: <CheckCircle className="h-3 w-3" />,
        className: "bg-green-50 text-green-700 border-green-300",
      },
    }
    const { variant, icon, className } = config[status] || config.Draft

    return (
      <Badge variant={variant} className={`gap-1 ${className}`}>
        {icon}
        {status}
      </Badge>
    )
  }

  const getAttendanceStats = () => {
    const present = students.filter((s) => s.attendance?.status === "Present").length
    const absent = students.filter((s) => s.attendance?.status === "Absent").length
    const late = students.filter((s) => s.attendance?.status === "Late").length
    return { present, absent, late, total: students.length }
  }

  const getNotesStats = () => {
    const positive = students.reduce((acc, s) => acc + s.notes.filter((n) => n.noteType === "Positive").length, 0)
    const improvement = students.reduce(
      (acc, s) => acc + s.notes.filter((n) => n.noteType === "NeedsImprovement").length,
      0,
    )
    return { positive, improvement, total: positive + improvement }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
        <p className="text-muted-foreground mb-4">The report you are looking for does not exist.</p>
        <Button onClick={() => router.push("/reports")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </Button>
      </div>
    )
  }

  const attendanceStats = getAttendanceStats()
  const notesStats = getNotesStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/reports")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{report.class.code}</h1>
              {getStatusBadge(report.status)}
            </div>
            <p className="text-muted-foreground">
              Lesson {report.session.sessionNumber} -{" "}
              {format(new Date(report.session.scheduledDate), "EEEE, dd/MM/yyyy")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Link href={`/sessions/${report.sessionId}`}>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Report
            </Button>
          </Link>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Topic</p>
                <p className="font-medium">{report.session.topic}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attendance</p>
                <p className="font-medium text-green-600">
                  {attendanceStats.present}/{attendanceStats.total} Present
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Comments</p>
                <p className="font-medium text-blue-600">{notesStats.total} Notes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teacher / TA</p>
                <p className="font-medium text-purple-600 text-sm">{report.session.teacherName || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <FileText className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <Users className="h-4 w-4 mr-2" />
            Attendance ({attendanceStats.present}/{attendanceStats.total})
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="h-4 w-4 mr-2" />
            Comments ({notesStats.total})
          </TabsTrigger>
          <TabsTrigger value="checklist">
            <CheckSquare className="h-4 w-4 mr-2" />
            Checklist
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Lesson Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Lesson Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Book Pages</p>
                    <p className="font-medium">{report.session.bookPages || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Unit</p>
                    <p className="font-medium">{report.session.unitNumber || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Lesson Title</p>
                    <p className="font-medium">{report.session.lessonTitle || report.session.topic}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Learning Objectives</p>
                    <p className="font-medium">{report.session.lessonObjectives || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Report Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Report Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Summary</p>
                  <p className="text-sm">{report.summary || "No summary provided."}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Progress Update</p>
                  <p className="text-sm">{report.progressUpdate || "No progress update."}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Home Assignment</p>
                  <p className="text-sm">{report.homeAssignment || report.session.homeAssignment || "N/A"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Areas for Improvement */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{report.areasForImprovement || "No areas identified."}</p>
              </CardContent>
            </Card>

            {/* Incidents & Next Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Incidents & Next Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Incidents</p>
                  <p className="text-sm">{report.incidents || "No incidents reported."}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Next Actions</p>
                  <p className="text-sm">{report.nextActions || "No actions planned."}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submission Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-6">
                  {report.submittedBy && (
                    <span className="text-muted-foreground">
                      Submitted by <span className="font-medium text-foreground">{report.submittedBy}</span>
                      {report.submittedAt && ` on ${format(new Date(report.submittedAt), "dd/MM/yyyy HH:mm")}`}
                    </span>
                  )}
                  {report.approvedBy && (
                    <span className="text-muted-foreground">
                      Approved by <span className="font-medium text-foreground">{report.approvedBy}</span>
                      {report.approvedAt && ` on ${format(new Date(report.approvedAt), "dd/MM/yyyy HH:mm")}`}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Student Attendance</CardTitle>
              <CardDescription>
                {attendanceStats.present} present, {attendanceStats.late} late, {attendanceStats.absent} absent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      student.attendance?.status === "Present"
                        ? "bg-green-50 border-green-200"
                        : student.attendance?.status === "Late"
                          ? "bg-amber-50 border-amber-200"
                          : student.attendance?.status === "Absent"
                            ? "bg-red-50 border-red-200"
                            : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {student.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{student.fullName}</p>
                          <RiskIndicator level={student.riskLevel || "Green"} />
                        </div>
                        <p className="text-xs text-muted-foreground">{student.attendance?.reason || ""}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        student.attendance?.status === "Present"
                          ? "default"
                          : student.attendance?.status === "Late"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {student.attendance?.status || "Not Recorded"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Positive Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-green-500" />
                  Positive Comments ({notesStats.positive})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {students.flatMap((student) =>
                  student.notes
                    .filter((note) => note.noteType === "Positive")
                    .map((note) => (
                      <div key={note.id} className="p-3 rounded-lg bg-green-50 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={student.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">{student.fullName[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{student.fullName}</span>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </div>
                    )),
                )}
                {notesStats.positive === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No positive comments recorded.</p>
                )}
              </CardContent>
            </Card>

            {/* Areas for Improvement */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Areas for Improvement ({notesStats.improvement})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {students.flatMap((student) =>
                  student.notes
                    .filter((note) => note.noteType === "NeedsImprovement")
                    .map((note) => (
                      <div key={note.id} className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={student.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">{student.fullName[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{student.fullName}</span>
                        </div>
                        <p className="text-sm">{note.content}</p>
                        {note.parentSupportSuggestion && (
                          <p className="text-xs text-muted-foreground mt-2">
                            <span className="font-medium">Parent support:</span> {note.parentSupportSuggestion}
                          </p>
                        )}
                      </div>
                    )),
                )}
                {notesStats.improvement === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No improvement areas recorded.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Checklist Tab */}
        <TabsContent value="checklist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-primary" />
                Daily Checklist
              </CardTitle>
              <CardDescription>
                {report.checklistItems?.filter((item) => item.checked).length || 0} of{" "}
                {report.checklistItems?.length || 0} items completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.checklistItems?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <Checkbox checked={item.checked} disabled />
                    <div>
                      <p className={`font-medium ${item.checked ? "line-through text-muted-foreground" : ""}`}>
                        {item.label}
                      </p>
                      <p className="text-sm text-muted-foreground">{item.labelVN}</p>
                    </div>
                    {item.required && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                )) || <p className="text-sm text-muted-foreground text-center py-4">No checklist items available.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
