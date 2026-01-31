"use client"

import { useAuth } from "@/lib/auth-context"
import { TATeacherDashboard } from "@/components/dashboard/ta-teacher-dashboard"
import { StudentCareDashboard } from "@/components/dashboard/student-care-dashboard"
import { AcademicAdminDashboard } from "@/components/dashboard/academic-admin-dashboard"
import { SystemAdminDashboard } from "@/components/dashboard/system-admin-dashboard"

export default function DashboardPage() {
  const { currentRole } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your {currentRole} dashboard</p>
      </div>

      {(currentRole === "TA" || currentRole === "Teacher") && <TATeacherDashboard />}
      {currentRole === "ASA" && <StudentCareDashboard />}
      {currentRole === "TQM" && <AcademicAdminDashboard />}
      {currentRole === "SystemAdmin" && <SystemAdminDashboard />}
    </div>
  )
}
