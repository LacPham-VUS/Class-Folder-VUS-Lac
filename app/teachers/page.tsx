"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { getCenters, getClasses } from "@/lib/data-access"
import type { Class, Center } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { 
  Search, 
  Phone, 
  Mail, 
  Calendar, 
  Star, 
  Plus,
  GraduationCap,
  BookOpen,
  Users,
  Clock,
  Award,
  Building,
  Briefcase,
  MapPin,
  ChevronRight,
  Filter
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import { ViewModeSwitcher } from "@/components/view-mode-switcher"
import { BackToTop } from "@/components/back-to-top"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Teacher interface
interface Teacher {
  id: string
  fullName: string
  email: string
  phone: string
  avatar?: string
  role: "Teacher" | "TA"
  status: "Active" | "Inactive" | "On Leave"
  dateJoined: string
  specialization: string[]
  certifications: string[]
  currentClasses: number
  totalStudents: number
  rating: number
  centerId: string
  centerName: string
  bio?: string
  experience: number // years
}

// Mock data for teachers
const mockTeachers: Teacher[] = [
  {
    id: "t1",
    fullName: "Ms. Sarah Johnson",
    email: "sarah.johnson@vus.edu.vn",
    phone: "0901234567",
    avatar: "/placeholder-user.jpg",
    role: "Teacher",
    status: "Active",
    dateJoined: "2020-03-15",
    specialization: ["IELTS", "TOEFL", "Academic English"],
    certifications: ["CELTA", "DELTA", "IELTS Examiner"],
    currentClasses: 4,
    totalStudents: 68,
    rating: 4.8,
    centerId: "c1",
    centerName: "VUS Lạc Long Quân",
    bio: "Experienced English teacher with over 8 years of teaching IELTS and TOEFL preparation courses.",
    experience: 8
  },
  {
    id: "t2",
    fullName: "Mr. John Smith",
    email: "john.smith@vus.edu.vn",
    phone: "0902345678",
    avatar: "/placeholder-user.jpg",
    role: "Teacher",
    status: "Active",
    dateJoined: "2019-08-20",
    specialization: ["Business English", "TOEIC", "Corporate Training"],
    certifications: ["TESOL", "Cambridge TKT"],
    currentClasses: 3,
    totalStudents: 52,
    rating: 4.6,
    centerId: "c1",
    centerName: "VUS Lạc Long Quân",
    bio: "Specialized in Business English and corporate training programs.",
    experience: 10
  },
  {
    id: "t3",
    fullName: "Ms. Lan Nguyen",
    email: "lan.nguyen@vus.edu.vn",
    phone: "0903456789",
    avatar: "/vietnamese-girl-student-2.jpg",
    role: "Teacher",
    status: "Active",
    dateJoined: "2021-01-10",
    specialization: ["Young Learners", "Cambridge YLE", "Kids English"],
    certifications: ["CELTA", "YL Extension"],
    currentClasses: 5,
    totalStudents: 75,
    rating: 4.9,
    centerId: "c1",
    centerName: "VUS Lạc Long Quân",
    bio: "Passionate about teaching young learners with creative and engaging methods.",
    experience: 5
  },
  {
    id: "t4",
    fullName: "Mr. David Lee",
    email: "david.lee@vus.edu.vn",
    phone: "0904567890",
    avatar: "/placeholder-user.jpg",
    role: "Teacher",
    status: "Active",
    dateJoined: "2018-05-25",
    specialization: ["TOEIC", "Business English", "Conversation"],
    certifications: ["TESOL", "TOEIC Speaking Rater"],
    currentClasses: 4,
    totalStudents: 64,
    rating: 4.7,
    centerId: "c2",
    centerName: "VUS Tân Bình",
    bio: "Expert in TOEIC preparation with high student success rate.",
    experience: 12
  },
  {
    id: "t5",
    fullName: "Ms. Emily Brown",
    email: "emily.brown@vus.edu.vn",
    phone: "0905678901",
    avatar: "/placeholder-user.jpg",
    role: "Teacher",
    status: "On Leave",
    dateJoined: "2020-09-01",
    specialization: ["ESL", "General English", "Pronunciation"],
    certifications: ["CELTA", "Pronunciation Specialist"],
    currentClasses: 0,
    totalStudents: 0,
    rating: 4.5,
    centerId: "c1",
    centerName: "VUS Lạc Long Quân",
    bio: "Focus on pronunciation and accent reduction for adult learners.",
    experience: 6
  },
  {
    id: "t6",
    fullName: "Ms. Hoa Tran",
    email: "hoa.tran@vus.edu.vn",
    phone: "0906789012",
    avatar: "/vietnamese-girl-student-3.jpg",
    role: "TA",
    status: "Active",
    dateJoined: "2022-06-15",
    specialization: ["Young Learners", "Starters", "Movers"],
    certifications: ["TESOL Certificate"],
    currentClasses: 6,
    totalStudents: 90,
    rating: 4.4,
    centerId: "c1",
    centerName: "VUS Lạc Long Quân",
    bio: "Dedicated teaching assistant supporting young learner classes.",
    experience: 2
  },
  {
    id: "t7",
    fullName: "Dr. Jennifer Smith",
    email: "jennifer.smith@vus.edu.vn",
    phone: "0907890123",
    avatar: "/placeholder-user.jpg",
    role: "Teacher",
    status: "Active",
    dateJoined: "2017-02-01",
    specialization: ["IELTS", "Academic Writing", "Research English"],
    certifications: ["PhD Applied Linguistics", "DELTA", "IELTS Examiner"],
    currentClasses: 3,
    totalStudents: 45,
    rating: 4.9,
    centerId: "c1",
    centerName: "VUS Lạc Long Quân",
    bio: "PhD in Applied Linguistics with extensive research background.",
    experience: 15
  },
  {
    id: "t8",
    fullName: "Mr. Robert Chen",
    email: "robert.chen@vus.edu.vn",
    phone: "0908901234",
    avatar: "/placeholder-user.jpg",
    role: "Teacher",
    status: "Active",
    dateJoined: "2019-11-10",
    specialization: ["TOEFL", "SAT", "Academic English"],
    certifications: ["TESOL", "ETS TOEFL Propell"],
    currentClasses: 4,
    totalStudents: 56,
    rating: 4.7,
    centerId: "c2",
    centerName: "VUS Tân Bình",
    bio: "Specialized in TOEFL and standardized test preparation.",
    experience: 9
  },
]

function getStatusBadge(status: Teacher["status"]) {
  switch (status) {
    case "Active":
      return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
    case "Inactive":
      return <Badge variant="secondary">Inactive</Badge>
    case "On Leave":
      return <Badge className="bg-orange-500 hover:bg-orange-600">On Leave</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function getRoleBadge(role: Teacher["role"]) {
  switch (role) {
    case "Teacher":
      return <Badge className="bg-blue-500 hover:bg-blue-600">Teacher</Badge>
    case "TA":
      return <Badge className="bg-purple-500 hover:bg-purple-600">TA</Badge>
    default:
      return <Badge variant="secondary">{role}</Badge>
  }
}

export default function TeachersPage() {
  const { currentUser } = useAuth()
  const { t } = useLanguage()
  const { preferences, setViewMode } = useUserPreferences()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [centers, setCenters] = useState<Center[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCenter, setSelectedCenter] = useState<string>("all")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("all")
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)

  useEffect(() => {
    loadData()
  }, [currentUser])

  async function loadData() {
    try {
      setLoading(true)
      const centersData = await getCenters(currentUser?.id)
      setCenters(centersData)
      // In real app, fetch from API
      setTeachers(mockTeachers)
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Get all unique specializations
  const allSpecializations = [...new Set(mockTeachers.flatMap(t => t.specialization))]

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = 
      teacher.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.specialization.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCenter = selectedCenter === "all" || teacher.centerId === selectedCenter
    const matchesRole = selectedRole === "all" || teacher.role === selectedRole
    const matchesStatus = selectedStatus === "all" || teacher.status === selectedStatus
    const matchesSpecialization = selectedSpecialization === "all" || 
      teacher.specialization.includes(selectedSpecialization)

    return matchesSearch && matchesCenter && matchesRole && matchesStatus && matchesSpecialization
  })

  // Sort by rating
  const sortedTeachers = [...filteredTeachers].sort((a, b) => b.rating - a.rating)

  function handleApplyFilter(filters: Record<string, any>) {
    setSelectedCenter(filters.center || "all")
    setSelectedRole(filters.role || "all")
    setSelectedStatus(filters.status || "all")
    setSelectedSpecialization(filters.specialization || "all")
    setSearchQuery(filters.search || "")
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6 p-3 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{t("teachers.title")}</h1>
          <p className="text-sm md:text-base text-muted-foreground">{t("teachers.subtitle")}</p>
        </div>
          <div className="flex items-center gap-2 flex-wrap">
          <ViewModeSwitcher value={preferences.viewMode} onChange={setViewMode} />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{teachers.length}</div>
                <div className="text-xs text-muted-foreground">{t("teachers.totalTeachers")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <GraduationCap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{teachers.filter(t => t.role === "Teacher").length}</div>
                <div className="text-xs text-muted-foreground">{t("teachers.teachers")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Briefcase className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{teachers.filter(t => t.role === "TA").length}</div>
                <div className="text-xs text-muted-foreground">{t("teachers.teachingAssistants")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {(teachers.reduce((acc, t) => acc + t.rating, 0) / teachers.length).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">{t("teachers.avgRating")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-5">
            <div className="relative sm:col-span-2 md:col-span-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("teachers.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedCenter} onValueChange={setSelectedCenter}>
              <SelectTrigger>
                <SelectValue placeholder={t("teachers.allCenters")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("teachers.allCenters")}</SelectItem>
                <SelectItem value="c1">VUS Lạc Long Quân</SelectItem>
                <SelectItem value="c2">VUS Tân Bình</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder={t("teachers.allRoles")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("teachers.allRoles")}</SelectItem>
                <SelectItem value="Teacher">{t("teachers.teacher")}</SelectItem>
                <SelectItem value="TA">{t("teachers.ta")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder={t("teachers.allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("teachers.allStatuses")}</SelectItem>
                <SelectItem value="Active">{t("teachers.active")}</SelectItem>
                <SelectItem value="Inactive">{t("teachers.inactive")}</SelectItem>
                <SelectItem value="On Leave">{t("teachers.onLeave")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger>
                <SelectValue placeholder={t("teachers.allSpecializations")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("teachers.allSpecializations")}</SelectItem>
                {allSpecializations.map((spec) => (
                  <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Teacher Grid */}
      {preferences.viewMode === "grid" && (
        <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedTeachers.map((teacher) => (
            <Card
              key={teacher.id}
              className="cursor-pointer transition-all hover:shadow-lg hover:border-primary hover:bg-accent/5 relative group"
              onClick={() => setSelectedTeacher(teacher)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={teacher.avatar || "/placeholder-user.jpg"} alt={teacher.fullName} />
                    <AvatarFallback>
                      {teacher.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-center w-full">
                    <h3 className="font-semibold text-lg">{teacher.fullName}</h3>
                    <p className="text-sm text-muted-foreground">{teacher.dateJoined}</p>
                  </div>

                  <div className="flex gap-2">
                    {getRoleBadge(teacher.role)}
                    {getStatusBadge(teacher.status)}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{teacher.rating}</span>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{teacher.currentClasses}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{teacher.totalStudents}</span>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-1 justify-center">
                    {teacher.specialization.slice(0, 2).map((spec) => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {teacher.specialization.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{teacher.specialization.length - 2}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {t("teachers.center")}: {teacher.centerName}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {preferences.viewMode === "list" && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {sortedTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setSelectedTeacher(teacher)}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={teacher.avatar || "/placeholder-user.jpg"} alt={teacher.fullName} />
                    <AvatarFallback>
                      {teacher.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{teacher.fullName}</h3>
                      {getRoleBadge(teacher.role)}
                      {getStatusBadge(teacher.status)}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{teacher.email}</p>
                  </div>
                  
                  <div className="hidden md:flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>{teacher.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>{teacher.currentClasses} {t("teachers.classes")}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{teacher.totalStudents} {t("teachers.students")}</span>
                    </div>
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compact View */}
      {preferences.viewMode === "compact" && (
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sortedTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => setSelectedTeacher(teacher)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={teacher.avatar || "/placeholder-user.jpg"} alt={teacher.fullName} />
                <AvatarFallback className="text-xs">
                  {teacher.fullName.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{teacher.fullName}</span>
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    teacher.status === "Active" && "bg-green-500",
                    teacher.status === "Inactive" && "bg-gray-400",
                    teacher.status === "On Leave" && "bg-orange-500"
                  )} />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{teacher.role}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    {teacher.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {sortedTeachers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t("teachers.noTeachersFound")}</h3>
          <p className="text-muted-foreground">{t("teachers.tryDifferentFilter")}</p>
        </div>
      )}

      {/* Teacher Detail Sheet */}
      <Sheet open={!!selectedTeacher} onOpenChange={() => setSelectedTeacher(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedTeacher && (
            <>
              <SheetHeader>
                <SheetTitle>{t("teachers.teacherDetails")}</SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={selectedTeacher.avatar || "/placeholder-user.jpg"} alt={selectedTeacher.fullName} />
                    <AvatarFallback className="text-2xl">
                      {selectedTeacher.fullName.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{selectedTeacher.fullName}</h2>
                  <div className="flex gap-2 mt-2">
                    {getRoleBadge(selectedTeacher.role)}
                    {getStatusBadge(selectedTeacher.status)}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-lg">{selectedTeacher.rating}</span>
                    <span className="text-muted-foreground">/5.0</span>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="info">{t("teachers.info")}</TabsTrigger>
                    <TabsTrigger value="classes">{t("teachers.classes")}</TabsTrigger>
                    <TabsTrigger value="certifications">{t("teachers.certifications")}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-4 mt-4">
                    {/* Bio */}
                    {selectedTeacher.bio && (
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm">{selectedTeacher.bio}</p>
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedTeacher.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedTeacher.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedTeacher.centerName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{t("teachers.joinedOn")} {selectedTeacher.dateJoined}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedTeacher.experience} {t("teachers.yearsExperience")}</span>
                      </div>
                    </div>

                    {/* Specializations */}
                    <div>
                      <h4 className="font-medium mb-2">{t("teachers.specializations")}</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTeacher.specialization.map((spec) => (
                          <Badge key={spec} variant="secondary">{spec}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <Card>
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <BookOpen className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                            <div className="text-2xl font-bold">{selectedTeacher.currentClasses}</div>
                            <div className="text-xs text-muted-foreground">{t("teachers.currentClasses")}</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <Users className="h-6 w-6 mx-auto mb-1 text-green-500" />
                            <div className="text-2xl font-bold">{selectedTeacher.totalStudents}</div>
                            <div className="text-xs text-muted-foreground">{t("teachers.totalStudents")}</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="classes" className="mt-4">
                    <div className="space-y-3">
                      {/* Mock current classes */}
                      {selectedTeacher.currentClasses > 0 ? (
                        <>
                          <div className="p-3 rounded-lg border hover:bg-accent/50 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">YLE-S1-2425-001</p>
                                <p className="text-sm text-muted-foreground">Young Learners Starters 1</p>
                              </div>
                              <Badge variant="outline">15 students</Badge>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg border hover:bg-accent/50 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">IELTS-B1-2425-003</p>
                                <p className="text-sm text-muted-foreground">IELTS Band 6.5</p>
                              </div>
                              <Badge variant="outline">18 students</Badge>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>{t("teachers.noCurrentClasses")}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="certifications" className="mt-4">
                    <div className="space-y-3">
                      {selectedTeacher.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                          <Award className="h-5 w-5 text-yellow-500" />
                          <span className="font-medium">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      
      <BackToTop />
    </div>
  )
}
