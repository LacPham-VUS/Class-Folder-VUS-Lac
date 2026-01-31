"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, X, Check, ArrowLeft, Trash2, Save, FlipHorizontal, Zap, ZapOff } from "lucide-react"
import { getStudentsByClass, getStudentById } from "@/lib/data-access"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CapturedPhoto {
  id: string
  dataUrl: string
  timestamp: Date
  studentId?: string
  studentName?: string
}

function CameraPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const classId = searchParams.get("classId")
  const type = searchParams.get("type") as "class" | "student" | null
  const preSelectedStudentId = searchParams.get("studentId")
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string>("")
  const [students, setStudents] = useState<Array<{ id: string; fullName: string }>>([])
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isFlashEnabled, setIsFlashEnabled] = useState(true)
  const [showFlash, setShowFlash] = useState(false)
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment")

  useEffect(() => {
    if (!classId || !type) {
      router.push("/")
      return
    }

    loadStudents()
    startCamera()

    return () => {
      stopCamera()
    }
  }, [classId, type])

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

  async function startCamera() {
    try {
      // Stop existing stream first
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      
      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true)
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  // Switch between front and back camera
  async function flipCamera() {
    setIsCameraReady(false)
    stopCamera()
    setFacingMode(prev => prev === "environment" ? "user" : "environment")
  }

  useEffect(() => {
    if (classId && type) {
      startCamera()
    }
  }, [facingMode])

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return
    
    // Check if student is selected for student photos
    if (type === "student" && !selectedStudentId) {
      toast({
        title: "Select Student",
        description: "Please select a student before taking photo",
        variant: "destructive",
      })
      return
    }

    // Show flash effect
    if (isFlashEnabled) {
      setShowFlash(true)
      setTimeout(() => setShowFlash(false), 200)
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const context = canvas.getContext("2d")
    if (context) {
      // Flip horizontally if using front camera
      if (facingMode === "user") {
        context.translate(canvas.width, 0)
        context.scale(-1, 1)
      }
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
      
      // Get student name
      const selectedStudent = students.find(s => s.id === selectedStudentId)
      
      const newPhoto: CapturedPhoto = {
        id: `photo-${Date.now()}`,
        dataUrl,
        timestamp: new Date(),
        studentId: type === "student" ? selectedStudentId : undefined,
        studentName: type === "student" ? selectedStudent?.fullName : undefined,
      }
      
      setCapturedPhotos(prev => [...prev, newPhoto])
      
      toast({
        title: "📸 Photo Captured!",
        description: type === "student" && selectedStudent 
          ? `Photo of ${selectedStudent.fullName}` 
          : `${capturedPhotos.length + 1} class photo(s) taken`,
      })
    }
  }

  function deletePhoto(photoId: string) {
    setCapturedPhotos(prev => prev.filter(p => p.id !== photoId))
  }
  async function savePhotos() {
    if (capturedPhotos.length === 0) {
      toast({
        title: "No Photos",
        description: "Please take at least one photo before saving",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const existingPhotos = JSON.parse(localStorage.getItem("vus_photos") || "[]")
      const photosToSave = capturedPhotos.map(photo => ({
        id: photo.id,
        dataUrl: photo.dataUrl,
        timestamp: photo.timestamp instanceof Date ? photo.timestamp.toISOString() : photo.timestamp,
        studentId: photo.studentId,
        studentName: photo.studentName,
        classId,
        type,
        savedAt: new Date().toISOString(),
      }))
      
      const allPhotos = [...existingPhotos, ...photosToSave]
      localStorage.setItem("vus_photos", JSON.stringify(allPhotos))
      
      console.log("Saved photos:", photosToSave.length, "Total:", allPhotos.length)
      
      toast({
        title: "✅ Photos Saved!",
        description: `${capturedPhotos.length} photo(s) saved successfully`,
      })
      
      // Navigate back to class files tab
      router.push(`/classes/${classId}?tab=files`)
    } catch (error) {
      console.error("Error saving photos:", error)
      toast({
        title: "Save Error",
        description: "Failed to save photos. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const selectedStudent = students.find(s => s.id === selectedStudentId)

  return (
    <div className="flex h-screen flex-col bg-black">
      {/* Flash Effect Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-white pointer-events-none z-50 transition-opacity duration-100",
          showFlash ? "opacity-80" : "opacity-0"
        )} 
      />

      {/* Header */}
      <div className="flex items-center justify-between bg-black/90 p-3 md:p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-white hover:bg-white/20 h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-base md:text-lg font-semibold text-white">
              {type === "class" ? "Class Photos" : "Student Photos"}
            </h1>
            <p className="text-xs md:text-sm text-white/70">
              {capturedPhotos.length} photo(s) captured
              {type === "student" && selectedStudent && (
                <span className="ml-2 text-primary">• {selectedStudent.fullName}</span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Flash Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFlashEnabled(!isFlashEnabled)}
            className={cn(
              "text-white hover:bg-white/20 h-9 w-9",
              isFlashEnabled && "text-yellow-400"
            )}
            title={isFlashEnabled ? "Flash On" : "Flash Off"}
          >
            {isFlashEnabled ? <Zap className="h-5 w-5" /> : <ZapOff className="h-5 w-5" />}
          </Button>

          <Button
            onClick={savePhotos}
            disabled={capturedPhotos.length === 0 || isSaving}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="mr-1.5 h-4 w-4" />
            {isSaving ? "Saving..." : `Save (${capturedPhotos.length})`}
          </Button>
        </div>
      </div>      <div className="flex flex-1 flex-col md:flex-row gap-3 md:gap-4 overflow-hidden p-3 md:p-4">
        {/* Camera View */}
        <div className="flex flex-1 flex-col gap-3 md:gap-4 min-h-0">
          <Card className="relative flex-1 overflow-hidden bg-black border-0 min-h-[40vh] md:min-h-0">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                "h-full w-full object-contain",
                facingMode === "user" && "scale-x-[-1]"
              )}
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Camera frame overlay */}
            <div className="absolute inset-4 md:inset-8 border-2 border-white/30 rounded-lg pointer-events-none">
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-lg" />
            </div>
            
            {/* Student name overlay */}
            {type === "student" && selectedStudent && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-primary/90 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
                📸 {selectedStudent.fullName}
              </div>
            )}
            
            {!isCameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-center">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                  <p className="text-white">Initializing camera...</p>
                </div>
              </div>
            )}
          </Card>

          {/* Camera Controls */}
          <div className="flex items-center justify-center gap-3 md:gap-4 pb-2">
            {type === "student" && (
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger className="w-40 md:w-64 bg-white h-10">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {/* Flip Camera Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={flipCamera}
              className="h-12 w-12 rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20"
              title="Flip Camera"
            >
              <FlipHorizontal className="h-5 w-5" />
            </Button>
            
            {/* Capture Button */}
            <Button
              size="lg"
              onClick={capturePhoto}
              disabled={!isCameraReady}
              className={cn(
                "h-16 w-16 md:h-20 md:w-20 rounded-full bg-white hover:bg-white/90 text-primary shadow-lg",
                "ring-4 ring-white/30 ring-offset-2 ring-offset-black",
                "active:scale-95 transition-transform"
              )}
            >
              <Camera className="h-8 w-8 md:h-10 md:w-10" />
            </Button>
              {/* Spacer for balance */}
            <div className="h-12 w-12" />
          </div>
          
          {/* Mobile Preview Thumbnails - Shows horizontally under controls */}
          {capturedPhotos.length > 0 && (
            <div className="md:hidden">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xs font-semibold text-white">Ảnh đã chụp ({capturedPhotos.length})</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20 h-6 text-[10px] px-2 ml-auto"
                  onClick={() => setCapturedPhotos([])}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Xóa tất cả
                </Button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {capturedPhotos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 border-white/30"
                  >
                    <img
                      src={photo.dataUrl}
                      alt={`Photo ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {/* Delete button - Always visible */}
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -right-1 -top-1 h-5 w-5 rounded-full shadow-lg"
                      onClick={() => deletePhoto(photo.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    {/* Number badge */}
                    <div className="absolute left-0.5 bottom-0.5 bg-black/70 text-white text-[8px] px-1 rounded">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Desktop Preview Panel - Hidden on mobile */}
        <div className="hidden md:flex w-72 lg:w-80 flex-col gap-3">
          <Card className="flex-1 overflow-hidden max-h-[35vh] md:max-h-none">
            <CardContent className="p-3 md:p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <h3 className="text-sm font-semibold">
                  Ảnh đã chụp ({capturedPhotos.length})
                </h3>
                {capturedPhotos.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 text-xs px-2"
                    onClick={() => setCapturedPhotos([])}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Xóa tất cả
                  </Button>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {capturedPhotos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-8">
                    <Camera className="h-12 w-12 mb-2 opacity-20" />
                    <p className="text-sm">Chưa có ảnh</p>
                    <p className="text-xs">Chụp ảnh để xem ở đây</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                    {capturedPhotos.map((photo, index) => (
                      <div
                        key={photo.id}
                        className="group relative aspect-video overflow-hidden rounded-lg border bg-muted"
                      >
                        <img
                          src={photo.dataUrl}
                          alt={photo.studentName ? `Photo of ${photo.studentName}` : `Class Photo ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        
                        {/* Photo info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 md:p-2">
                          <p className="text-[10px] md:text-xs text-white truncate">
                            {photo.studentName ? `📸 ${photo.studentName}` : `Ảnh lớp ${index + 1}`}
                          </p>
                        </div>
                        
                        {/* Delete button - Always visible on mobile, hover on desktop */}
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute right-1 top-1 h-7 w-7 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-md"
                          onClick={() => deletePhoto(photo.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        
                        {/* Photo number badge */}
                        <div className="absolute left-1 top-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Quick action bar when has photos */}
              {capturedPhotos.length > 0 && (
                <div className="mt-3 pt-3 border-t flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs h-9"
                    onClick={() => setCapturedPhotos([])}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Hủy
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 text-xs h-9"
                    onClick={savePhotos}
                    disabled={isSaving}
                  >
                    <Save className="h-3 w-3 mr-1" />
                    {isSaving ? "Đang lưu..." : `Lưu (${capturedPhotos.length})`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function CameraPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-white">Loading camera...</p>
        </div>
      </div>
    }>
      <CameraPageContent />
    </Suspense>
  )
}
