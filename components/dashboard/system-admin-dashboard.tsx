"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, BookOpen, Activity, AlertTriangle, TrendingUp } from "lucide-react"
import { getAllUsers } from "@/lib/data-access"
import { mockCenters, mockClasses, mockStudents } from "@/lib/mock-data"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SystemAdminDashboard() {
  const users = getAllUsers()
  const userArray = Array.isArray(users) ? users : []
  const totalUsers = userArray.length
  const activeUsers = userArray.filter((u) => u.isActive !== false).length
  const totalCenters = mockCenters.length
  const totalClasses = mockClasses.length
  const totalStudents = mockStudents.length

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">{activeUsers} active</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Centers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCenters}</div>
            <p className="text-xs text-muted-foreground">Across regions</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
            <p className="text-xs text-muted-foreground">All programs</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Management</CardTitle>
            <CardDescription>Configure system-wide settings and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/settings?tab=system">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Users className="mr-2 h-4 w-4" />
                User Management
              </Button>
            </Link>
            <Link href="/settings?tab=risk">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Risk Level Configuration
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <TrendingUp className="mr-2 h-4 w-4" />
                System Performance
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>System events and user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                <span className="text-muted-foreground">System healthy - all services running</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                <span className="text-muted-foreground">{activeUsers} users currently active</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                <span className="text-muted-foreground">Last backup: 2 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
