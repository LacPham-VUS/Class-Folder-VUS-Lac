"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { LoadingScreen } from "@/components/loading-screen"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)

  const demoAccounts = [
    { role: "TA", email: "ta1@vus.edu.vn", name: "Nguyễn Văn A" },
    { role: "Teacher", email: "teacher1@vus.edu.vn", name: "Ms. Sarah Johnson" },
    { role: "ASA", email: "asa1@vus.edu.vn", name: "Nguyễn Thị Lan" },
    { role: "TQM", email: "tqm1@vus.edu.vn", name: "Dr. Jennifer Smith" },
    { role: "System Admin", email: "admin@vus.edu.vn", name: "Admin VUS" },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        toast.success("Đăng nhập thành công!")
        setShowLoadingScreen(true)
        // Don't navigate immediately, LoadingScreen will handle it
      } else {
        toast.error("Email hoặc mật khẩu không đúng")
        setIsLoading(false)
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại")
      setIsLoading(false)
    }
  }

  const quickLogin = async (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword("demo123")
    setIsLoading(true)

    try {
      const success = await login(demoEmail, "demo123")
      if (success) {
        toast.success("Đăng nhập thành công!")
        setShowLoadingScreen(true)
        // Don't navigate immediately, LoadingScreen will handle it
      } else {
        toast.error("Đăng nhập thất bại")
        setIsLoading(false)
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra")
      setIsLoading(false)
    }
  }

  const handleLoadingComplete = () => {
    router.push("/")
  }

  return (
    <>
      {showLoadingScreen && <LoadingScreen onComplete={handleLoadingComplete} />}
      
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-3 sm:p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 sm:space-y-3 text-center px-4 sm:px-6">
          <div className="mx-auto mb-1 sm:mb-2 flex items-center justify-center">
            <Image src="/vus-logo.png" alt="VUS Logo" width={180} height={60} className="object-contain w-auto h-12 sm:h-16" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">Digital Class Folder</CardTitle>
          <CardDescription className="text-sm">Đăng nhập để quản lý lớp học của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@vus.edu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Tài khoản Demo</span>
            </div>
          </div>

          <div className="grid gap-1.5 sm:gap-2">
            {demoAccounts.map((account) => (
              <Button
                key={account.email}
                variant="outline"
                className="justify-start text-left bg-transparent h-auto py-2 sm:py-2.5"
                onClick={() => quickLogin(account.email)}
                disabled={isLoading}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-sm sm:text-base">{account.name}</span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                    {account.role} • {account.email}
                  </span>
                </div>
              </Button>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Demo password: <span className="font-mono font-semibold">demo123</span>
          </p>
        </CardContent>
      </Card>
      </div>
    </>
  )
}
