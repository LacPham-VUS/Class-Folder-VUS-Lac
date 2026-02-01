"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  AlertCircle,
  Settings,
  Calendar,
  ClipboardList,
  Book,
  Menu,
  X,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    roles: ["TA", "Teacher", "ASA", "TQM", "SystemAdmin"],
  },
  {
    title: "Classes",
    href: "/classes",
    icon: BookOpen,
    roles: ["TA", "Teacher", "ASA", "TQM", "SystemAdmin"],
  },
  {
    title: "Sessions",
    href: "/sessions",
    icon: Calendar,
    roles: ["TA", "Teacher", "SystemAdmin"],
  },
  {
    title: "Students",
    href: "/students",
    icon: Users,
    roles: ["TA", "Teacher", "ASA", "SystemAdmin"],
  },
  {
    title: "Feedback",
    href: "/feedback",
    icon: MessageSquare,
    roles: ["TA", "Teacher", "ASA", "TQM", "SystemAdmin"],
  },
  {
    title: "Class Reports",
    href: "/reports",
    icon: FileText,
    roles: ["TA", "Teacher", "ASA", "TQM", "SystemAdmin"],
  },
  {
    title: "Special Requests",
    href: "/requests",
    icon: AlertCircle,
    roles: ["TA", "Teacher", "ASA", "TQM", "SystemAdmin"],
  },
  {
    title: "Guidelines",
    href: "/guidelines",
    icon: Book,
    roles: ["TA", "Teacher", "ASA", "SystemAdmin"],
  },
  {
    title: "Templates & Rubrics",
    href: "/templates",
    icon: ClipboardList,
    roles: ["TQM", "SystemAdmin"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["TA", "Teacher", "ASA", "TQM", "SystemAdmin"],
  },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { currentRole } = useAuth()
  const { t } = useLanguage()

  const filteredNavItems = navItems.filter((item) => item.roles.includes(currentRole))

  // Translation mapping for nav items
  const getNavTitle = (title: string) => {
    const titleMap: Record<string, string> = {
      "Dashboard": t("nav.dashboard"),
      "Classes": t("nav.classes"),
      "Sessions": t("nav.sessions"),
      "Students": t("nav.students"),
      "Feedback": t("nav.feedback"),
      "Class Reports": t("nav.reports"),
      "Special Requests": t("nav.requests"),
      "Guidelines": t("nav.guidelines"),
      "Templates & Rubrics": t("nav.templates"),
      "Settings": t("nav.settings"),
    }
    return titleMap[title] || title
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/20 p-4 md:p-6 bg-white relative">
        {/* Logo */}
        <div className="mb-2 md:mb-3 flex items-center justify-center">
          <Image src="/vus-logo.png" alt="VUS Logo" width={140} height={47} className="object-contain md:w-[180px]" />
        </div>

        {/* Title section */}
        <div className="text-center space-y-1">
          <h2 className="text-xs md:text-sm font-bold text-primary tracking-wide uppercase">Digital Class Folder</h2>
          <div className="hidden md:flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Education Management
            </p>
            <div className="h-px w-8 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-2 md:p-4 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          const isExactMatch = pathname === item.href
          const isChildRoute = item.href !== "/" && pathname.startsWith(item.href + "/")
          const isActive = isExactMatch || isChildRoute

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 md:px-4 md:py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/30 scale-[1.02]"
                  : "text-muted-foreground hover:bg-gradient-to-r hover:from-secondary/80 hover:to-secondary/60 hover:text-foreground hover:scale-[1.01]",
              )}
            >
              <Icon className={cn(
                "h-5 w-5 shrink-0 transition-transform duration-200",
                isActive ? "scale-110" : "group-hover:scale-105"
              )} />
              <span className="truncate">{getNavTitle(item.title)}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border/50 p-3 md:p-4 bg-white/30 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="font-medium">{currentRole}</span>
        </div>
      </div>
    </div>
  )
}

// Mobile Sidebar với Sheet
export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Đóng sidebar khi route thay đổi
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 sidebar-gradient">
        <SidebarContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

// Desktop Sidebar
export function AppSidebar() {
  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r bg-card sidebar-gradient shadow-sm">
      <SidebarContent />
    </div>
  )
}
