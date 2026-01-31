"use client"

import { useEffect, useState } from "react"
import { getSpecialRequests, getClasses, mockUsers } from "@/lib/data-access"
import type { SpecialRequest, Class, User } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Clock, UserIcon, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface ActivityLogEntry {
  id: string
  timestamp: string
  user: string
  action: string
  details: string
}

export function RequestDetailClient({ requestId }: { requestId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [request, setRequest] = useState<SpecialRequest | null>(null)
  const [classData, setClassData] = useState<Class | null>(null)
  const [requester, setRequester] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([
    {
      id: "log-1",
      timestamp: "2026-01-15T10:30:00Z",
      user: "TA Nguyen",
      action: "Created",
      details: "Request created",
    },
    {
      id: "log-2",
      timestamp: "2026-01-15T11:00:00Z",
      user: "Student Care Manager",
      action: "Status Changed",
      details: "Status changed from Open to In Progress",
    },
  ])

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const requests = await getSpecialRequests()
        const foundRequest = requests.find((r) => r.id === requestId)

        if (!foundRequest) {
          router.push("/requests")
          return
        }

        setRequest(foundRequest)

        const [classes] = await Promise.all([getClasses()])

        const cls = classes.find((c) => c.id === foundRequest.classId)
        setClassData(cls || null)

        const user = mockUsers.find((u) => u.id === foundRequest.requestedBy)
        setRequester(user || null)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [requestId, router])

  const handleStatusChange = (newStatus: string) => {
    if (request) {
      setRequest({ ...request, status: newStatus as any })
      toast({
        title: "Status Updated",
        description: `Request status changed to ${newStatus}`,
      })
    }
  }

  const handleResolve = () => {
    toast({
      title: "Request Resolved",
      description: "The request has been marked as resolved",
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-96 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (!request) {
    return null
  }

  const daysOverdue =
    request.dueDate && request.slaStatus === "Overdue"
      ? Math.floor((new Date().getTime() - new Date(request.dueDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0

  return (
    <div className="space-y-6">
      <Toaster />

      <div className="flex items-center gap-4">
        <Link href="/requests">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{request.title}</h1>
          </div>
          <p className="text-muted-foreground">{request.type}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant={request.priority === "Urgent" || request.priority === "High" ? "destructive" : "secondary"}>
          {request.priority} Priority
        </Badge>
        <Badge variant={request.status === "Resolved" || request.status === "Closed" ? "default" : "outline"}>
          {request.status}
        </Badge>
        <Badge
          variant="outline"
          className={
            request.slaStatus === "Overdue"
              ? "border-red-500 text-red-500"
              : request.slaStatus === "AtRisk"
                ? "border-yellow-500 text-yellow-500"
                : "border-green-500 text-green-500"
          }
        >
          SLA: {request.slaStatus === "OnTrack" ? "On Track" : request.slaStatus === "AtRisk" ? "At Risk" : "Overdue"}
        </Badge>
      </div>

      {request.slaStatus === "Overdue" && (
        <Card className="border-red-500 bg-red-500/5">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-500">
              <Clock className="h-5 w-5" />
              <CardTitle className="text-red-500">Overdue by {daysOverdue} days</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">This request is past its SLA deadline and requires immediate attention.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="mt-1">{request.description}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Class</Label>
                  <p className="mt-1 font-medium">{classData?.code || "No class assigned"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Student</Label>
                  <p className="mt-1 font-medium">{request.studentId || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Requested By</Label>
                  <p className="mt-1 font-medium">{requester?.name || "Unknown"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Requested Date</Label>
                  <p className="mt-1 font-medium">{new Date(request.requestedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Due Date</Label>
                  <p className="mt-1 font-medium">{request.dueDate || "No deadline"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Assigned To</Label>
                  <p className="mt-1 font-medium">{request.assignedTo || "Unassigned"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {request.status === "Resolved" || request.status === "Closed" ? (
                <>
                  <div>
                    <Label className="text-muted-foreground">Resolution Details</Label>
                    <p className="mt-1">{request.resolution || "No resolution details provided"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Resolved Date</Label>
                    <p className="mt-1 font-medium">
                      {request.resolvedAt ? new Date(request.resolvedAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Resolution Notes</Label>
                    <Textarea placeholder="Document the resolution and actions taken..." rows={4} />
                  </div>
                  <Button onClick={handleResolve} className="w-full">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Resolved
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>History of changes and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLog.map((entry, index) => (
                  <div key={entry.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <UserIcon className="h-4 w-4 text-primary" />
                      </div>
                      {index < activityLog.length - 1 && <div className="w-px flex-1 bg-border" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{entry.user}</span>
                        <span className="text-sm text-muted-foreground">{entry.action}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{entry.details}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Change Status</Label>
                <Select value={request.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="InProgress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                Assign to Someone
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Change Priority
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Update Due Date
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {classData && (
                  <Link href={`/classes/${classData.id}`}>
                    <Button variant="ghost" className="w-full justify-start">
                      View Class Details
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" className="w-full justify-start">
                  View Student Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
