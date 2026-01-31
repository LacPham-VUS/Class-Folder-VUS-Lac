"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, X, Check, ArrowLeft, Trash2, Save } from "lucide-react"
import { getStudentsByClass } from "@/lib/data-access"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface CapturedPhoto {
  id: string
  dataUrl: string
  timestamp: Date
  studentId?: string
}

function CameraPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const classId = searchParams.get("classId")
  const type = searchParams.get("type") as "class" | "student" | null
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string>("")
  const [students, setStudents] = useState<Array<{ id: string; fullName: string }>>([])
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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

  async function loadStudents() {
    if (classId) {
      const studentsData = await getStudentsByClass(classId)
      setStudents(studentsData)
    }
  }

  async function startCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
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

    const video = videoRef.current
    const canvas = canvasRef.current
    
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const context = canvas.getContext("2d")
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
      
      const newPhoto: CapturedPhoto = {
        id: `photo-${Date.now()}`,
        dataUrl,
        timestamp: new Date(),
        studentId: type === "student" ? selectedStudentId : undefined,
      }
      
      setCapturedPhotos(prev => [...prev, newPhoto])
      
      toast({
        title: "Photo Captured",
        description: `${capturedPhotos.length + 1} photo(s) taken`,
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
      // TODO: Save photos to backend/storage
      // For now, just save to localStorage
      const existingPhotos = JSON.parse(localStorage.getItem("vus_photos") || "[]")
      const photosToSave = capturedPhotos.map(photo => ({
        ...photo,
        classId,
        type,
      }))
      
      localStorage.setItem("vus_photos", JSON.stringify([...existingPhotos, ...photosToSave]))
      
      toast({
        title: "Photos Saved!",
        description: `${capturedPhotos.length} photo(s) saved successfully`,
      })
      
      // Navigate back to class page
      setTimeout(() => {
        router.push(`/classes/${classId}?tab=files`)
      }, 1500)
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

  return (
    <div className="flex h-screen flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between bg-black/90 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-white">
              {type === "class" ? "Class Photos" : "Student Photos"}
            </h1>
            <p className="text-sm text-white/70">
              {capturedPhotos.length} photo(s) captured
            </p>
          </div>
        </div>
        
        <Button
          onClick={savePhotos}
          disabled={capturedPhotos.length === 0 || isSaving}
          className="bg-primary hover:bg-primary/90"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden p-4">
        {/* Camera View */}
        <div className="flex flex-1 flex-col gap-4">
          <Card className="relative flex-1 overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="h-full w-full object-contain"
            />
            <canvas ref={canvasRef} className="hidden" />
            
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
          <div className="flex items-center justify-center gap-4">
            {type === "student" && (
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger className="w-64 bg-white">
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
            
            <Button
              size="lg"
              onClick={capturePhoto}
              disabled={!isCameraReady}
              className="h-16 w-16 rounded-full bg-white hover:bg-white/90 text-primary shadow-lg"
            >
              <Camera className="h-8 w-8" />
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-80 flex flex-col gap-4">
          <Card className="flex-1 overflow-hidden">
            <CardContent className="p-4 h-full flex flex-col">
              <h3 className="text-sm font-semibold mb-3">
                Preview ({capturedPhotos.length})
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-2">
                {capturedPhotos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <Camera className="h-12 w-12 mb-2 opacity-20" />
                    <p className="text-sm">No photos yet</p>
                    <p className="text-xs">Take photos to see them here</p>
                  </div>
                ) : (
                  capturedPhotos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className="group relative aspect-video overflow-hidden rounded-lg border bg-muted"
                    >
                      <img
                        src={photo.dataUrl}
                        alt={`Photo ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      
                      {/* Photo info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-xs text-white">
                          Photo {index + 1}
                        </p>
                        {photo.studentId && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            {students.find(s => s.id === photo.studentId)?.fullName}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Delete button */}
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute right-2 top-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deletePhoto(photo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
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
