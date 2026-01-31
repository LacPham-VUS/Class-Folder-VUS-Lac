"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  getStudents,
  getClassById,
  getEnrollments,
  getStudentNotesByStudent,
  getParentCommunications,
  getSpecialRequests,
  getStudentPhotos,
  getStudentMetrics,
  getSessions,
} from "@/lib/data-access"
import type {
  Student,
  Class,
  StudentNote,
  ParentCommunication,
  SpecialRequest,
  StudentPhoto,
  StudentSessionMetrics,
  Session,
} from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Phone, Mail, ImageIcon, TrendingUp, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface StudentDetailClientProps {
  studentId: string
}

export function StudentDetailClient({ studentId }: StudentDetailClientProps) {
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [studentClass, setStudentClass] = useState<Class | null>(null)
  const [notes, setNotes] = useState<StudentNote[]>([])
  const [communications, setCommunications] = useState<ParentCommunication[]>([])
  const [requests, setRequests] = useState<SpecialRequest[]>([])
  const [photos, setPhotos] = useState<StudentPhoto[]>([])
  const [metrics, setMetrics] = useState<StudentSessionMetrics[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStudentData()
  }, [studentId])

  async function loadStudentData() {
    try {
      setLoading(true)

      const studentsData = await getStudents()
      const foundStudent = studentsData.find((s) => s.id === studentId)

      if (!foundStudent) {
        setLoading(false)
        return
      }

      setStudent(foundStudent)

      const [enrollmentsData, notesData, commsData, requestsData, photosData, metricsData] = await Promise.all([
        getEnrollments(studentId),
        getStudentNotesByStudent(studentId),
        getParentCommunications(studentId),
        getSpecialRequests({}),
        getStudentPhotos({ studentId }),
        getStudentMetrics({ studentId }),
      ])

      const activeEnrollment = enrollmentsData.find((e: any) => e.status === "Active")
      if (activeEnrollment) {
        const classData = await getClassById(activeEnrollment.classId)
        setStudentClass(classData || null)

        // Load sessions for the class
        const allSessions = await getSessions()
        const classSessions = allSessions.filter((s) => s.classId === activeEnrollment.classId)
        setSessions(classSessions)
      }

      setNotes(notesData)
      setCommunications(commsData)
      setRequests(requestsData)
      setPhotos(photosData)
      setMetrics(metricsData)
    } catch (error) {
      console.error("Failed to load student data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const completedSessions = sessions.filter((s) => s.status === "Completed").length
  const attendanceRate = metrics.length > 0 ? Math.round((metrics.length / completedSessions) * 100) : 0
  const positiveNotes = notes.filter((n) => n.noteType === "Positive").length
  const improvementNotes = notes.filter((n) => n.noteType === "NeedsImprovement").length
  const openRequests = requests.filter((r) => r.status !== "Resolved" && r.status !== "Closed").length

  // Calculate average skill scores
  const avgSkills =
    metrics.length > 0
      ? {
          speaking: metrics.reduce((sum, m) => sum + (m.skillsBreakdown?.speaking || 0), 0) / metrics.length,
          listening: metrics.reduce((sum, m) => sum + (m.skillsBreakdown?.listening || 0), 0) / metrics.length,
          reading: metrics.reduce((sum, m) => sum + (m.skillsBreakdown?.reading || 0), 0) / metrics.length,
          writing: metrics.reduce((sum, m) => sum + (m.skillsBreakdown?.writing || 0), 0) / metrics.length,
        }
      : null

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6 p-3 md:p-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 p-4">
        <AlertCircle className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
        <h2 className="text-xl md:text-2xl font-bold text-center">Student Not Found</h2>
        <p className="text-sm md:text-base text-muted-foreground text-center">The student with ID "{studentId}" does not exist.</p>
        <Button onClick={() => router.push("/students")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6 p-3 md:p-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3 md:gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/students")} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl md:text-3xl font-bold">Student Profile</h1>
          <p className="text-sm md:text-base text-muted-foreground">Chi tiết thông tin học viên</p>
        </div>
      </div>

      {/* Student Header Card */}
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <Avatar className="h-20 w-20 md:h-32 md:w-32 mx-auto md:mx-0">
              <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.fullName} />
              <AvatarFallback className="text-lg md:text-2xl">
                {student.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3 md:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="text-center sm:text-left">
                  <h2 className="text-xl md:text-3xl font-bold">{student.fullName}</h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 md:gap-3 mt-2 text-muted-foreground text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                      <span>{student.dateOfBirth}</span>
                    </div>
                    {student.status && (
                      <Badge variant={student.status === "Active" ? "default" : "secondary"} className="text-xs">{student.status}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 justify-center sm:justify-end">
                  {student.riskLevel && (
                    <Badge
                      variant={
                        student.riskLevel === "Green"
                          ? "default"
                          : student.riskLevel === "Yellow"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-sm md:text-lg px-2 md:px-4 py-0.5 md:py-1"
                    >
                      {student.riskLevel}
                    </Badge>
                  )}
                  {student.isNewStudent && (
                    <Badge variant="outline" className="border-blue-600 text-blue-600 text-sm md:text-lg px-2 md:px-4 py-0.5 md:py-1">
                      New Student
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact Info */}
                <div>
                  <h3 className="font-semibold mb-2 text-sm md:text-base">Contact Information</h3>
                  <div className="space-y-2 text-xs md:text-sm">
                    {student.guardianName && (
                      <div>
                        <span className="text-muted-foreground">Phụ huynh:</span>{" "}
                        <span className="font-medium">{student.guardianName}</span>
                      </div>
                    )}
                    {student.guardianPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                        <span>{student.guardianPhone}</span>
                      </div>
                    )}
                    {student.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                        <span className="truncate">{student.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Class Info */}
                {studentClass && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm md:text-base">Current Class</h3>
                    <div className="p-3 md:p-4 bg-muted rounded-lg">
                      <p className="text-lg md:text-xl font-bold">{studentClass.code}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {studentClass.program} - {studentClass.level}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1">{studentClass.shift} Shift</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="text-xl md:text-2xl font-bold">{attendanceRate}%</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              {metrics.length} / {completedSessions} sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">Positive Notes</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="text-xl md:text-2xl font-bold text-green-600">{positiveNotes}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">Total commendations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="text-xl md:text-2xl font-bold text-orange-600">{improvementNotes}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">Notes recorded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium">Open Requests</CardTitle>
            <AlertCircle className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="text-xl md:text-2xl font-bold">{openRequests}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">Pending actions</p>
          </CardContent>
        </Card>
      </div>

      {/* Skills Breakdown */}
      {avgSkills && (
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Skills Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              {Object.entries(avgSkills).map(([skill, score]) => (
                <div key={skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm font-medium capitalize">{skill}</span>
                    <span className="text-lg md:text-2xl font-bold">{score.toFixed(1)}</span>
                  </div>
                  <div className="h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(score / 5) * 100}%` }} />
                  </div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">out of 5.0</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Tabs */}
      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="photos">
            <ImageIcon className="mr-2 h-4 w-4" />
            Photos ({photos.length})
          </TabsTrigger>
          <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
          <TabsTrigger value="metrics">Metrics ({metrics.length})</TabsTrigger>
          <TabsTrigger value="communications">Comms ({communications.length})</TabsTrigger>
          <TabsTrigger value="requests">Requests ({requests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="space-y-4">
          {photos.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">No photos recorded yet</CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={photo.imageUrl || "/placeholder.svg"}
                      alt={photo.caption || "Student photo"}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm">{photo.caption}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(photo.takenAt).toLocaleDateString("vi-VN")}
                    </p>
                    {photo.tags && photo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {photo.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="notes" className="space-y-3">
          {notes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">No notes recorded yet</CardContent>
            </Card>
          ) : (
            notes.map((note) => (
              <Card key={note.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant={
                        note.noteType === "Positive"
                          ? "default"
                          : note.noteType === "NeedsImprovement"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {note.noteType}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(note.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <p className="text-sm">{note.content}</p>
                  {note.parentSupportSuggestion && (
                    <div className="mt-2 p-2 bg-muted rounded text-xs">
                      <strong>Parent Support:</strong> {note.parentSupportSuggestion}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-3">
          {metrics.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">No metrics recorded yet</CardContent>
            </Card>
          ) : (
            metrics.map((metric) => (
              <Card key={metric.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium">Session Metrics</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(metric.updatedAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Participation:</span>{" "}
                      <Badge variant="outline">{metric.participationLevel}</Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Attention:</span>{" "}
                      <Badge variant="outline">{metric.attentionSpan}</Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Homework:</span>{" "}
                      <Badge variant="outline">{metric.homeworkCompletion}</Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Peer Work:</span>{" "}
                      <Badge variant="outline">{metric.peerInteraction}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="communications" className="space-y-3">
          {communications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No parent communications yet
              </CardContent>
            </Card>
          ) : (
            communications.map((comm) => (
              <Card key={comm.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{comm.topic}</p>
                      <p className="text-xs text-muted-foreground">
                        {comm.method} - {new Date(comm.date).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    {comm.followUpRequired && (
                      <Badge variant="secondary" className="text-xs">
                        Follow-up
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{comm.outcome}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-3">
          {requests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">No special requests</CardContent>
            </Card>
          ) : (
            requests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{request.title}</p>
                      <p className="text-xs text-muted-foreground">{request.type}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant={
                          request.priority === "Urgent" || request.priority === "High" ? "destructive" : "secondary"
                        }
                      >
                        {request.priority}
                      </Badge>
                      <Badge variant="outline">{request.status}</Badge>
                    </div>
                  </div>
                  <p className="text-sm mt-2">{request.description}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
