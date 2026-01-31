"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import Image from "next/image"
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
} from "lucide-react"

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

export function AppSidebar() {
  const pathname = usePathname()
  const { currentRole } = useAuth()

  const filteredNavItems = navItems.filter((item) => item.roles.includes(currentRole))

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card sidebar-gradient shadow-sm">
      <div className="border-b border-border/20 p-6 bg-white relative">
        {/* Logo */}
        <div className="mb-3 flex items-center justify-center">
          <Image src="/vus-logo.png" alt="VUS Logo" width={180} height={60} className="object-contain" />
        </div>

        {/* Title section with clean design */}
        <div className="text-center space-y-1">
          <h2 className="text-sm font-bold text-primary tracking-wide uppercase">Digital Class Folder</h2>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Education Management
            </p>
            <div className="h-px w-8 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-primary scale-[1.02]"
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground hover:scale-[1.01]",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border/50 p-4 bg-white/30 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="font-medium">{currentRole}</span>
        </div>
      </div>
    </div>
  )
}
