"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  getSessionById,
  getClassById,
  getStudentsByClass,
  getAttendanceBySession,
  getStudentNotesBySession,
  saveAttendance,
  saveStudentNotes,
  saveStudentMetrics,
  getStudentSessionMetrics,
  getParentCommunications,
  saveClassReport,
  getClassReportBySession,
} from "@/lib/data-access"
import type {
  Session,
  Class,
  Student,
  Attendance,
  StudentNote,
  ClassReport,
  StudentSessionMetrics,
  ParentCommunication,
} from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { SpeechToTextButton } from "@/components/speech-to-text-button"
import { AICommentButton } from "@/components/ai-comment-button"
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Users,
  Save,
  TrendingUp,
  MessageSquare,
  Home,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <SessionDetailClient id={resolvedParams.id} />
}

function SessionDetailClient({ id }: { id: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const { currentRole, currentUser } = useAuth()
  const [session, setSession] = useState<Session | null>(null)
  const [classData, setClassData] = useState<Class | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [notes, setNotes] = useState<StudentNote[]>([])
  const [report, setReport] = useState<ClassReport | null>(null)
  const [metrics, setMetrics] = useState<StudentSessionMetrics[]>([])
  const [communications, setCommunications] = useState<Record<string, ParentCommunication[]>>({})
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isStudentSheetOpen, setIsStudentSheetOpen] = useState(false)
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(new Set())
  const [studentComments, setStudentComments] = useState<Record<string, { positive: string; improvement: string }>>({})
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const sessionData = await getSessionById(id)
        if (!sessionData) {
          router.push("/sessions")
          return
        }
        setSession(sessionData)

        const cls = await getClassById(sessionData.classId)
        setClassData(cls || null)

        if (cls) {
          const [studentsData, attendanceData, notesData, reportData, metricsData] = await Promise.all([
            getStudentsByClass(cls.id),
            getAttendanceBySession(sessionData.id),
            getStudentNotesBySession(sessionData.id),
            getClassReportBySession(sessionData.id),
            getStudentSessionMetrics(sessionData.id),
          ])

          setStudents(studentsData)
          setAttendance(attendanceData)
          setNotes(notesData)
          setReport(reportData || null)
          setMetrics(metricsData)

          const comms: Record<string, ParentCommunication[]> = {}
          for (const student of studentsData) {
            const studentComms = await getParentCommunications(student.id)
            comms[student.id] = studentComms
          }
          setCommunications(comms)
        }
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, router])

  useEffect(() => {
    if (notes.length > 0 && Object.keys(studentComments).length === 0) {
      const commentsMap: Record<string, { positive: string; improvement: string }> = {}
      notes.forEach((note) => {
        if (!commentsMap[note.studentId]) {
          commentsMap[note.studentId] = { positive: "", improvement: "" }
        }
        if (note.noteType === "Positive") {
          commentsMap[note.studentId].positive = note.content
        } else if (note.noteType === "NeedsImprovement") {
          commentsMap[note.studentId].improvement = note.content
        }
      })
      setStudentComments(commentsMap)
    }
  }, [notes])

  const canEdit = currentRole === "TA" || currentRole === "Teacher"
  const canView = canEdit || currentRole === "ASA" || currentRole === "TQM"

  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true)
      try {
        console.log("[v0] Starting auto-save...")
        console.log("[v0] Attendance to save:", attendance.length)
        console.log("[v0] Comments to save:", Object.keys(studentComments).length)
        console.log("[v0] Metrics to save:", metrics.length)

        if (attendance.length > 0) {
          await saveAttendance(attendance)
          console.log("[v0] Attendance saved successfully")
        }

        const newNotes: StudentNote[] = []
        Object.entries(studentComments).forEach(([studentId, comments]) => {
          if (comments.positive) {
            newNotes.push({
              id: `note-${Date.now()}-${studentId}-positive`,
              sessionId: id,
              studentId,
              noteType: "Positive",
              frequency: "Daily",
              tags: [],
              content: comments.positive,
              createdBy: "current-user",
              createdAt: new Date().toISOString(),
            })
          }
          if (comments.improvement) {
            newNotes.push({
              id: `note-${Date.now()}-${studentId}-improvement`,
              sessionId: id,
              studentId,
              noteType: "NeedsImprovement",
              frequency: "Daily",
              tags: [],
              content: comments.improvement,
              parentSupportSuggestion: "Please review with your child at home",
              createdBy: "current-user",
              createdAt: new Date().toISOString(),
            })
          }
        })

        if (newNotes.length > 0) {
          await saveStudentNotes(newNotes)
          console.log("[v0] Notes saved:", newNotes.length)
          setNotes((prev) => [
            ...prev.filter((n) => n.sessionId !== id || !Object.keys(studentComments).includes(n.studentId)),
            ...newNotes,
          ])
        }

        if (metrics.length > 0) {
          await saveStudentMetrics(metrics)
          console.log("[v0] Metrics saved:", metrics.length)
        }

        const existingReport = await getClassReportBySession(id)
        const presentCount = attendance.filter((a) => a.status === "Present").length
        const totalStudents = students.length
        const reportSummary = `Session ${session?.sessionNumber}: ${session?.topic}. ${presentCount}/${totalStudents} students present. ${newNotes.length} comments recorded.`

        const classReport: ClassReport = {
          id: existingReport?.id || `report-${id}`,
          sessionId: id,
          summary: reportSummary,
          progressUpdate: `Completed lesson on ${session?.topic}`,
          areasForImprovement:
            newNotes
              .filter((n) => n.noteType === "NeedsImprovement")
              .map((n) => n.content)
              .join("; ") || "N/A",
          incidents: "None reported",
          nextActions: "Continue with next lesson",
          homeAssignment: session?.homeAssignment || "Review today's lesson",
          status: existingReport?.status === "Approved" ? "Approved" : "Draft",
          checklistItems: existingReport?.checklistItems || [],
          submittedBy: currentUser?.name || "Current User",
          submittedAt: new Date().toISOString(),
          approvedBy: existingReport?.approvedBy,
          approvedAt: existingReport?.approvedAt,
        }

        await saveClassReport(classReport)
        console.log("[v0] Saved class report")

        setLastSaved(new Date())
        toast({
          title: "Lưu thành công",
          description: `Đã lưu ${attendance.length} điểm danh, ${newNotes.length} nhận xét, và ${metrics.length} chỉ số`,
        })
        console.log("[v0] Auto-saved successfully at", new Date().toLocaleTimeString())
      } catch (error) {
        console.error("[v0] Auto-save failed:", error)
        toast({
          title: "Auto-save failed",
          description: "Please try again",
          variant: "destructive",
        })
      } finally {
        setIsSaving(false)
      }
    }, 2000)
  }, [attendance, studentComments, metrics, id, toast, session, students])

  useEffect(() => {
    if (!loading && (attendance.length > 0 || Object.keys(studentComments).length > 0 || metrics.length > 0)) {
      debouncedSave()
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [attendance, studentComments, metrics, loading, debouncedSave])

  const handleAttendanceToggle = (studentId: string) => {
    setAttendance((prev) => {
      const existing = prev.find((a) => a.studentId === studentId)
      if (existing) {
        return prev.map((a) =>
          a.studentId === studentId ? { ...a, status: a.status === "Present" ? "Absent" : "Present" } : a,
        )
      }
      return [
        ...prev,
        {
          id: `att-new-${studentId}`,
          sessionId: id,
          studentId,
          status: "Present",
        },
      ]
    })
  }

  const handleMetricUpdate = (studentId: string, field: string, value: any) => {
    setMetrics((prev) => {
      const existing = prev.find((m) => m.studentId === studentId)
      if (existing) {
        return prev.map((m) => (m.studentId === studentId ? { ...m, [field]: value } : m))
      }
      return [
        ...prev,
        {
          id: `metric-new-${studentId}`,
          sessionId: id,
          studentId,
          skillsBreakdown: { speaking: 3, listening: 3, reading: 3, writing: 3 },
          lessonObjectivesMastered: false,
          participationLevel: "Moderate" as const,
          attentionSpan: "Most" as const,
          peerInteraction: "Good" as const,
          englishUsage: false,
          homeworkCompletion: "Partial" as const,
          parentFollowedUp: false,
          updatedBy: "current-user",
          updatedAt: new Date().toISOString(),
          [field]: value,
        },
      ]
    })
  }

  const handleSaveAll = async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    setIsSaving(true)
    try {
      console.log("[v0] Manual save triggered")
      console.log("[v0] Current attendance state:", attendance)
      console.log("[v0] Current comments state:", studentComments)
      console.log("[v0] Current metrics state:", metrics)

      if (attendance.length > 0) {
        await saveAttendance(attendance)
        console.log("[v0] Saved attendance records:", attendance.length)
      }

      const newNotes: StudentNote[] = []
      Object.entries(studentComments).forEach(([studentId, comments]) => {
        if (comments.positive) {
          newNotes.push({
            id: `note-${Date.now()}-${studentId}-positive`,
            sessionId: id,
            studentId,
            noteType: "Positive",
            frequency: "Daily",
            tags: [],
            content: comments.positive,
            createdBy: "current-user",
            createdAt: new Date().toISOString(),
          })
        }
        if (comments.improvement) {
          newNotes.push({
            id: `note-${Date.now()}-${studentId}-improvement`,
            sessionId: id,
            studentId,
            noteType: "NeedsImprovement",
            frequency: "Daily",
            tags: [],
            content: comments.improvement,
            parentSupportSuggestion: "Please review with your child at home",
            createdBy: "current-user",
            createdAt: new Date().toISOString(),
          })
        }
      })

      if (newNotes.length > 0) {
        await saveStudentNotes(newNotes)
        console.log("[v0] Saved notes:", newNotes)
        setNotes((prev) => [
          ...prev.filter((n) => n.sessionId !== id || !Object.keys(studentComments).includes(n.studentId)),
          ...newNotes,
        ])
      }

      if (metrics.length > 0) {
        await saveStudentMetrics(metrics)
        console.log("[v0] Saved metrics:", metrics.length)
      }

      const existingReport = await getClassReportBySession(id)
      const presentCount = attendance.filter((a) => a.status === "Present").length
      const totalStudents = students.length
      const reportSummary = `Session ${session?.sessionNumber}: ${session?.topic}. ${presentCount}/${totalStudents} students present. ${newNotes.length} comments recorded.`

      const classReport: ClassReport = {
        id: existingReport?.id || `report-${id}`,
        sessionId: id,
        summary: reportSummary,
        progressUpdate: `Completed lesson on ${session?.topic}`,
        areasForImprovement:
          newNotes
            .filter((n) => n.noteType === "NeedsImprovement")
            .map((n) => n.content)
            .join("; ") || "N/A",
        incidents: "None reported",
        nextActions: "Continue with next lesson",
        homeAssignment: session?.homeAssignment || "Review today's lesson",
        status: existingReport?.status === "Approved" ? "Approved" : "Draft",
        checklistItems: existingReport?.checklistItems || [],
        submittedBy: currentUser?.name || "Current User",
        submittedAt: new Date().toISOString(),
        approvedBy: existingReport?.approvedBy,
        approvedAt: existingReport?.approvedAt,
      }

      await saveClassReport(classReport)
      console.log("[v0] Saved class report")

      setExpandedStudents(new Set())

      setLastSaved(new Date())

      toast({
        title: "Lưu thành công",
        description: `Đã lưu ${attendance.length} điểm danh, ${newNotes.length} nhận xét, và ${metrics.length} chỉ số`,
      })

      console.log("[v0] Save completed successfully")
    } catch (error) {
      console.error("[v0] Save failed:", error)
      toast({
        title: "Save failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleStudentClick = (studentId: string) => {
    setSelectedStudent(studentId)
    setIsStudentSheetOpen(true)
  }

  const handleToggleExpand = (studentId: string) => {
    setExpandedStudents((prev) => {
      const next = new Set(prev)
      if (next.has(studentId)) {
        next.delete(studentId)
      } else {
        next.add(studentId)
      }
      return next
    })
  }

  const handleCommentChange = (studentId: string, field: "positive" | "improvement", value: string) => {
    setStudentComments((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }))
  }

  const handleSliderChange = (studentId: string, value: number) => {
    setSliderValues((prev) => ({
      ...prev,
      [studentId]: value,
    }))
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-96 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (!session || !classData) {
    return null
  }

  const presentCount = attendance.filter((a) => a.status === "Present").length
  const totalStudents = students.length
  const attentiveCount = students.filter((s) => s.riskLevel === "Yellow").length
  const atRiskCount = students.filter((s) => s.riskLevel === "Red").length
  const newStudentsCount = students.filter((s) => s.isNewStudent).length

  const selectedStudentData = selectedStudent ? students.find((s) => s.id === selectedStudent) : null
  const selectedStudentMetrics = selectedStudent ? metrics.find((m) => m.studentId === selectedStudent) : null
  const selectedStudentComms = selectedStudent ? communications[selectedStudent] || [] : []
  const selectedStudentSkills = selectedStudentMetrics?.skillsBreakdown || {
    speaking: 3,
    listening: 3,
    reading: 3,
    writing: 3,
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <Toaster />

      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/sessions">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Daily Class Reports</h1>
        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          {isSaving && (
            <>
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span>Saving...</span>
            </>
          )}
          {!isSaving && lastSaved && (
            <>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            </>
          )}
        </div>
      </div>

      {/* Main Card */}
      <Card className="mx-auto max-w-7xl">
        <CardContent className="p-8">
          {/* Lesson Header */}
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                Lesson {session.sessionNumber}: {session.scheduledDate}
              </h2>
            </div>
          </div>

          {/* Teacher/TA Info */}
          <div className="mb-6 text-sm">
            <span className="font-semibold">Teacher:</span> {session.teacherName} |{" "}
            <span className="font-semibold">TA:</span> {session.taName}
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-4 gap-4">
            <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <div className="text-lg font-semibold">
                  {presentCount}/{totalStudents}
                </div>
                <div className="text-sm text-muted-foreground">Present</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-orange-50 p-4 dark:bg-orange-950/20">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <div>
                <div className="text-lg font-semibold">{attentiveCount}</div>
                <div className="text-sm text-muted-foreground">Attentive</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-amber-50 p-4 dark:bg-amber-950/20">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <div>
                <div className="text-lg font-semibold">{atRiskCount}</div>
                <div className="text-sm text-muted-foreground">At Risk</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-lg font-semibold">{newStudentsCount}</div>
                <div className="text-sm text-muted-foreground">New</div>
              </div>
            </div>
          </div>

          {/* Lesson Details Table */}
          <div className="mb-8 overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Book Pages
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Unit Number
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Lesson Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Lesson Objectives
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-4 text-sm">{session.bookPages || "N/A"}</td>
                  <td className="px-4 py-4 text-sm">{session.unitNumber || "N/A"}</td>
                  <td className="px-4 py-4 text-sm">{session.lessonTitle || "No lesson title available"}</td>
                  <td className="px-4 py-4 text-sm">{session.lessonObjectives || "No objectives specified"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Student List with Attendance */}
          <div className="mb-4">
            <h3 className="mb-4 text-lg font-semibold">Students</h3>

            <div className="space-y-2">
              {students.map((student) => {
                const studentAttendance = attendance.find((a) => a.studentId === student.id)
                const isPresent = studentAttendance?.status === "Present"
                const riskLevel = student.riskLevel
                const isExpanded = expandedStudents.has(student.id)
                const comments = studentComments[student.id] || { positive: "", improvement: "" }
                const sliderValue = sliderValues[student.id] || 3

                return (
                  <div
                    key={student.id}
                    className={cn(
                      "rounded-lg border transition-all",
                      riskLevel === "Yellow" && "bg-amber-50 dark:bg-amber-950/10",
                      riskLevel === "Red" && "bg-red-50 dark:bg-red-950/10",
                      !riskLevel && "bg-cyan-50/50 dark:bg-cyan-950/10",
                    )}
                  >
                    {/* Student row header */}
                    <div
                      className="flex cursor-pointer items-center justify-between p-4 hover:bg-accent/5"
                      onClick={() => handleToggleExpand(student.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.fullName} />
                          <AvatarFallback>{student.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{student.fullName}</span>
                        {riskLevel === "Yellow" && (
                          <Badge variant="outline" className="border-orange-500 bg-orange-50 text-orange-700">
                            Attentive Care
                          </Badge>
                        )}
                        {riskLevel === "Red" && (
                          <Badge variant="outline" className="border-red-500 bg-red-50 text-red-700">
                            At Risk
                          </Badge>
                        )}
                        {student.isNewStudent && (
                          <Badge variant="outline" className="border-blue-500 bg-blue-50 text-blue-700">
                            New Student
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleExpand(student.id)
                            }}
                            className="text-sm"
                          >
                            {isExpanded ? "Hide Comments" : "Add Comments"}
                          </Button>
                        )}
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={isPresent}
                            onCheckedChange={() => canEdit && handleAttendanceToggle(student.id)}
                            disabled={!canEdit}
                          />
                          <Label
                            className="cursor-pointer text-sm font-medium"
                            onClick={() => canEdit && handleAttendanceToggle(student.id)}
                          >
                            Attendance
                          </Label>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t bg-background/50 p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`positive-${student.id}`} className="text-sm font-medium">
                              Positive Comment
                              <span className="ml-1 text-xs text-muted-foreground">(Required)</span>
                            </Label>
                            <div className="flex gap-2 mb-2">
                              {canEdit && (
                                <AICommentButton
                                  studentData={{
                                    id: student.id,
                                    fullName: student.fullName,
                                    riskLevel: student.riskLevel,
                                  }}
                                  type="positive"
                                  onSelect={(suggestion) => {
                                    handleCommentChange(student.id, "positive", suggestion)
                                  }}
                                />
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Textarea
                                id={`positive-${student.id}`}
                                placeholder="e.g., Em rất tích cực tham gia hoạt động nhóm và nhiệt tình giúp đỡ bạn..."
                                value={comments.positive}
                                onChange={(e) => handleCommentChange(student.id, "positive", e.target.value)}
                                className="min-h-[100px] flex-1"
                                disabled={!canEdit}
                              />
                              {canEdit && (
                                <SpeechToTextButton
                                  onTranscript={(text) => {
                                    handleCommentChange(
                                      student.id,
                                      "positive",
                                      comments.positive ? `${comments.positive} ${text}` : text,
                                    )
                                  }}
                                />
                              )}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor={`improvement-${student.id}`} className="text-sm font-medium">
                              Area for Improvement
                              <span className="ml-1 text-xs text-muted-foreground">(Optional)</span>
                            </Label>
                            <div className="flex gap-2 mb-2">
                              {canEdit && (
                                <AICommentButton
                                  studentData={{
                                    id: student.id,
                                    fullName: student.fullName,
                                    riskLevel: student.riskLevel,
                                  }}
                                  type="improvement"
                                  onSelect={(suggestion) => {
                                    handleCommentChange(student.id, "improvement", suggestion)
                                  }}
                                />
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Textarea
                                id={`improvement-${student.id}`}
                                placeholder="e.g., Em cần tập trung hơn trong giờ học..."
                                value={comments.improvement}
                                onChange={(e) => handleCommentChange(student.id, "improvement", e.target.value)}
                                className="min-h-[100px] flex-1"
                                disabled={!canEdit}
                              />
                              {canEdit && (
                                <SpeechToTextButton
                                  onTranscript={(text) => {
                                    handleCommentChange(
                                      student.id,
                                      "improvement",
                                      comments.improvement ? `${comments.improvement} ${text}` : text,
                                    )
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        {canView && (
                          <div className="mt-3 flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleStudentClick(student.id)}>
                              View Full Details
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Save All Button - positioned at bottom */}
          {canEdit && (
            <div className="sticky bottom-6 mt-8 flex justify-end">
              <Button size="lg" onClick={handleSaveAll} disabled={isSaving} className="shadow-lg">
                <Save className="mr-2 h-5 w-5" />
                {isSaving ? "Saving..." : "Save All Edits"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={isStudentSheetOpen} onOpenChange={setIsStudentSheetOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          {selectedStudentData && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={selectedStudentData.avatar || "/placeholder.svg"}
                      alt={selectedStudentData.fullName}
                    />
                    <AvatarFallback>{selectedStudentData.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-xl">{selectedStudentData.fullName}</SheetTitle>
                    <p className="text-sm text-muted-foreground">
                      Guardian: {selectedStudentData.guardianName} | {selectedStudentData.guardianPhone}
                    </p>
                    {!canEdit && (
                      <Badge variant="outline" className="mt-2">
                        View Only
                      </Badge>
                    )}
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6">
                <Tabs defaultValue="progress" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="progress">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Progress
                    </TabsTrigger>
                    <TabsTrigger value="behavior">Behavior</TabsTrigger>
                    <TabsTrigger value="homework">
                      <Home className="mr-2 h-4 w-4" />
                      Homework
                    </TabsTrigger>
                    <TabsTrigger value="communication">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Parent
                    </TabsTrigger>
                  </TabsList>

                  {/* Progress Tab */}
                  <TabsContent value="progress" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Speaking</Label>
                        <Slider
                          value={[selectedStudentSkills.speaking]}
                          onValueChange={(v: number[]) =>
                            handleMetricUpdate(selectedStudent!, "skillsBreakdown", {
                              ...selectedStudentSkills,
                              speaking: v[0],
                            })
                          }
                          max={5}
                          min={1}
                          step={1}
                          disabled={!canEdit}
                        />
                        <span className="text-xs text-muted-foreground">{selectedStudentSkills.speaking}/5</span>
                      </div>

                      <div className="space-y-2">
                        <Label>Listening</Label>
                        <Slider
                          value={[selectedStudentSkills.listening]}
                          onValueChange={(v: number[]) =>
                            handleMetricUpdate(selectedStudent!, "skillsBreakdown", {
                              ...selectedStudentSkills,
                              listening: v[0],
                            })
                          }
                          max={5}
                          min={1}
                          step={1}
                          disabled={!canEdit}
                        />
                        <span className="text-xs text-muted-foreground">{selectedStudentSkills.listening}/5</span>
                      </div>

                      <div className="space-y-2">
                        <Label>Reading</Label>
                        <Slider
                          value={[selectedStudentSkills.reading]}
                          onValueChange={(v: number[]) =>
                            handleMetricUpdate(selectedStudent!, "skillsBreakdown", {
                              ...selectedStudentSkills,
                              reading: v[0],
                            })
                          }
                          max={5}
                          min={1}
                          step={1}
                          disabled={!canEdit}
                        />
                        <span className="text-xs text-muted-foreground">{selectedStudentSkills.reading}/5</span>
                      </div>

                      <div className="space-y-2">
                        <Label>Writing</Label>
                        <Slider
                          value={[selectedStudentSkills.writing]}
                          onValueChange={(v: number[]) =>
                            handleMetricUpdate(selectedStudent!, "skillsBreakdown", {
                              ...selectedStudentSkills,
                              writing: v[0],
                            })
                          }
                          max={5}
                          min={1}
                          step={1}
                          disabled={!canEdit}
                        />
                        <span className="text-xs text-muted-foreground">{selectedStudentSkills.writing}/5</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Participation Level</Label>
                      <Select
                        value={selectedStudentMetrics?.participationLevel || "Moderate"}
                        onValueChange={(v: string) => handleMetricUpdate(selectedStudent!, "participationLevel", v)}
                        disabled={!canEdit}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Passive">Passive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="objectives"
                        checked={selectedStudentMetrics?.lessonObjectivesMastered || false}
                        onCheckedChange={(checked) =>
                          handleMetricUpdate(selectedStudent!, "lessonObjectivesMastered", checked)
                        }
                        disabled={!canEdit}
                      />
                      <Label htmlFor="objectives" className="text-sm font-normal">
                        Mastered lesson objectives
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Achievements Today</Label>
                      <Textarea
                        placeholder="What did this student do well today?"
                        value={selectedStudentMetrics?.achievementsToday || ""}
                        onChange={(e) => handleMetricUpdate(selectedStudent!, "achievementsToday", e.target.value)}
                        className="min-h-20"
                        disabled={!canEdit}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Growth Moments</Label>
                      <Textarea
                        placeholder="Notable improvements or breakthroughs"
                        value={selectedStudentMetrics?.growthMoments || ""}
                        onChange={(e) => handleMetricUpdate(selectedStudent!, "growthMoments", e.target.value)}
                        className="min-h-20"
                        disabled={!canEdit}
                      />
                    </div>
                  </TabsContent>

                  {/* Behavior Tab */}
                  <TabsContent value="behavior" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Attention Span</Label>
                      <Select
                        value={selectedStudentMetrics?.attentionSpan || "Most"}
                        onValueChange={(v: string) => handleMetricUpdate(selectedStudent!, "attentionSpan", v)}
                        disabled={!canEdit}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full">Full Class</SelectItem>
                          <SelectItem value="Most">Most of Class</SelectItem>
                          <SelectItem value="Struggled">Struggled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Peer Interaction</Label>
                      <Select
                        value={selectedStudentMetrics?.peerInteraction || "Good"}
                        onValueChange={(v: string) => handleMetricUpdate(selectedStudent!, "peerInteraction", v)}
                        disabled={!canEdit}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="NeedsSupport">Needs Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="english-usage"
                        checked={selectedStudentMetrics?.englishUsage || false}
                        onCheckedChange={(checked) => handleMetricUpdate(selectedStudent!, "englishUsage", checked)}
                        disabled={!canEdit}
                      />
                      <Label htmlFor="english-usage" className="text-sm font-normal">
                        Actively spoke English in class
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Action Taken</Label>
                      <Textarea
                        placeholder="What did you do when student struggled..."
                        value={selectedStudentMetrics?.actionTaken || ""}
                        onChange={(e) => handleMetricUpdate(selectedStudent!, "actionTaken", e.target.value)}
                        rows={2}
                        disabled={!canEdit}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Next Steps</Label>
                      <Textarea
                        placeholder="What to focus on next class..."
                        value={selectedStudentMetrics?.nextSteps || ""}
                        onChange={(e) => handleMetricUpdate(selectedStudent!, "nextSteps", e.target.value)}
                        rows={3}
                        disabled={!canEdit}
                      />
                    </div>
                  </TabsContent>

                  {/* Homework Tab */}
                  <TabsContent value="homework" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Homework Completion</Label>
                      <Select
                        value={selectedStudentMetrics?.homeworkCompletion || "Partial"}
                        onValueChange={(v: string) => handleMetricUpdate(selectedStudent!, "homeworkCompletion", v)}
                        disabled={!canEdit}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Completed</SelectItem>
                          <SelectItem value="Partial">Partial</SelectItem>
                          <SelectItem value="No">Not Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Homework Quality</Label>
                      <Select
                        value={selectedStudentMetrics?.homeworkQuality || "Good"}
                        onValueChange={(v: string) => handleMetricUpdate(selectedStudent!, "homeworkQuality", v)}
                        disabled={!canEdit}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="NeedsImprovement">Needs Improvement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="parent-followup"
                        checked={selectedStudentMetrics?.parentFollowedUp || false}
                        onCheckedChange={(checked) => handleMetricUpdate(selectedStudent!, "parentFollowedUp", checked)}
                        disabled={!canEdit}
                      />
                      <Label htmlFor="parent-followup" className="text-sm font-normal">
                        Parent follow-up completed
                      </Label>
                    </div>
                  </TabsContent>

                  {/* Parent Communication Tab */}
                  <TabsContent value="communication" className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Communication History</Label>
                      {selectedStudentComms.length > 0 ? (
                        <div className="space-y-2">
                          {selectedStudentComms.map((comm) => (
                            <Card key={comm.id} className="bg-muted/50">
                              <CardContent className="p-3">
                                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                                  <span>{comm.date}</span>
                                  <Badge variant="outline">{comm.topic}</Badge>
                                </div>
                                <p className="text-sm">{comm.outcome}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No parent communications recorded yet.</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
