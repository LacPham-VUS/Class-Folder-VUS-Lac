"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AppSidebar, MobileSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Breadcrumb } from "@/components/breadcrumb"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, pathname, router])

  if (pathname === "/login") {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <AppSidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header với Mobile Menu */}
        <header className="flex h-14 md:h-16 items-center gap-2 border-b bg-card px-3 md:px-6">
          {/* Mobile Menu Button */}
          <MobileSidebar />
          
          {/* Header Content */}
          <div className="flex-1">
            <AppHeader />
          </div>
        </header>
        
        {/* Breadcrumb - responsive */}
        <Breadcrumb />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-3 md:p-6">{children}</main>
      </div>
    </div>
  )
}
