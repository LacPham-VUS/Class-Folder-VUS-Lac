"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, ArrowLeft, Trash2, Save, ImagePlus, Users, Image } from "lucide-react"
import { getStudentsByClass } from "@/lib/data-access"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"

interface UploadedPhoto {
  id: string
  dataUrl: string
  fileName: string
  studentId?: string
  studentName?: string
}

function UploadPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { t } = useLanguage()
  
  const classId = searchParams.get("classId")
  const initialType = searchParams.get("photoType") as "class" | "student" | null
  const preSelectedStudentId = searchParams.get("studentId")
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string>("")
  const [students, setStudents] = useState<Array<{ id: string; fullName: string }>>([])
  const [isSaving, setIsSaving] = useState(false)
  const [photoType, setPhotoType] = useState<"class" | "student">(initialType || "class")
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (!classId) {
      router.push("/")
      return
    }
    loadStudents()
  }, [classId])

  // Set initial photoType from URL
  useEffect(() => {
    if (initialType) {
      setPhotoType(initialType)
    }
  }, [initialType])

  // Set pre-selected student from URL
  useEffect(() => {
    if (preSelectedStudentId && students.length > 0) {
      const student = students.find(s => s.id === preSelectedStudentId)
      if (student) {
        setSelectedStudentId(preSelectedStudentId)
      }
    }
  }, [preSelectedStudentId, students])

  async function loadStudents() {
    if (classId) {
      const studentsData = await getStudentsByClass(classId)
      setStudents(studentsData)
    }
  }

  // Process files from input or drag & drop
  function processFiles(files: FileList | File[]) {
    // For student photos, must select student first
    if (photoType === "student" && !selectedStudentId) {
      toast({
        title: t("photos.selectStudent"),
        description: t("photos.selectStudentFirst"),
        variant: "destructive",
      })
      return
    }

    const selectedStudent = students.find(s => s.id === selectedStudentId)

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        const newPhoto: UploadedPhoto = {
          id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          dataUrl: dataUrl,
          fileName: file.name,
          studentId: photoType === "student" ? selectedStudentId : undefined,
          studentName: photoType === "student" ? selectedStudent?.fullName : undefined,
        }
        setUploadedPhotos(prev => [...prev, newPhoto])
      }
      reader.readAsDataURL(file)
    })
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files || files.length === 0) return
    
    processFiles(files)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Drag & Drop handlers
  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    // Only set to false if we're leaving the drop zone completely
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    setIsDragging(false)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    // Check if student is selected for student photos
    if (photoType === "student" && !selectedStudentId) {
      toast({
        title: t("photos.selectStudent"),
        description: t("photos.selectStudentFirst"),
        variant: "destructive",
      })
      return
    }

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      processFiles(files)
      
      toast({
        title: "📸 " + t("photos.photosAdded"),
        description: `${files.length} ${t("photos.photosSelected").toLowerCase()}`,
      })
    }
  }

  function deletePhoto(photoId: string) {
    setUploadedPhotos(prev => prev.filter(p => p.id !== photoId))
  }
  async function savePhotos() {
    if (uploadedPhotos.length === 0) {
      toast({
        title: t("photos.noPhotos"),
        description: t("photos.uploadPrompt"),
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const existingPhotos = JSON.parse(localStorage.getItem("vus_photos") || "[]")
      const photosToSave = uploadedPhotos.map(photo => ({
        id: photo.id,
        dataUrl: photo.dataUrl,
        timestamp: new Date().toISOString(),
        studentId: photo.studentId,
        studentName: photo.studentName,
        classId,
        type: photoType,
        fileName: photo.fileName,
        savedAt: new Date().toISOString(),
      }))

      const allPhotos = [...existingPhotos, ...photosToSave]
      localStorage.setItem("vus_photos", JSON.stringify(allPhotos))

      toast({
        title: t("photos.photoSaved"),
        description: `${uploadedPhotos.length} ${t("photos.photosSaved")}`,
      })

      // Navigate back to class files tab
      router.push(`/classes/${classId}?tab=files`)
    } catch (error) {
      console.error("Error saving photos:", error)
      toast({
        title: t("messages.error"),
        description: t("messages.saveError"),
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const selectedStudent = students.find(s => s.id === selectedStudentId)

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-background/95 backdrop-blur-sm p-3 md:p-4">
        <div className="flex items-center gap-2 md:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>          <div>
            <h1 className="text-base md:text-lg font-semibold">
              {t("photos.uploadPhotos")}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              {uploadedPhotos.length} {t("photos.photosSelected")}
              {photoType === "student" && selectedStudent && (
                <span className="ml-2 text-primary">• {selectedStudent.fullName}</span>
              )}
            </p>
          </div>
        </div>
          <Button
          onClick={savePhotos}
          disabled={uploadedPhotos.length === 0 || isSaving}
          size="sm"
        >
          <Save className="mr-1.5 h-4 w-4" />
          {isSaving ? t("common.saving") : `${t("common.save")} (${uploadedPhotos.length})`}
        </Button>
      </div>

      {/* Type Selector Tabs */}
      <div className="border-b bg-background/50 px-3 md:px-4 py-2">
        <Tabs value={photoType} onValueChange={(v) => {
          setPhotoType(v as "class" | "student")
          // Clear photos when switching type
          if (uploadedPhotos.length > 0) {
            setUploadedPhotos([])
          }
          setSelectedStudentId("")
        }}>          <TabsList className="grid w-full max-w-xs grid-cols-2">
            <TabsTrigger value="class" className="gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">{t("photos.classPhotos")}</span>
              <span className="sm:hidden">{t("classes.title")}</span>
            </TabsTrigger>
            <TabsTrigger value="student" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t("photos.studentPhotos")}</span>
              <span className="sm:hidden">{t("students.title")}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-1 flex-col md:flex-row gap-3 md:gap-4 overflow-hidden p-3 md:p-4">
        {/* Upload Area */}
        <div className="flex flex-1 flex-col gap-3 md:gap-4 min-h-0">
          {/* Student selector for student photos */}
          {photoType === "student" && (            <Card className="p-3 md:p-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("photos.selectStudent")}</label>
                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("photos.selectStudent") + "..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>                {selectedStudent && (
                  <p className="text-sm text-muted-foreground">
                    {t("photos.selectStudent")}: <span className="font-medium text-primary">{selectedStudent.fullName}</span>
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* Upload Zone */}
          <Card className="flex-1 overflow-hidden">
            <CardContent className="p-3 md:p-4 h-full flex flex-col relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                multiple
                className="hidden"
              />

              {uploadedPhotos.length === 0 ? (
                <div
                  onClick={() => {
                    if (photoType === "student" && !selectedStudentId) {
                      toast({
                        title: t("photos.selectStudent"),
                        description: t("photos.selectStudentFirst"),
                        variant: "destructive",
                      })
                      return
                    }
                    fileInputRef.current?.click()
                  }}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={cn(
                    "flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
                    "hover:border-primary hover:bg-primary/5",
                    isDragging && "border-primary bg-primary/10 scale-[1.02]",
                    photoType === "student" && !selectedStudentId && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isDragging ? (
                    <>
                      <Upload className="h-16 w-16 mb-4 text-primary animate-bounce" />
                      <p className="text-lg font-medium text-primary">{t("photos.dropHere")}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t("photos.releaseToUpload")}
                      </p>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="h-16 w-16 mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium">{t("photos.clickOrDrag")}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t("photos.supportedFormats")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        💡 {t("photos.dragDropHint")}
                      </p>
                      {photoType === "student" && !selectedStudentId && (
                        <p className="text-sm text-destructive mt-3">
                          ⚠️ {t("photos.selectStudentFirst")}
                        </p>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div 
                  className={cn(
                    "flex-1 flex flex-col min-h-0 rounded-lg transition-all duration-200",
                    isDragging && "ring-2 ring-primary ring-offset-2 bg-primary/5"
                  )}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {/* Drag overlay when dragging more photos */}
                  {isDragging && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-primary/10 rounded-lg border-2 border-dashed border-primary">
                      <div className="text-center">
                        <Upload className="h-12 w-12 mx-auto mb-2 text-primary animate-bounce" />
                        <p className="text-lg font-medium text-primary">{t("photos.dropHere")}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">
                      {t("photos.photosSelected")}: {uploadedPhotos.length}
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={photoType === "student" && !selectedStudentId}
                      >
                        <ImagePlus className="h-4 w-4 mr-1" />
                        {t("photos.addMore")}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setUploadedPhotos([])}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {t("photos.deleteAll")}
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {uploadedPhotos.map((photo, index) => (
                        <div
                          key={photo.id}
                          className="group relative aspect-video overflow-hidden rounded-lg border bg-muted shadow-sm"
                        >
                          <img
                            src={photo.dataUrl}
                            alt={photo.fileName}
                            className="h-full w-full object-cover"
                          />
                          
                          {/* Delete button - Always visible on mobile */}
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute right-1 top-1 h-7 w-7 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-md"
                            onClick={() => deletePhoto(photo.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          
                          {/* Number badge */}
                          <div className="absolute left-1 top-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            #{index + 1}
                          </div>

                          {/* Student name for student photos */}
                          {photo.studentName && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                              <p className="text-[10px] text-white truncate">
                                📸 {photo.studentName}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mobile Preview Thumbnails */}          {uploadedPhotos.length > 0 && (
            <div className="md:hidden">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xs font-semibold">{t("photos.quickPreview")}</h3>
                <span className="text-xs text-muted-foreground">({uploadedPhotos.length})</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {uploadedPhotos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 border-primary/30"
                  >
                    <img
                      src={photo.dataUrl}
                      alt={`Photo ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute left-0.5 bottom-0.5 bg-black/70 text-white text-[8px] px-1 rounded">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action Bar - Mobile */}          {uploadedPhotos.length > 0 && (
            <div className="md:hidden flex gap-2 pt-2 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                <X className="h-4 w-4 mr-1" />
                {t("common.cancel")}
              </Button>
              <Button
                className="flex-1"
                onClick={savePhotos}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-1" />
                {isSaving ? t("common.saving") : `${t("common.save")} (${uploadedPhotos.length})`}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function UploadPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p>{/* Loading text will use browser's language */}</p>
        </div>
      </div>
    }>
      <UploadPageContent />
    </Suspense>
  )
}
