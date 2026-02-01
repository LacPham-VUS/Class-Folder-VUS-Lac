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
import { ArrowLeft, Calendar, Users, FileText, AlertCircle, FolderOpen, BarChart, Camera, Image, Trash2, Upload, BookOpen } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { use } from "react"
import { PhotoCaptureDialog } from "@/components/photo-dialog"
import { useLanguage } from "@/lib/language-context"
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
  const { t } = useLanguage()
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
  const [showAIRecommendation, setShowAIRecommendation] = useState(false)
  const [generatingAI, setGeneratingAI] = useState(false)
  
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
      
      // Migrate old data: convert photoType to type if needed
      let needsMigration = false
      const migratedPhotos = storedPhotos.map((p: any) => {
        if (p.photoType && !p.type) {
          needsMigration = true
          return { ...p, type: p.photoType }
        }
        return p
      })
      
      if (needsMigration) {
        localStorage.setItem("vus_photos", JSON.stringify(migratedPhotos))
        console.log("Migrated photos: converted photoType to type")
      }
      
      const classPhotos = migratedPhotos.filter((p: any) => p.classId === classId)
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
        title: t("messages.deleteSuccess"),
        description: t("photos.photoDeleted"),
      })
    } catch (error) {
      console.error("Error deleting photo:", error)
      toast({
        title: t("messages.error"),
        description: t("photos.deleteError"),
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
        <Button>{t("classes.editClass")}</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("classes.students")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.studentCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("classes.sessions")}</CardTitle>
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
            <CardTitle className="text-sm font-medium">{t("classes.openRequests")}</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("classes.status")}</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={classData.status === "Active" ? "default" : "secondary"}>
              {classData.status === "Active" ? t("classes.active") : t("classes.inactive")}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} className="space-y-4">
        <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
          <TabsList className="inline-flex w-max md:w-auto">
            <TabsTrigger value="overview" className="text-xs md:text-sm">{t("classes.overview")}</TabsTrigger>
            <TabsTrigger value="sessions" className="text-xs md:text-sm">{t("classes.sessions")}</TabsTrigger>
            <TabsTrigger value="students" className="text-xs md:text-sm">{t("classes.students")}</TabsTrigger>
            <TabsTrigger value="feedback" className="text-xs md:text-sm">{t("feedback.classFeedback")}</TabsTrigger>
            <TabsTrigger value="reports" className="text-xs md:text-sm whitespace-nowrap">{t("classes.classReports")}</TabsTrigger>
            <TabsTrigger value="requests" className="text-xs md:text-sm whitespace-nowrap">{t("classes.specialRequests")}</TabsTrigger>
            <TabsTrigger value="files" className="text-xs md:text-sm">
              {t("classes.files")}
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
                <CardTitle>{t("classes.classInformation")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("classes.program")}</span>
                  <span className="font-medium">
                    {classData.program} {classData.level}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("classes.shift")}</span>
                  <span className="font-medium">{classData.shift}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("classes.startDate")}</span>
                  <span className="font-medium">{classData.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("classes.endDate")}</span>
                  <span className="font-medium">{classData.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("classes.teacher")}</span>
                  <span className="font-medium">{teacher?.name || "N/A"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("classes.recentActivity")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t("classes.noRecentActivity")}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("classes.sessionSchedule")}</CardTitle>
              <CardDescription>{t("classes.allSessions")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <Link key={session.id} href={`/sessions/${session.id}`}>
                    <div className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={session.status === "Completed" ? "default" : "secondary"}>
                            {session.status === "Completed" ? t("sessions.completed") : t("sessions.scheduled")}
                          </Badge>
                          <span className="font-medium">{t("classes.session")} {session.sessionNumber}</span>
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
              <CardTitle>{t("classes.enrolledStudents")}</CardTitle>
              <CardDescription>{students.length} {t("classes.studentsInClass")}</CardDescription>
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
                        {t("common.view")}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          {/* Generate AI Report Button or AI Recommendation */}
          {!showAIRecommendation ? (
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-3xl">🤖</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{t("feedback.aiRecommendation")}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("feedback.aiInsights")}
                    </p>
                  </div>
                  <Button 
                    variant="default" 
                    size="lg"
                    disabled={generatingAI}
                    onClick={async () => {
                      setGeneratingAI(true)
                      // Simulate AI generation
                      await new Promise(resolve => setTimeout(resolve, 2000))
                      setShowAIRecommendation(true)
                      setGeneratingAI(false)
                      toast({
                        title: t("messages.success"),
                        description: t("feedback.aiReportGenerated"),
                      })
                    }}
                  >
                    <span className="mr-2">🤖</span>
                    {generatingAI ? t("feedback.generating") : t("feedback.generateAIReport")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg">🤖</span>
                    </div>
                    <div>
                      <CardTitle>{t("feedback.aiRecommendation")}</CardTitle>
                      <CardDescription>{t("feedback.aiInsights")}</CardDescription>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowAIRecommendation(false)}
                  >
                    {t("common.close")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Overall Rating */}
                <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">4.5</div>
                    <div className="text-xs text-muted-foreground">{t("feedback.overallRating")}</div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    {t("feedback.strengths")}
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>Học sinh tích cực tham gia và hứng thú với các hoạt động nhóm</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>Giáo viên nhiệt tình, phương pháp giảng dạy sinh động</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>Phụ huynh đánh giá cao sự tiến bộ của con em</span>
                    </li>
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <span className="text-orange-500">⚠</span>
                    {t("feedback.areasForImprovement")}
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>Cần thêm thời gian luyện tập kỹ năng nói</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>Một số học sinh cần hỗ trợ thêm về từ vựng</span>
                    </li>
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <span className="text-blue-500">💡</span>
                    {t("feedback.recommendationsForNextClass")}
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Tăng cường các hoạt động giao tiếp thực tế</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Bổ sung game và bài tập tương tác để học từ vựng</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Duy trì phương pháp dạy học theo nhóm hiện tại</span>
                    </li>
                  </ul>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={async () => {
                    setGeneratingAI(true)
                    await new Promise(resolve => setTimeout(resolve, 2000))
                    setGeneratingAI(false)
                    toast({
                      title: t("messages.success"),
                      description: t("feedback.aiReportRegenerated"),
                    })
                  }}
                  disabled={generatingAI}
                >
                  <span className="mr-2">🔄</span>
                  {generatingAI ? t("feedback.generating") : t("feedback.regenerateAIReport")}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Feedback Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  {t("feedback.allFeedback")}
                </Button>
                <Button variant="ghost" size="sm">
                  {t("feedback.studentFeedback")}
                </Button>
                <Button variant="ghost" size="sm">
                  {t("feedback.teacherFeedback")}
                </Button>
                <Button variant="ghost" size="sm">
                  {t("feedback.parentFeedback")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Student Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t("feedback.studentFeedback")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  id: 1,
                  student: "Nguyễn Văn A",
                  rating: 5,
                  comment: "Em rất thích cách cô giảng bài. Các hoạt động nhóm rất vui và em học được nhiều từ vựng mới!",
                  date: "2025-01-28"
                },
                {
                  id: 2,
                  student: "Trần Thị B",
                  rating: 4,
                  comment: "Lớp học vui, nhưng em mong có thêm bài tập về nhà để luyện tập.",
                  date: "2025-01-27"
                },
              ].map((fb) => (
                <div key={fb.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{fb.student}</p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < fb.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <Badge variant="secondary">{t("feedback.student")}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{fb.comment}</p>
                  <p className="text-xs text-muted-foreground">{fb.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Teacher Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {t("feedback.teacherFeedback")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  id: 1,
                  teacher: "Ms. Sarah Johnson",
                  rating: 5,
                  comment: "Lớp học này rất tích cực. Học sinh hợp tác tốt trong các hoạt động nhóm. Tuy nhiên cần thêm thời gian practice speaking.",
                  date: "2025-01-29"
                },
              ].map((fb) => (
                <div key={fb.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{fb.teacher}</p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < fb.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <Badge variant="default">{t("feedback.teacher")}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{fb.comment}</p>
                  <p className="text-xs text-muted-foreground">{fb.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Parent Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t("feedback.parentFeedback")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  id: 1,
                  parent: "Nguyễn Thị C (Phụ huynh của Nguyễn Văn A)",
                  rating: 5,
                  comment: "Con em rất hào hứng với lớp học. Mỗi ngày về đều kể lại những điều thú vị đã học. Cảm ơn cô giáo đã nhiệt tình!",
                  date: "2025-01-28"
                },
                {
                  id: 2,
                  parent: "Trần Văn D (Phụ huynh của Trần Thị B)",
                  rating: 4,
                  comment: "Em tiến bộ rõ rệt về pronunciation. Mong cô có thể giao thêm bài tập về nhà.",
                  date: "2025-01-26"
                },
              ].map((fb) => (
                <div key={fb.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{fb.parent}</p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < fb.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <Badge variant="outline">{t("feedback.parent")}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{fb.comment}</p>
                  <p className="text-xs text-muted-foreground">{fb.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("classes.classReports")}</CardTitle>
              <CardDescription>{t("classes.dailyClassReports")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classReports.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("classes.noClassReports")}</p>
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
                                <span className="font-medium">{t("classes.session")} {session?.sessionNumber}</span>
                                <span className="text-sm text-muted-foreground">• {session?.scheduledDate}</span>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                                {report.summary || t("reports.noSummary")}
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
              <CardTitle>{t("classes.specialRequests")}</CardTitle>
              <CardDescription>{t("classes.allRequests")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {specialRequests.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("classes.noSpecialRequests")}</p>
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
          {/* Photo Action Buttons */}
          <div className="flex flex-wrap gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => router.push(`/upload?classId=${classId}&type=class`)}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {t("photos.uploadPhoto")}
            </Button>
            <Button
              onClick={() => setShowPhotoDialog(true)}
              className="gap-2"
            >
              <Camera className="h-4 w-4" />
              {t("photos.takePhoto")}
            </Button>
          </div>

          {/* Class Photos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("photos.classPhotos")}</CardTitle>
                  <CardDescription>{t("photos.classPhotosDesc")}</CardDescription>
                </div>
                <Badge variant="secondary">{classPhotos.length} {t("photos.photosCount")}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {classPhotos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Image className="mb-4 h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground">{t("photos.noClassPhotos")}</p>
                  <p className="text-xs text-muted-foreground">{t("photos.clickToAddClassPhotos")}</p>
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
                            <p className="text-sm font-medium">{t("photos.classPhoto")} #{index + 1}</p>
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
                  <CardTitle>{t("photos.studentPhotos")}</CardTitle>
                  <CardDescription>{t("photos.studentPhotosDesc")}</CardDescription>
                </div>
                <Badge variant="secondary">{studentPhotos.length} {t("photos.photosCount")}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {studentPhotos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="mb-4 h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground">{t("photos.noStudentPhotos")}</p>
                  <p className="text-xs text-muted-foreground">{t("photos.clickToAddStudentPhotos")}</p>
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
            <AlertDialogTitle>{t("photos.deletePhotoConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("photos.deletePhotoDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => photoToDelete && deletePhoto(photoToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
