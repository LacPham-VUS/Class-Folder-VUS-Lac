"use client"

import { useEffect, useState } from "react"
import { getSpecialRequests, getClasses } from "@/lib/data-access"
import type { SpecialRequest, Class } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Filter, Plus, AlertTriangle, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function RequestsPage() {
  const { toast } = useToast()
  const [requests, setRequests] = useState<SpecialRequest[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [filteredRequests, setFilteredRequests] = useState<SpecialRequest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [filterSLA, setFilterSLA] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [requestsData, classesData] = await Promise.all([getSpecialRequests(), getClasses()])
        setRequests(requestsData)
        setClasses(classesData)
        setFilteredRequests(requestsData)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    let result = requests

    if (searchTerm) {
      result = result.filter(
        (req) =>
          req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.type.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus !== "all") {
      result = result.filter((req) => req.status === filterStatus)
    }

    if (filterPriority !== "all") {
      result = result.filter((req) => req.priority === filterPriority)
    }

    if (filterSLA !== "all") {
      result = result.filter((req) => req.slaStatus === filterSLA)
    }

    setFilteredRequests(result)
  }, [searchTerm, filterStatus, filterPriority, filterSLA, requests])

  const handleCreateRequest = () => {
    toast({
      title: "Request Created",
      description: "Your special request has been created successfully",
    })
    setIsCreateOpen(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-96 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  const openRequests = requests.filter((r) => r.status === "Open" || r.status === "InProgress")
  const overdueRequests = requests.filter((r) => r.slaStatus === "Overdue")
  const resolvedRequests = requests.filter((r) => r.status === "Resolved" || r.status === "Closed")

  return (
    <div className="space-y-6">
      <Toaster />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Special Requests</h1>
          <p className="text-muted-foreground">Track and manage special requests</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Special Request</DialogTitle>
              <DialogDescription>Submit a new request for tracking and resolution</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Request Type</Label>
                  <Select defaultValue="Academic Support">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Academic Support">Academic Support</SelectItem>
                      <SelectItem value="Behavioral Concern">Behavioral Concern</SelectItem>
                      <SelectItem value="Facility Issue">Facility Issue</SelectItem>
                      <SelectItem value="Material Request">Material Request</SelectItem>
                      <SelectItem value="Schedule Change">Schedule Change</SelectItem>
                      <SelectItem value="Technical Support">Technical Support</SelectItem>
                      <SelectItem value="Parent Communication">Parent Communication</SelectItem>
                      <SelectItem value="Attendance Concern">Attendance Concern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select defaultValue="Medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Class</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input placeholder="Brief description of the request" />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Provide detailed information about the request..." rows={4} />
              </div>

              <div className="space-y-2">
                <Label>Due Date (Optional)</Label>
                <Input type="date" />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRequest}>Create Request</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{overdueRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedRequests.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="InProgress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSLA} onValueChange={setFilterSLA}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="SLA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All SLA</SelectItem>
                <SelectItem value="OnTrack">On Track</SelectItem>
                <SelectItem value="AtRisk">At Risk</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredRequests.map((request) => {
          const cls = classes.find((c) => c.id === request.classId)
          return (
            <Link key={request.id} href={`/requests/${request.id}`}>
              <Card
                className={`transition-all hover:border-primary hover:shadow-md hover:bg-accent/5 ${
                  request.slaStatus === "Overdue" ? "border-red-500/50" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={
                            request.priority === "Urgent" || request.priority === "High" ? "destructive" : "secondary"
                          }
                        >
                          {request.priority}
                        </Badge>
                        <Badge
                          variant={request.status === "Resolved" || request.status === "Closed" ? "default" : "outline"}
                        >
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
                          {request.slaStatus === "OnTrack"
                            ? "On Track"
                            : request.slaStatus === "AtRisk"
                              ? "At Risk"
                              : "Overdue"}
                        </Badge>
                      </div>
                      <CardTitle className="mt-2">{request.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {request.type} • {cls?.code || "No class"} • Due: {request.dueDate || "No deadline"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{request.description}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Requested: {new Date(request.requestedAt).toLocaleDateString()}</span>
                    {request.assignedTo && <span>Assigned to: {request.assignedTo}</span>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium">No requests found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
