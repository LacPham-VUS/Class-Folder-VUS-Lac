"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { getClasses, getCenters, getUsersByIds } from "@/lib/data-access"
import type { Class, Center, User } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, Plus, Camera } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BackToTop } from "@/components/back-to-top"

export default function ClassesPage() {
  const { selectedCenterId } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [classes, setClasses] = useState<Class[]>([])
  const [centers, setCenters] = useState<Center[]>([])
  const [teachers, setTeachers] = useState<Map<string, User>>(new Map())
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

        // Load teachers and TAs info
        const allTeacherIds = new Set<string>()
        classesData.forEach((cls: Class) => {
          if (cls.teacherId) allTeacherIds.add(cls.teacherId)
          cls.taIds?.forEach((taId: string) => allTeacherIds.add(taId))
        })
        
        if (allTeacherIds.size > 0) {
          const usersData = await getUsersByIds(Array.from(allTeacherIds))
          const teacherMap = new Map<string, User>()
          usersData.forEach((user: User) => teacherMap.set(user.id, user))
          setTeachers(teacherMap)
        }
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
                    {/* Teacher Info */}
                    {cls.teacherId && teachers.get(cls.teacherId) && (
                      <div className="flex items-center gap-2 pb-2 mb-2 border-b">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {teachers.get(cls.teacherId)?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{teachers.get(cls.teacherId)?.name}</p>
                          <p className="text-xs text-muted-foreground">{t("classes.teacher")}</p>
                        </div>
                        {cls.taIds && cls.taIds.length > 0 && (
                          <div className="flex -space-x-2">
                            {cls.taIds.slice(0, 2).map((taId) => {
                              const ta = teachers.get(taId)
                              return ta ? (
                                <Avatar key={taId} className="h-6 w-6 border-2 border-background">
                                  <AvatarFallback className="text-[10px] bg-secondary text-secondary-foreground">
                                    {ta.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              ) : null
                            })}
                            {cls.taIds.length > 2 && (
                              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium">
                                +{cls.taIds.length - 2}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
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
                    {/* Photos Button */}
                    <div className="pt-3 mt-2 border-t">
                      <Button
                        size="sm"
                        className="w-full gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          router.push(`/classes/${cls.id}?tab=files`)
                        }}
                      >
                        <Camera className="h-4 w-4" />
                        {t("classes.photos")}
                      </Button>
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
      
      <BackToTop />
    </div>
  )
}
