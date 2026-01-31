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
import { ArrowLeft, Calendar, Users, FileText, AlertCircle, FolderOpen, BarChart, Camera, Image, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { use } from "react"
import { PhotoCaptureDialog } from "@/components/photo-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

export default function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)

  return <ClassDetailPageClient classId={resolvedParams.id} />
}

function ClassDetailPageClient({ classId }: { classId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [classData, setClassData] = useState<Class | null>(null)
  const [center, setCenter] = useState<Center | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [specialRequests, setSpecialRequests] = useState<SpecialRequest[]>([])
  const [teacher, setTeacher] = useState<User | null>(null)
  const [classReports, setClassReports] = useState<ClassReport[]>([])
  const [loading, setLoading] = useState(true)
  const [showPhotoDialog, setShowPhotoDialog] = useState(false)
  const [photos, setPhotos] = useState<any[]>([])
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null)
  
  // Get active tab from URL or default to overview
  const activeTab = searchParams.get("tab") || "overview"

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
        
        // Load photos from localStorage
        loadPhotos()
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [classId, router])
  
  // Reload photos when switching to files tab
  useEffect(() => {
    if (activeTab === "files") {
      loadPhotos()
    }
  }, [activeTab])
  
  function loadPhotos() {
    try {
      const storedPhotos = JSON.parse(localStorage.getItem("vus_photos") || "[]")
      const classPhotos = storedPhotos.filter((p: any) => p.classId === classId)
      setPhotos(classPhotos)
      console.log("Loaded photos for class:", classId, "Count:", classPhotos.length)
    } catch (error) {
      console.error("Error loading photos:", error)
    }
  }

  function deletePhoto(photoId: string) {
    try {
      const storedPhotos = JSON.parse(localStorage.getItem("vus_photos") || "[]")
      const updatedPhotos = storedPhotos.filter((p: any) => p.id !== photoId)
      localStorage.setItem("vus_photos", JSON.stringify(updatedPhotos))
      
      // Update local state
      setPhotos(prev => prev.filter(p => p.id !== photoId))
      setPhotoToDelete(null)
      
      toast({
        title: "🗑️ Photo Deleted",
        description: "Photo has been removed successfully",
      })
    } catch (error) {
      console.error("Error deleting photo:", error)
      toast({
        title: "Error",
        description: "Failed to delete photo. Please try again.",
        variant: "destructive",
      })
    }
  }

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
  const classPhotos = photos.filter((p: any) => p.type === "class")
  const studentPhotos = photos.filter((p: any) => p.type === "student")

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

      <Tabs defaultValue={activeTab} className="space-y-4">
        <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
          <TabsList className="inline-flex w-max md:w-auto">
            <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="sessions" className="text-xs md:text-sm">Sessions</TabsTrigger>
            <TabsTrigger value="students" className="text-xs md:text-sm">Students</TabsTrigger>
            <TabsTrigger value="reports" className="text-xs md:text-sm whitespace-nowrap">Class Reports</TabsTrigger>
            <TabsTrigger value="requests" className="text-xs md:text-sm whitespace-nowrap">Special Requests</TabsTrigger>
            <TabsTrigger value="files" className="text-xs md:text-sm">
              Files
              {photos.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 md:ml-2 text-[10px] md:text-xs px-1 md:px-1.5">
                  {photos.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

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
          {/* Take Photos Button */}
          <div className="flex justify-end">
            <Button
              onClick={() => setShowPhotoDialog(true)}
              className="gap-2"
            >
              <Camera className="h-4 w-4" />
              Take Photos
            </Button>
          </div>

          {/* Class Photos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Class Photos</CardTitle>
                  <CardDescription>Photos of class activities and group work</CardDescription>
                </div>
                <Badge variant="secondary">{classPhotos.length} photos</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {classPhotos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Image className="mb-4 h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground">No class photos yet</p>
                  <p className="text-xs text-muted-foreground">Click "Take Photos" to add class photos</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {classPhotos.map((photo: any, index: number) => (
                    <div
                      key={photo.id}
                      className="group relative overflow-hidden rounded-lg border bg-muted shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Photo */}
                      <div className="aspect-square overflow-hidden relative">
                        <img
                          src={photo.dataUrl}
                          alt={`Class photo ${index + 1}`}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        {/* Delete Button - Always visible on mobile, hover on desktop */}
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2 h-8 w-8 md:h-7 md:w-7 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-lg"
                          onClick={() => setPhotoToDelete(photo.id)}
                        >
                          <Trash2 className="h-4 w-4 md:h-3.5 md:w-3.5" />
                        </Button>
                      </div>
                      
                      {/* Photo Info */}
                      <div className="p-2 bg-card border-t">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                            <Camera className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">Class Photo #{index + 1}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {new Date(photo.timestamp).toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit", 
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Student Photos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student Photos</CardTitle>
                  <CardDescription>Individual student photos</CardDescription>
                </div>
                <Badge variant="secondary">{studentPhotos.length} photos</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {studentPhotos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="mb-4 h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground">No student photos yet</p>
                  <p className="text-xs text-muted-foreground">Click "Take Photos" to add student photos</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {studentPhotos.map((photo: any, index: number) => {
                    const student = students.find(s => s.id === photo.studentId)
                    const displayName = photo.studentName || student?.fullName || `Student ${index + 1}`
                    return (
                      <div
                        key={photo.id}
                        className="group relative overflow-hidden rounded-lg border bg-muted shadow-sm hover:shadow-md transition-shadow"
                      >
                        {/* Photo */}
                        <div className="aspect-square overflow-hidden relative">
                          <img
                            src={photo.dataUrl}
                            alt={displayName}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                          {/* Delete Button - Always visible on mobile, hover on desktop */}
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 h-8 w-8 md:h-7 md:w-7 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-lg"
                            onClick={() => setPhotoToDelete(photo.id)}
                          >
                            <Trash2 className="h-4 w-4 md:h-3.5 md:w-3.5" />
                          </Button>
                        </div>
                        
                        {/* Student Info - Always visible */}
                        <div className="p-2 bg-card border-t">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <Users className="h-3 w-3 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{displayName}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {new Date(photo.timestamp).toLocaleDateString("vi-VN", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Photo Capture Dialog */}
      <PhotoCaptureDialog
        open={showPhotoDialog}
        onOpenChange={setShowPhotoDialog}
        classId={classId}
        students={students}
      />

      {/* Delete Photo Confirmation Dialog */}
      <AlertDialog open={!!photoToDelete} onOpenChange={(open) => !open && setPhotoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa ảnh này?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa ảnh này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => photoToDelete && deletePhoto(photoToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
