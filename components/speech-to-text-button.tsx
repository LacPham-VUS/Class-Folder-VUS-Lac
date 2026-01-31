"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SpeechToTextButtonProps {
  onTranscript: (text: string) => void
  language?: string
}

export function SpeechToTextButton({ onTranscript, language = "vi-VN" }: SpeechToTextButtonProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<any>(null)
  const isCleaningUpRef = useRef(false)
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (!SpeechRecognition) {
        setIsSupported(false)
        return
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = language
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        console.log("[v0] Speech recognition started")
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        let interimTranscript = ""
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " "
          } else {
            interimTranscript += transcript
          }
        }

        // Send both interim (for real-time display) and final results
        const combinedText = (finalTranscript + interimTranscript).trim()
        if (combinedText) {
          console.log("[v0] Transcript received:", combinedText)
          onTranscript(combinedText)
        }
      }

      recognition.onerror = (event: any) => {
        console.log("[v0] Speech recognition error:", event.error)
        if (!isCleaningUpRef.current && event.error !== "aborted" && event.error !== "no-speech") {
          toast({
            title: "Lỗi ghi âm",
            description: `Không thể nhận dạng giọng nói: ${event.error}. Vui lòng thử lại.`,
            variant: "destructive",
          })
        }
        setIsListening(false)
      }

      recognition.onend = () => {
        console.log("[v0] Speech recognition ended")
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      isCleaningUpRef.current = true
      if (recognitionRef.current) {
        try {
          if (recognitionRef.current.stop) {
            recognitionRef.current.stop()
          }
        } catch (e) {
          // Silently handle cleanup errors
        }
      }
    }
  }, [language, onTranscript, toast])

  const toggleListening = async () => {
    if (!recognitionRef.current) return

    if (isListening) {
      try {
        recognitionRef.current.stop()
        setIsListening(false)
        toast({
          title: "Đã dừng ghi âm",
          description: "Nhận dạng giọng nói đã được tắt",
        })
      } catch (e) {
        console.error("[v0] Error stopping recognition:", e)
      }
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          await navigator.mediaDevices.getUserMedia({ audio: true })
        }

        recognitionRef.current.start()
        toast({
          title: "Đang ghi âm...",
          description: "Hãy nói vào microphone. Nhấn lại để dừng.",
        })
      } catch (e: any) {
        console.error("[v0] Error starting recognition:", e)
        setIsListening(false)

        let errorMessage = "Không thể bắt đầu ghi âm. Vui lòng thử lại."
        if (e.name === "NotAllowedError") {
          errorMessage = "Vui lòng cấp quyền sử dụng microphone để ghi âm."
        } else if (e.name === "NotFoundError") {
          errorMessage = "Không tìm thấy microphone. Vui lòng kiểm tra thiết bị."
        }

        toast({
          title: "Lỗi ghi âm",
          description: errorMessage,
          variant: "destructive",
        })
      }
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <Button
      type="button"
      size="icon"
      variant={isListening ? "default" : "outline"}
      onClick={toggleListening}
      className={isListening ? "animate-pulse bg-red-600 hover:bg-red-700" : ""}
      title={isListening ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  )
}
