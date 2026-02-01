"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
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
  const { t } = useLanguage()
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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t("classes.title")}</h1>
          <p className="text-sm md:text-base text-muted-foreground">{t("classes.manageClasses")}</p>
        </div>
        <Button className="w-fit">
          <Plus className="mr-2 h-4 w-4" />
          {t("classes.addClass")}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col gap-3 md:gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("classes.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 md:flex md:gap-4">
              <Select value={filterProgram} onValueChange={setFilterProgram}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder={t("classes.program")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("classes.allPrograms")}</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program} value={program}>
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-36">
                  <SelectValue placeholder={t("classes.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("classes.allStatuses")}</SelectItem>
                  <SelectItem value="Active">{t("classes.active")}</SelectItem>
                  <SelectItem value="Upcoming">{t("classes.upcoming")}</SelectItem>
                  <SelectItem value="Completed">{t("classes.completed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class Grid */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((cls) => {
          const center = centers.find((c) => c.id === cls.centerId)
          return (
            <Link key={cls.id} href={`/classes/${cls.id}`}>
              <Card className="transition-all hover:border-primary hover:shadow-md hover:bg-accent/5 h-full">
                <CardHeader className="p-4 md:p-6">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base md:text-lg truncate">{cls.code}</CardTitle>
                      <CardDescription className="text-sm truncate">{center?.name}</CardDescription>
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
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="space-y-1.5 md:space-y-2">
                    <div className="flex items-center justify-between text-xs md:text-sm">
                      <span className="text-muted-foreground">{t("classes.program")}</span>
                      <span className="font-medium truncate ml-2">
                        {cls.program} {cls.level}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs md:text-sm">
                      <span className="text-muted-foreground">{t("classes.schedule")}</span>
                      <span className="font-medium text-xs truncate ml-2">{cls.shift}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs md:text-sm">
                      <span className="text-muted-foreground">{t("classes.students")}</span>
                      <span className="font-medium">{cls.studentCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs md:text-sm">
                      <span className="text-muted-foreground">{t("classes.status")}</span>
                      <Badge variant={cls.status === "Active" ? "default" : "secondary"} className="text-xs">
                        {cls.status === "Active" ? t("classes.active") : cls.status === "Upcoming" ? t("classes.upcoming") : t("classes.completed")}
                      </Badge>
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
            <p className="text-lg font-medium">{t("classes.noClassesFound")}</p>
            <p className="text-sm text-muted-foreground">{t("classes.tryAdjusting")}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
