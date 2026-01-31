"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { getSessions, getClasses, getCenters, getAllClassReports } from "@/lib/data-access" // Import getAllClassReports
import type { ClassReport, Session, Class, Center } from "@/lib/types"
import { format } from "date-fns"
import {
  FileText,
  CheckCircle,
  Clock,
  Download,
  BarChart3,
  Calendar,
  Filter,
  Search,
  Eye,
  CheckCheck,
  ThumbsDown,
} from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface ReportWithDetails extends ClassReport {
  session: Session
  class: Class
  center: Center
}

export default function ReportsPage() {
  const { currentUser } = useAuth()
  const { toast } = useToast()
  const [reports, setReports] = useState<ReportWithDetails[]>([])
  const [filteredReports, setFilteredReports] = useState<ReportWithDetails[]>([])
  const [centers, setCenters] = useState<Center[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCenter, setSelectedCenter] = useState<string>("all")
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("all")

  // Review dialog
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<ReportWithDetails | null>(null)
  const [reviewComment, setReviewComment] = useState("")

  // Analytics
  const [analytics, setAnalytics] = useState({
    totalReports: 0,
    draftReports: 0,
    submittedReports: 0,
    approvedReports: 0,
    submissionRate: 0,
    lateReports: 0,
    avgApprovalTime: 0,
  })

  useEffect(() => {
    loadData()
  }, [currentUser])

  useEffect(() => {
    const interval = setInterval(() => {
      loadData()
    }, 3000)

    return () => clearInterval(interval)
  }, [currentUser])

  useEffect(() => {
    applyFilters()
  }, [reports, searchQuery, selectedCenter, selectedClass, selectedStatus, dateRange])

  useEffect(() => {
    calculateAnalytics()
  }, [filteredReports])

  const loadData = async () => {
    setLoading(true)
    try {
      const centersData = await getCenters(currentUser?.id)
      const classesData = await getClasses()
      const sessionsData = await getSessions()
      const allReports = await getAllClassReports() // Load from localStorage instead of mockClassReports

      console.log("[v0] Current user:", currentUser)
      console.log("[v0] All reports loaded:", allReports.length)
      console.log(
        "[v0] Report details:",
        allReports.map((r) => ({ sessionId: r.sessionId, status: r.status })),
      )

      setCenters(centersData)
      setClasses(classesData)

      // Load all reports with details
      const reportsWithDetails: ReportWithDetails[] = []

      for (const report of allReports) {
        const session = sessionsData.find((s) => s.id === report.sessionId)
        if (!session) {
          console.log(`[v0] Session not found for report:`, report.sessionId)
          continue
        }

        const classData = classesData.find((c) => c.id === session.classId)
        if (!classData) {
          console.log(`[v0] Class not found for session:`, session.id, session.classId)
          continue
        }

        const center = centersData.find((c) => c.id === classData.centerId)
        if (!center) {
          console.log(`[v0] Center not found for class:`, classData.id, classData.centerId)
          continue
        }

        // Since reports are stored in localStorage (browser-specific),
        // if a report exists, it means the current user created it
        // No need for permission filtering
        reportsWithDetails.push({
          ...report,
          session,
          class: classData,
          center,
        })
      }

      console.log("[v0] Final reports after loading:", reportsWithDetails.length)
      setReports(reportsWithDetails)
    } catch (error) {
      console.error("Error loading reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...reports]

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.class.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.summary.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Center filter
    if (selectedCenter !== "all") {
      filtered = filtered.filter((r) => r.center.id === selectedCenter)
    }

    // Class filter
    if (selectedClass !== "all") {
      filtered = filtered.filter((r) => r.class.id === selectedClass)
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((r) => r.status === selectedStatus)
    }

    // Date range filter
    if (dateRange !== "all") {
      const today = new Date("2026-01-15")
      filtered = filtered.filter((r) => {
        const sessionDate = new Date(r.session.scheduledDate)
        const diffDays = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))

        if (dateRange === "7days") return diffDays <= 7
        if (dateRange === "30days") return diffDays <= 30
        if (dateRange === "90days") return diffDays <= 90
        return true
      })
    }

    console.log("Filtered Reports:", filtered) // Adding detailed debug logging to track filtering issues
    setFilteredReports(filtered)
  }

  const calculateAnalytics = () => {
    const total = filteredReports.length
    const draft = filteredReports.filter((r) => r.status === "Draft").length
    const submitted = filteredReports.filter((r) => r.status === "Submitted").length
    const approved = filteredReports.filter((r) => r.status === "Approved").length

    const submissionRate = total > 0 ? ((submitted + approved) / total) * 100 : 0

    // Calculate late reports (submitted > 1 day after session)
    const lateReports = filteredReports.filter((r) => {
      if (!r.submittedAt) return false
      const sessionDate = new Date(r.session.scheduledDate)
      const submittedDate = new Date(r.submittedAt)
      const diffDays = Math.floor((submittedDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays > 1
    }).length

    setAnalytics({
      totalReports: total,
      draftReports: draft,
      submittedReports: submitted,
      approvedReports: approved,
      submissionRate: Math.round(submissionRate),
      lateReports,
      avgApprovalTime: 0.5, // Mock data
    })
  }

  const handleApprove = async () => {
    if (!selectedReport) return

    // Simulate approval
    toast({
      title: "Report Approved",
      description: `Report for ${selectedReport.class.code} has been approved.`,
    })

    setReviewDialogOpen(false)
    setSelectedReport(null)
    setReviewComment("")
    loadData()
  }

  const handleReject = async () => {
    if (!selectedReport || !reviewComment) {
      toast({
        title: "Comment Required",
        description: "Please provide feedback for rejection.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Report Rejected",
      description: `Report for ${selectedReport.class.code} has been sent back for revision.`,
    })

    setReviewDialogOpen(false)
    setSelectedReport(null)
    setReviewComment("")
    loadData()
  }

  const handleExport = (type: "pdf" | "excel") => {
    toast({
      title: "Export Started",
      description: `Exporting ${filteredReports.length} reports to ${type.toUpperCase()}...`,
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Draft":
        return <Clock className="h-4 w-4" />
      case "Submitted":
        return <FileText className="h-4 w-4" />
      case "Approved":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      Draft: "secondary",
      Submitted: "default",
      Approved: "outline",
    }

    return (
      <Badge variant={variants[status] || "default"} className="gap-1">
        {getStatusIcon(status)}
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Class Reports</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {currentUser?.role === "Teacher" && "Review and approve class reports from TAs"}
            {currentUser?.role === "ASA" && "Monitor class reports across your assigned centers"}
            {currentUser?.role === "TQM" && "View all class reports and track compliance"}
            {currentUser?.role === "TA" && "Manage your class reports"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("excel")} size="sm" className="flex-1 sm:flex-none">
            <Download className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Export </span>Excel
          </Button>
          <Button variant="outline" onClick={() => handleExport("pdf")} size="sm" className="flex-1 sm:flex-none">
            <Download className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Export </span>PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
          <TabsList className="inline-flex w-max md:w-auto">
            <TabsTrigger value="list" className="text-xs md:text-sm">
              <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
              All Reports
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs md:text-sm">
              <BarChart3 className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Filter className="h-4 w-4 md:h-5 md:w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search class or report..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Select value={selectedCenter} onValueChange={setSelectedCenter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Centers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Centers</SelectItem>
                    {centers.map((center) => (
                      <SelectItem key={center.id} value={center.id}>
                        {center.code} - {center.nameVN}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Showing {filteredReports.length} of {reports.length} reports
                </span>
                {(searchQuery || selectedCenter !== "all" || selectedClass !== "all" || selectedStatus !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCenter("all")
                      setSelectedClass("all")
                      setSelectedStatus("all")
                      setDateRange("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <div className="grid gap-4">
            {filteredReports.length === 0 ? (
              <Card>
                <CardContent className="py-8 md:py-12 text-center">
                  <FileText className="h-10 w-10 md:h-12 md:w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-base md:text-lg font-semibold mb-2">No Reports Found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                </CardContent>
              </Card>
            ) : (
              filteredReports.map((report) => (
                <Card
                  key={report.id}
                  className="hover:shadow-md hover:border-primary hover:bg-accent/5 transition-shadow"
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1 space-y-2 md:space-y-3 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base md:text-lg font-semibold">{report.class.code}</h3>
                          {getStatusBadge(report.status)}
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(report.session.scheduledDate), "dd/MM/yyyy")}
                          </Badge>
                          <span className="text-xs md:text-sm text-muted-foreground">Lesson {report.session.sessionNumber}</span>
                        </div>

                        <div className="text-xs md:text-sm text-muted-foreground truncate">
                          <span className="font-medium">{report.center.nameVN}</span>
                          {" • "}
                          {report.session.topic}
                        </div>

                        <p className="text-xs md:text-sm line-clamp-2">{report.summary}</p>

                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs text-muted-foreground">
                          {report.submittedBy && (
                            <span>
                              Submitted by {report.submittedBy}{" "}
                              {report.submittedAt && `on ${format(new Date(report.submittedAt), "dd/MM/yyyy")}`}
                            </span>
                          )}
                          {report.approvedBy && (
                            <span>
                              Approved by {report.approvedBy}{" "}
                              {report.approvedAt && `on ${format(new Date(report.approvedAt), "dd/MM/yyyy")}`}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/sessions/${report.sessionId}`} className="flex-1 md:flex-none">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-4 w-4 mr-1 md:mr-2" />
                            View
                          </Button>
                        </Link>
                        {currentUser?.role === "Teacher" && report.status === "Submitted" && (
                          <Link href={`/reports/${report.id || report.sessionId}`} className="flex-1 md:flex-none">
                            <Button size="sm" className="w-full">
                              <CheckCheck className="h-4 w-4 mr-1 md:mr-2" />
                              Review
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card>
              <CardHeader className="p-3 md:p-6 pb-2 md:pb-3">
                <CardDescription className="text-xs md:text-sm">Total Reports</CardDescription>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="text-2xl md:text-3xl font-bold">{analytics.totalReports}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-3 md:p-6 pb-2 md:pb-3">
                <CardDescription className="text-xs md:text-sm">Submission Rate</CardDescription>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="text-2xl md:text-3xl font-bold text-green-600">{analytics.submissionRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics.submittedReports + analytics.approvedReports} submitted
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-3 md:p-6 pb-2 md:pb-3">
                <CardDescription className="text-xs md:text-sm">Pending Review</CardDescription>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">{analytics.submittedReports}</div>
                <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Awaiting teacher approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-3 md:p-6 pb-2 md:pb-3">
                <CardDescription className="text-xs md:text-sm">Late Submissions</CardDescription>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="text-2xl md:text-3xl font-bold text-orange-600">{analytics.lateReports}</div>
                <p className="text-xs text-muted-foreground mt-1 hidden sm:block">&gt;1 day after session</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Report Status Breakdown</CardTitle>
                <CardDescription>Distribution of report statuses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-gray-400" />
                      <span className="text-sm">Draft</span>
                    </div>
                    <span className="text-sm font-medium">{analytics.draftReports}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-400"
                      style={{
                        width: `${analytics.totalReports > 0 ? (analytics.draftReports / analytics.totalReports) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500" />
                      <span className="text-sm">Submitted</span>
                    </div>
                    <span className="text-sm font-medium">{analytics.submittedReports}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{
                        width: `${analytics.totalReports > 0 ? (analytics.submittedReports / analytics.totalReports) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <span className="text-sm">Approved</span>
                    </div>
                    <span className="text-sm font-medium">{analytics.approvedReports}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${analytics.totalReports > 0 ? (analytics.approvedReports / analytics.totalReports) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Approval Time</p>
                    <p className="text-2xl font-bold">{analytics.avgApprovalTime} days</p>
                  </div>
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">On-Time Submission Rate</p>
                    <p className="text-2xl font-bold">
                      {analytics.totalReports > 0
                        ? Math.round(((analytics.totalReports - analytics.lateReports) / analytics.totalReports) * 100)
                        : 0}
                      %
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold">{analytics.submissionRate}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Report</DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Class</div>
                <div className="text-sm text-muted-foreground">{selectedReport.class.code}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Session</div>
                <div className="text-sm text-muted-foreground">
                  Lesson {selectedReport.session.sessionNumber} •{" "}
                  {format(new Date(selectedReport.session.scheduledDate), "dd/MM/yyyy")}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Summary</div>
                <div className="text-sm text-muted-foreground">{selectedReport.summary}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Teacher Feedback (Optional)</div>
                <Textarea
                  placeholder="Provide feedback or comments..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              <ThumbsDown className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApprove}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
