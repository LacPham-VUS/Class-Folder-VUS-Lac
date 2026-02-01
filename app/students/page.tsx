"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  getStudents,
  getClassById,
  getEnrollments,
  getStudentNotesByStudent,
  getParentCommunications,
  getSpecialRequests,
  getCenters,
  getClasses,
  getStudentPhotos, // Added photo import
} from "@/lib/data-access"
import type {
  Student,
  Class,
  Center,
  StudentNote,
  ParentCommunication,
  SpecialRequest,
  StudentPhoto,
} from "@/lib/types" // Added StudentPhoto type
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Search, Phone, Mail, Calendar, ImageIcon, Star, Plus } from "lucide-react" // Added icons
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import { ViewModeSwitcher } from "@/components/view-mode-switcher"
import { SavedFilters } from "@/components/saved-filters"
import { CustomTagsManager } from "@/components/custom-tags-manager"
import { BackToTop } from "@/components/back-to-top"
import { cn } from "@/lib/utils"

export default function StudentsPage() {
  const { currentUser } = useAuth()
  const { preferences, setViewMode, togglePinnedStudent, addQuickAccess } = useUserPreferences()
  const [students, setStudents] = useState<Student[]>([])
  const [centers, setCenters] = useState<Center[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCenter, setSelectedCenter] = useState<string>("all")
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [selectedRisk, setSelectedRisk] = useState<string>("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [studentDetails, setStudentDetails] = useState<{
    enrollment: any | null
    class: Class | null
    notes: StudentNote[]
    communications: ParentCommunication[]
    requests: SpecialRequest[]
    photos: StudentPhoto[] // Added photos to student details
  } | null>(null)

  useEffect(() => {
    loadData()
  }, [currentUser])

  async function loadData() {
    try {
      setLoading(true)
      const [studentsData, centersData, classesData] = await Promise.all([
        getStudents(),
        getCenters(currentUser?.id),
        getClasses(),
      ])

      setStudents(studentsData)
      setCenters(centersData)
      setClasses(classesData)
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleStudentClick(student: Student) {
    setSelectedStudent(student)

    try {
      const [enrollmentsData, notesData, commsData, requestsData, photosData] = await Promise.all([
        getEnrollments(student.id),
        getStudentNotesByStudent(student.id),
        getParentCommunications(student.id),
        getSpecialRequests({}),
        getStudentPhotos({ studentId: student.id }),
      ])

      const activeEnrollment = enrollmentsData.find((e: any) => e.status === "Active")
      const classData = activeEnrollment ? await getClassById(activeEnrollment.classId) : null

      setStudentDetails({
        enrollment: activeEnrollment,
        class: classData || null,
        notes: notesData,
        communications: commsData,
        requests: requestsData,
        photos: photosData,
      })
    } catch (error) {
      console.error("Failed to load student details:", error)
    }
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRisk = selectedRisk === "all" || student.riskLevel === selectedRisk

    // TODO: Add center and class filtering based on enrollment

    return matchesSearch && matchesRisk
  })

  // Sort students - pinned first, then by risk level
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const aIsPinned = preferences.pinnedStudents.includes(a.id)
    const bIsPinned = preferences.pinnedStudents.includes(b.id)
    
    if (aIsPinned && !bIsPinned) return -1
    if (!aIsPinned && bIsPinned) return 1
    
    // Then sort by risk level
    const riskOrder = { Red: 0, Yellow: 1, Green: 2 }
    return (riskOrder[a.riskLevel || "Green"] || 2) - (riskOrder[b.riskLevel || "Green"] || 2)
  })

  function handleApplyFilter(filters: Record<string, any>) {
    setSelectedCenter(filters.center || "all")
    setSelectedClass(filters.class || "all")
    setSelectedRisk(filters.risk || "all")
    setSearchQuery(filters.search || "")
  }

  function handlePinStudent(student: Student, e: React.MouseEvent) {
    e.stopPropagation()
    togglePinnedStudent(student.id)
  }

  function handleAddQuickAccess(student: Student, e: React.MouseEvent) {
    e.stopPropagation()
    addQuickAccess({
      id: student.id,
      type: "student",
      label: student.fullName,
    })
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6 p-3 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Student Management</h1>
          <p className="text-sm md:text-base text-muted-foreground">Quản lý học viên và theo dõi tiến độ học tập</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <ViewModeSwitcher value={preferences.viewMode} onChange={setViewMode} />
          <SavedFilters
            type="student"
            currentFilters={{
              center: selectedCenter,
              class: selectedClass,
              risk: selectedRisk,
              search: searchQuery,
            }}
            onApplyFilter={handleApplyFilter}
          />
          <CustomTagsManager />
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            <div className="relative sm:col-span-2 md:col-span-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên học viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedCenter} onValueChange={setSelectedCenter}>
              <SelectTrigger>
                <SelectValue placeholder="All Centers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Centers</SelectItem>
                {centers.map((center) => (
                  <SelectItem key={center.id} value={center.id}>
                    {center.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRisk} onValueChange={setSelectedRisk}>
              <SelectTrigger>
                <SelectValue placeholder="All Risk Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="Green">Green</SelectItem>
                <SelectItem value="Yellow">Yellow</SelectItem>
                <SelectItem value="Red">Red</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Student Grid/List/Compact Views */}
      {preferences.viewMode === "grid" && (
        <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedStudents.map((student) => {
            const isPinned = preferences.pinnedStudents.includes(student.id)
            return (
              <Card
                key={student.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-lg hover:border-primary hover:bg-accent/5 relative group",
                  isPinned && "border-yellow-400 border-2 bg-yellow-50/50 dark:bg-yellow-950/20"
                )}
                onClick={() => handleStudentClick(student)}
              >
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0",
                      isPinned && "text-yellow-600 dark:text-yellow-400"
                    )}
                    onClick={(e) => handlePinStudent(student, e)}
                  >
                    <Star className={cn("h-4 w-4", isPinned && "fill-current")} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => handleAddQuickAccess(student, e)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <CardContent className="p-4">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.fullName} />
                      <AvatarFallback>
                        {student.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="text-center w-full">
                      <h3 className="font-semibold text-lg">{student.fullName}</h3>
                      <p className="text-sm text-muted-foreground">{student.dateOfBirth}</p>
                    </div>

                    <div className="flex items-center gap-2 w-full justify-center flex-wrap">
                      {student.riskLevel && (
                        <Badge
                          className={
                            student.riskLevel === "Green"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                              : student.riskLevel === "Yellow"
                                ? "bg-amber-100 text-amber-700 border-amber-300"
                                : "bg-red-100 text-red-700 border-red-300"
                          }
                        >
                          {student.riskLevel}
                        </Badge>
                      )}
                      {student.isNewStudent && (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          New
                        </Badge>
                      )}
                      {isPinned && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          Pinned
                        </Badge>
                      )}
                    </div>

                    {student.guardianName && (
                      <div className="text-xs text-muted-foreground w-full text-center">PH: {student.guardianName}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {preferences.viewMode === "list" && (
        <div className="space-y-2">
          {sortedStudents.map((student) => {
            const isPinned = preferences.pinnedStudents.includes(student.id)
            return (
              <Card
                key={student.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md hover:border-primary relative group",
                  isPinned && "border-yellow-400 border-2 bg-yellow-50/50 dark:bg-yellow-950/20"
                )}
                onClick={() => handleStudentClick(student)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.fullName} />
                      <AvatarFallback>
                        {student.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{student.fullName}</h3>
                        {isPinned && <Star className="h-4 w-4 text-yellow-600 fill-current" />}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {student.dateOfBirth} • PH: {student.guardianName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{student.guardianPhone}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {student.riskLevel && (
                        <Badge
                          className={
                            student.riskLevel === "Green"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                              : student.riskLevel === "Yellow"
                                ? "bg-amber-100 text-amber-700 border-amber-300"
                                : "bg-red-100 text-red-700 border-red-300"
                          }
                        >
                          {student.riskLevel}
                        </Badge>
                      )}
                      {student.isNewStudent && (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          New
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-8 w-8 p-0",
                          isPinned && "text-yellow-600 dark:text-yellow-400"
                        )}
                        onClick={(e) => handlePinStudent(student, e)}
                      >
                        <Star className={cn("h-4 w-4", isPinned && "fill-current")} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => handleAddQuickAccess(student, e)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {preferences.viewMode === "compact" && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {sortedStudents.map((student) => {
                const isPinned = preferences.pinnedStudents.includes(student.id)
                return (
                  <div
                    key={student.id}
                    className={cn(
                      "flex items-center gap-3 p-3 cursor-pointer transition-all hover:bg-accent/50 group relative",
                      isPinned && "bg-yellow-50/50 dark:bg-yellow-950/20"
                    )}
                    onClick={() => handleStudentClick(student)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.fullName} />
                      <AvatarFallback className="text-xs">
                        {student.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{student.fullName}</span>
                        {isPinned && <Star className="h-3 w-3 text-yellow-600 fill-current flex-shrink-0" />}
                      </div>
                      <span className="text-xs text-muted-foreground">{student.dateOfBirth}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {student.riskLevel && (
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            student.riskLevel === "Green"
                              ? "bg-emerald-500"
                              : student.riskLevel === "Yellow"
                                ? "bg-amber-500"
                                : "bg-red-500"
                          )}
                        />
                      )}
                      {student.isNewStudent && (
                        <Badge variant="outline" className="text-xs py-0 px-1 text-blue-600 border-blue-600">
                          N
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-7 w-7 p-0",
                          isPinned && "text-yellow-600 dark:text-yellow-400"
                        )}
                        onClick={(e) => handlePinStudent(student, e)}
                      >
                        <Star className={cn("h-3 w-3", isPinned && "fill-current")} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => handleAddQuickAccess(student, e)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student Detail Sheet */}
      <Sheet open={selectedStudent !== null} onOpenChange={(open: boolean) => !open && setSelectedStudent(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-6">
          <SheetHeader className="mb-6">
            <SheetTitle>Student Profile</SheetTitle>
          </SheetHeader>

          {selectedStudent && (
            <div className="space-y-6">
              {/* Student Header */}
              <div className="flex items-start gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={selectedStudent.avatar || "/placeholder.svg"} alt={selectedStudent.fullName} />
                  <AvatarFallback>
                    {selectedStudent.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedStudent.fullName}</h2>
                      <p className="text-sm text-muted-foreground">
                        <Calendar className="inline h-3 w-3 mr-1" />
                        {selectedStudent.dateOfBirth}
                      </p>
                    </div>
                    {selectedStudent.riskLevel && (
                      <Badge
                        className={
                          selectedStudent.riskLevel === "Green"
                            ? "bg-emerald-100 text-emerald-700 border-emerald-300 text-base px-3 py-1"
                            : selectedStudent.riskLevel === "Yellow"
                              ? "bg-amber-100 text-amber-700 border-amber-300 text-base px-3 py-1"
                              : "bg-red-100 text-red-700 border-red-300 text-base px-3 py-1"
                        }
                      >
                        {selectedStudent.riskLevel}
                      </Badge>
                    )}
                  </div>

                  {studentDetails?.class && (
                    <div className="mt-3 p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium">Current Class</p>
                      <p className="text-lg font-semibold">{studentDetails.class.code}</p>
                      <p className="text-xs text-muted-foreground">
                        {studentDetails.class.program} - {studentDetails.class.level}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedStudent.guardianName && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Phụ huynh:</span>
                      <span>{selectedStudent.guardianName}</span>
                    </div>
                  )}
                  {selectedStudent.guardianPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedStudent.guardianPhone}</span>
                    </div>
                  )}
                  {selectedStudent.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedStudent.email}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tabs for detailed info */}
              <Tabs defaultValue="photos" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="photos">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Photos ({studentDetails?.photos?.length ?? 0})
                  </TabsTrigger>
                  <TabsTrigger value="notes">Notes ({studentDetails?.notes?.length ?? 0})</TabsTrigger>
                  <TabsTrigger value="communications">
                    Comms ({studentDetails?.communications?.length ?? 0})
                  </TabsTrigger>
                  <TabsTrigger value="requests">Requests ({studentDetails?.requests?.length ?? 0})</TabsTrigger>
                </TabsList>

                <TabsContent value="photos" className="space-y-3">
                  {!studentDetails?.photos || studentDetails.photos.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No photos yet</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {studentDetails.photos.map((photo) => (
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
                            {photo.shareWithParents && (
                              <Badge variant="secondary" className="text-xs mt-2">
                                Shared with parents
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="notes" className="space-y-3">
                  {!studentDetails?.notes || studentDetails.notes.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No notes recorded yet</p>
                  ) : (
                    studentDetails.notes.map((note) => (
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
                          {note.tags && note.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {note.tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="communications" className="space-y-3">
                  {!studentDetails?.communications || studentDetails.communications.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No parent communications yet</p>
                  ) : (
                    studentDetails.communications.map((comm) => (
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
                          {comm.followUpDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Follow-up: {new Date(comm.followUpDate).toLocaleDateString("vi-VN")}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="requests" className="space-y-3">
                  {!studentDetails?.requests || studentDetails.requests.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No special requests</p>
                  ) : (
                    studentDetails.requests.map((request) => (
                      <Card key={request.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{request.title}</p>
                              <p className="text-xs text-muted-foreground">{request.type}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge
                                variant={
                                  request.priority === "Urgent"
                                    ? "destructive"
                                    : request.priority === "High"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {request.priority}
                              </Badge>
                              <Badge variant="outline">{request.status}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{request.description}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </SheetContent>
      </Sheet>
      
      <BackToTop />
    </div>
  )
}
