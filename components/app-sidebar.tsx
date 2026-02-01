"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState, useEffect, createContext, useContext } from "react"
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
  ChevronLeft,
  ChevronRight,
  Map,
  GraduationCap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Context để quản lý trạng thái sidebar
interface SidebarContextType {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
})

export const useSidebar = () => useContext(SidebarContext)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar_collapsed")
    if (saved) {
      setCollapsed(saved === "true")
    }
  }, [])

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", String(collapsed))
  }, [collapsed])

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

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
    title: "Floor Map",
    href: "/floor-map",
    icon: Map,
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
    title: "Teachers",
    href: "/teachers",
    icon: GraduationCap,
    roles: ["ASA", "TQM", "SystemAdmin"],
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

function SidebarContent({ onNavigate, collapsed = false }: { onNavigate?: () => void; collapsed?: boolean }) {
  const pathname = usePathname()
  const { currentRole } = useAuth()
  const { t } = useLanguage()

  const filteredNavItems = navItems.filter((item) => item.roles.includes(currentRole))

  // Translation mapping for nav items
  const getNavTitle = (title: string) => {
    const titleMap: Record<string, string> = {
      "Dashboard": t("nav.dashboard"),
      "Classes": t("nav.classes"),
      "Floor Map": t("nav.floorMap"),
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
      <div className={cn(
        "border-b border-border/20 bg-white relative transition-all duration-300",
        collapsed ? "p-2" : "p-4 md:p-6"
      )}>
        {/* Logo */}
        <div className={cn(
          "mb-2 md:mb-3 flex items-center justify-center transition-all duration-300",
          collapsed && "mb-0"
        )}>
          {collapsed ? (
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-lg">V</span>
            </div>
          ) : (
            <Image src="/vus-logo.png" alt="VUS Logo" width={140} height={47} className="object-contain md:w-[180px]" />
          )}
        </div>

        {/* Title section - ẩn khi collapsed */}
        {!collapsed && (
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
        )}
      </div>

      <nav className={cn(
        "flex-1 space-y-1 overflow-y-auto transition-all duration-300",
        collapsed ? "p-2" : "p-2 md:p-4"
      )}>
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
              title={collapsed ? getNavTitle(item.title) : undefined}
              className={cn(
                "group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200",
                collapsed ? "gap-0 px-2 py-2.5 justify-center" : "gap-3 px-3 py-2.5 md:px-4 md:py-3",
                isActive
                  ? "bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/30 scale-[1.02]"
                  : "text-muted-foreground hover:bg-gradient-to-r hover:from-secondary/80 hover:to-secondary/60 hover:text-foreground hover:scale-[1.01]",
              )}
            >
              <Icon className={cn(
                "h-5 w-5 shrink-0 transition-transform duration-200",
                isActive ? "scale-110" : "group-hover:scale-105"
              )} />
              {!collapsed && <span className="truncate">{getNavTitle(item.title)}</span>}
              
              {/* Tooltip cho collapsed state */}
              {collapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-md">
                  {getNavTitle(item.title)}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className={cn(
        "border-t border-border/50 bg-white/30 backdrop-blur-sm transition-all duration-300",
        collapsed ? "p-2" : "p-3 md:p-4"
      )}>
        <div className={cn(
          "flex items-center text-xs text-muted-foreground transition-all duration-300",
          collapsed ? "gap-0 justify-center" : "gap-2"
        )}>
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          {!collapsed && <span className="font-medium">{currentRole}</span>}
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

// Desktop Sidebar with collapse functionality
export function AppSidebar() {
  const { collapsed, setCollapsed } = useSidebar()

  return (
    <div className={cn(
      "hidden md:flex h-full flex-col border-r bg-card sidebar-gradient shadow-sm transition-all duration-300 relative",
      collapsed ? "w-16" : "w-64"
    )}>
      <SidebarContent collapsed={collapsed} />
      
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-3 top-6 h-6 w-6 rounded-full bg-background border shadow-md hover:shadow-lg transition-all duration-200 z-10"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
