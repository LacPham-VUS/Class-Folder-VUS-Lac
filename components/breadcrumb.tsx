"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { getClassById, getStudentById, getSessionById } from "@/lib/data-access"

interface BreadcrumbItem {
  label: string
  href: string
}

const routeLabels: Record<string, string> = {
  "": "Dashboard",
  "classes": "Classes",
  "sessions": "Sessions",
  "students": "Students",
  "reports": "Class Reports",
  "requests": "Special Requests",
  "guidelines": "Guidelines",
  "templates": "Templates & Rubrics",
  "settings": "Settings",
}

export function Breadcrumb() {
  const pathname = usePathname()
  const [dynamicLabels, setDynamicLabels] = useState<Record<string, string>>({})
  
  // Fetch dynamic labels for IDs
  useEffect(() => {
    async function fetchLabels() {
      const segments = pathname.split("/").filter(Boolean)
      const labels: Record<string, string> = {}
      
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i]
        const prevSegment = i > 0 ? segments[i - 1] : ""
        
        // Check if this is an ID (UUID pattern or looks like an ID)
        const isId = segment.length > 10 && !routeLabels[segment]
        
        if (isId) {
          try {
            // Fetch class name
            if (prevSegment === "classes") {
              const classData = await getClassById(segment)
              if (classData) {
                labels[segment] = classData.code
              }
            }
            // Fetch student name
            else if (prevSegment === "students") {
              const studentData = await getStudentById(segment)
              if (studentData) {
                labels[segment] = studentData.fullName
              }
            }            // Fetch session name (could add more)
            else if (prevSegment === "sessions") {
              const sessionData = await getSessionById(segment)
              if (sessionData) {
                labels[segment] = `Session ${sessionData.sessionNumber}`
              } else {
                labels[segment] = `Session #${segment.slice(0, 8)}`
              }
            }
            // Fetch request name
            else if (prevSegment === "requests") {
              labels[segment] = `Request #${segment.slice(0, 8)}`
            }
            // Fetch report name
            else if (prevSegment === "reports") {
              labels[segment] = `Report #${segment.slice(0, 8)}`
            }
          } catch (error) {
            console.error(`Failed to fetch label for ${segment}:`, error)
          }
        }
      }
      
      setDynamicLabels(labels)
    }
    
    fetchLabels()
  }, [pathname])
  
  // Split pathname into segments
  const segments = pathname.split("/").filter(Boolean)
  
  // Build breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/" }
  ]
  
  let currentPath = ""
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Use dynamic label, predefined label, or capitalize segment
    const label = 
      dynamicLabels[segment] || 
      routeLabels[segment] || 
      segment.charAt(0).toUpperCase() + segment.slice(1)
    
    breadcrumbItems.push({
      label,
      href: currentPath
    })
  })
  // Don't show breadcrumb on homepage
  if (pathname === "/") {
    return null
  }

  // Trên mobile, chỉ hiển thị item cuối cùng
  const displayItems = breadcrumbItems.slice(1)
  const lastItem = displayItems[displayItems.length - 1]

  return (
    <nav className="flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-2 md:py-3 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 border-b border-border/50 text-xs md:text-sm backdrop-blur-sm overflow-x-auto">
      <Link 
        href="/"
        className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group shrink-0"
      >
        <Home className="h-3.5 w-3.5 md:h-4 md:w-4 group-hover:scale-110 transition-transform" />
      </Link>
      
      {/* Mobile: chỉ hiện item cuối */}
      <div className="flex md:hidden items-center gap-1.5">
        {displayItems.length > 1 && (
          <>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-muted-foreground">...</span>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
        <span className="font-semibold text-foreground bg-primary/10 px-1.5 py-0.5 rounded-md truncate max-w-[150px]">
          {lastItem?.label}
        </span>
      </div>

      {/* Desktop: hiện đầy đủ */}
      <div className="hidden md:flex items-center gap-2">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1
          
          return (
            <div key={item.href} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
              {isLast ? (
                <span className="font-semibold text-foreground bg-primary/10 px-2 py-1 rounded-md">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md",
                    "hover:bg-primary/5 hover:underline underline-offset-4"
                  )}
                >
                  {item.label}
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
