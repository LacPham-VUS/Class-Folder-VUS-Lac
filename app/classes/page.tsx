"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getClasses, getCenters } from "@/lib/data-access"
import type { Class, Center } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus } from "lucide-react"
import Link from "next/link"

export default function ClassesPage() {
  const { selectedCenterId } = useAuth()
  const [classes, setClasses] = useState<Class[]>([])
  const [centers, setCenters] = useState<Center[]>([])
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProgram, setFilterProgram] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        console.log("[v0] Loading classes page, selectedCenterId:", selectedCenterId)
        const [classesData, centersData] = await Promise.all([getClasses(selectedCenterId || undefined), getCenters()])
        console.log("[v0] Loaded classes:", classesData.length, "centers:", centersData.length)
        setClasses(classesData)
        setCenters(centersData)
        setFilteredClasses(classesData)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [selectedCenterId])

  useEffect(() => {
    let result = classes

    if (searchTerm) {
      result = result.filter(
        (cls) =>
          cls.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cls.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cls.level.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterProgram !== "all") {
      result = result.filter((cls) => cls.program === filterProgram)
    }

    if (filterStatus !== "all") {
      result = result.filter((cls) => cls.status === filterStatus)
    }

    setFilteredClasses(result)
  }, [searchTerm, filterProgram, filterStatus, classes])

  const programs = Array.from(new Set(classes.map((c) => c.program)))

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-20 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">Manage and view all classes</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Class
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by class code, program, or level..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterProgram} onValueChange={setFilterProgram}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                {programs.map((program) => (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Class Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((cls) => {
          const center = centers.find((c) => c.id === cls.centerId)
          return (
            <Link key={cls.id} href={`/classes/${cls.id}`}>
              <Card className="transition-all hover:border-primary hover:shadow-md hover:bg-accent/5">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{cls.code}</CardTitle>
                      <CardDescription>{center?.name}</CardDescription>
                    </div>
                    {cls.riskLevel && (
                      <Badge
                        variant="outline"
                        className={
                          cls.riskLevel === "Red"
                            ? "border-red-500 text-red-500"
                            : cls.riskLevel === "Yellow"
                              ? "border-yellow-500 text-yellow-500"
                              : "border-green-500 text-green-500"
                        }
                      >
                        {cls.riskLevel}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Program</span>
                      <span className="font-medium">
                        {cls.program} {cls.level}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Schedule</span>
                      <span className="font-medium text-xs">{cls.shift}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Students</span>
                      <span className="font-medium">{cls.studentCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant={cls.status === "Active" ? "default" : "secondary"}>{cls.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {filteredClasses.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium">No classes found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
