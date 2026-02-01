"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Camera, AlertCircle, CheckCircle2, Search, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import type { Student } from "@/lib/types"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  classId: string
  students: Student[]
}

export function PhotoCaptureDialog({ open, onOpenChange, classId, students }: Props) {
  const [step, setStep] = useState<"camera" | "type" | "student">("camera")
  const [hasCamera, setHasCamera] = useState<boolean | null>(null)
  const [photoType, setPhotoType] = useState<"class" | "student">("class")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [search, setSearch] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      detectCamera()
    } else {
      resetState()
    }
  }, [open])

  function resetState() {
    setStep("camera")
    setHasCamera(null)
    setPhotoType("class")
    setSelectedStudent("")
    setSearch("")
  }

  async function detectCamera() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const cameras = devices.filter(d => d.kind === "videoinput")
      setHasCamera(cameras.length > 0)
    } catch {
      setHasCamera(false)
    }
  }
  function next() {
    if (step === "camera" && hasCamera) {
      setStep("type")
    } else if (step === "type") {      if (photoType === "class") {
        // Check class photo limit before going to camera
        const existingPhotos = JSON.parse(localStorage.getItem("vus_photos") || "[]")
        const classPhotos = existingPhotos.filter((p: any) => p.classId === classId && p.type === "class")
        if (classPhotos.length >= 20) {
          toast({
            title: "⚠️ Đã đạt giới hạn",
            description: "Lớp học này đã có 20 ảnh (tối đa). Vui lòng xóa ảnh cũ trước khi chụp thêm.",
            variant: "warning"
          })
          onOpenChange(false)
          return
        }
        goToCamera()
      } else {
        setStep("student")
      }
    } else if (step === "student" && selectedStudent) {
      // Check student photo limit before going to camera
      const existingPhotos = JSON.parse(localStorage.getItem("vus_photos") || "[]")
      const studentPhotos = existingPhotos.filter((p: any) => p.studentId === selectedStudent && p.type === "student")
      if (studentPhotos.length >= 6) {
        const student = students.find(s => s.id === selectedStudent)
        toast({
          title: "⚠️ Đã đạt giới hạn",
          description: `${student?.fullName || 'Học sinh này'} đã có 6 ảnh (tối đa). Vui lòng xóa ảnh cũ trước khi chụp thêm.`,
          variant: "warning"
        })
        onOpenChange(false)
        return
      }
      goToCamera()
    }
  }

  function goToCamera() {
    const params = new URLSearchParams({ classId, type: photoType })
    if (selectedStudent) params.append("studentId", selectedStudent)
    window.location.href = "/camera?" + params.toString()
  }

  const filtered = students.filter(s =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Capture Photo
          </DialogTitle>
          <DialogDescription>
            {step === "camera" && "Checking your camera..."}
            {step === "type" && "Choose the type of photo to capture"}
            {step === "student" && "Select the student to photograph"}
          </DialogDescription>
        </DialogHeader>

        {step === "camera" && (
          <div className="space-y-4">
            {hasCamera === null && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            )}
            {hasCamera === true && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Camera detected! You are ready to take photos.
                </AlertDescription>
              </Alert>
            )}
            {hasCamera === false && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No camera detected. Please connect a camera and grant permissions.
                </AlertDescription>
              </Alert>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {hasCamera === false ? "Close" : "Cancel"}
              </Button>
              {hasCamera === true && <Button onClick={next}>Continue</Button>}
            </div>
          </div>
        )}

        {step === "type" && (
          <div className="space-y-4">
            <Label>What type of photo do you want to take?</Label>
            <RadioGroup value={photoType} onValueChange={(v) => setPhotoType(v as "class" | "student")}>
              <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="class" id="type-class" />
                <Label htmlFor="type-class" className="flex-1 cursor-pointer">
                  <div className="font-medium">Class Photo</div>
                  <div className="text-sm text-muted-foreground">Take a photo of the entire class</div>
                </Label>
                <Camera className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="student" id="type-student" />
                <Label htmlFor="type-student" className="flex-1 cursor-pointer">
                  <div className="font-medium">Student Photo</div>
                  <div className="text-sm text-muted-foreground">Take a photo of a specific student</div>
                </Label>
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
            </RadioGroup>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setStep("camera")}>Back</Button>
              <Button onClick={next}>Continue</Button>
            </div>
          </div>
        )}

        {step === "student" && (
          <div className="space-y-4">
            <Label>Select a student</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <ScrollArea className="h-[300px] rounded-md border">
              <div className="p-4 space-y-2">
                {filtered.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No students found</div>
                ) : (
                  filtered.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setSelectedStudent(s.id)}
                      className={"flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors " +
                        (selectedStudent === s.id ? "border-primary bg-primary/5" : "hover:bg-accent")}
                    >
                      <div>
                        <div className="font-medium">{s.fullName}</div>
                        <div className="text-sm text-muted-foreground">ID: {s.id}</div>
                      </div>
                      {selectedStudent === s.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setStep("type")}>Back</Button>
              <Button onClick={next} disabled={!selectedStudent}>Take Photo</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
