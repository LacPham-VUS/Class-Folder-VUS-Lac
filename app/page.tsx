"use client"

import { useAuth } from "@/lib/auth-context"
import { TATeacherDashboard } from "@/components/dashboard/ta-teacher-dashboard"
import { StudentCareDashboard } from "@/components/dashboard/student-care-dashboard"
import { AcademicAdminDashboard } from "@/components/dashboard/academic-admin-dashboard"
import { SystemAdminDashboard } from "@/components/dashboard/system-admin-dashboard"
import { DashboardCustomizer } from "@/components/dashboard-customizer"
import { FeatureShowcase } from "@/components/feature-showcase"
import { NewBadge } from "@/components/ui/new-badge"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const { currentRole } = useAuth()
  const [showShowcase, setShowShowcase] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem("feature_showcase_seen")
    if (!seen) {
      // Show showcase after a short delay
      setTimeout(() => setShowShowcase(true), 1000)
    }
  }, [])

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">Welcome to your {currentRole} dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <DashboardCustomizer />
        </div>
      </div>

      {(currentRole === "TA" || currentRole === "Teacher") && <TATeacherDashboard />}
      {currentRole === "ASA" && <StudentCareDashboard />}
      {currentRole === "TQM" && <AcademicAdminDashboard />}
      {currentRole === "SystemAdmin" && <SystemAdminDashboard />}

      <FeatureShowcase open={showShowcase} onOpenChange={setShowShowcase} />
    </div>
  )
}
