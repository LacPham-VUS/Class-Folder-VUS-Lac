"use client"

import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, User, LogOut, Search, Building2, GraduationCap, UserCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCenters, getClasses } from "@/lib/data-access"
import type { Center, Class } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/lib/language-context"

export function AppHeader() {
  const router = useRouter()
  const { t } = useLanguage()
  const {
    currentRole,
    currentUser,
    selectedCenterId,
    setSelectedCenterId,
    selectedClassId,
    setSelectedClassId,
    logout,
  } = useAuth()
  const [centers, setCenters] = useState<Center[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [centerSearch, setCenterSearch] = useState("")

  useEffect(() => {
    async function loadData() {
      const centersData = await getCenters(currentUser?.id)
      setCenters(centersData)

      if (selectedCenterId) {
        const classesData = await getClasses(selectedCenterId)
        setClasses(classesData)
      }
    }
    loadData()
  }, [selectedCenterId, currentUser])

  const roleColors: Record<string, string> = {
    TA: "bg-blue-500",
    Teacher: "bg-green-500",
    ASA: "bg-purple-500",
    TQM: "bg-orange-500",
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const filteredCenters = centerSearch
    ? centers.filter(
        (c) =>
          c.name.toLowerCase().includes(centerSearch.toLowerCase()) ||
          c.nameVN?.toLowerCase().includes(centerSearch.toLowerCase()) ||
          c.id.toLowerCase().includes(centerSearch.toLowerCase()),
      )
    : centers

  const selectedCenter = centers.find(c => c.id === selectedCenterId)
  const selectedClass = classes.find(c => c.id === selectedClassId)

  return (
    <div className="flex flex-1 items-center justify-between gap-2 md:gap-4">
      {/* Left section - User info & filters */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
        {/* User badge - hiển thị đầy đủ trên desktop, thu gọn trên mobile */}
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <Badge className={`${roleColors[currentRole]} text-[10px] md:text-xs px-1.5 md:px-2`}>
            {currentRole}
          </Badge>
          <span className="text-xs md:text-sm font-medium hidden sm:inline truncate max-w-[100px] md:max-w-none">
            {currentUser?.name}
          </span>
        </div>

        {(currentRole === "TA" || currentRole === "Teacher" || currentRole === "ASA") && (
          <>
            <div className="h-4 md:h-6 w-px bg-border hidden sm:block" />
            
            {/* Desktop: Full selects */}
            <div className="hidden lg:flex items-center gap-2">
              <Select
                value={selectedCenterId || "all"}
                onValueChange={(value: string) => setSelectedCenterId(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-40 xl:w-48">
                  <SelectValue placeholder="Select Center" />
                </SelectTrigger>
                <SelectContent>
                  <div className="flex items-center border-b px-3 pb-2">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                      placeholder="Search centers..."
                      value={centerSearch}
                      onChange={(e) => setCenterSearch(e.target.value)}
                      className="h-8 border-0 bg-transparent p-0 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0"
                    />
                  </div>
                  <SelectItem value="all">
                    <span className="font-medium">All Centers</span>
                  </SelectItem>
                  {filteredCenters.length > 0 ? (
                    filteredCenters.map((center) => (
                      <SelectItem key={center.id} value={center.id}>
                        {center.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="py-6 text-center text-sm text-muted-foreground">No centers found</div>
                  )}
                </SelectContent>
              </Select>

              {selectedCenterId && (currentRole === "TA" || currentRole === "Teacher") && (
                <Select value={selectedClassId || undefined} onValueChange={setSelectedClassId}>
                  <SelectTrigger className="w-40 xl:w-48">
                    <SelectValue placeholder="Select Class" />
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
              )}
            </div>

            {/* Mobile/Tablet: Compact dropdown */}
            <div className="flex lg:hidden items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1 px-2 text-xs">
                    <Building2 className="h-3.5 w-3.5" />
                    <span className="hidden xs:inline max-w-[60px] truncate">
                      {selectedCenter?.name || "Center"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Select Center</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedCenterId(null)}>
                    <span className="font-medium">All Centers</span>
                  </DropdownMenuItem>
                  {centers.map((center) => (
                    <DropdownMenuItem 
                      key={center.id} 
                      onClick={() => setSelectedCenterId(center.id)}
                      className={selectedCenterId === center.id ? "bg-accent" : ""}
                    >
                      {center.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {selectedCenterId && (currentRole === "TA" || currentRole === "Teacher") && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1 px-2 text-xs">
                      <GraduationCap className="h-3.5 w-3.5" />
                      <span className="hidden xs:inline max-w-[60px] truncate">
                        {selectedClass?.code || "Class"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuLabel>Select Class</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedClassId("all")}>
                      All Classes
                    </DropdownMenuItem>
                    {classes.map((cls) => (
                      <DropdownMenuItem 
                        key={cls.id} 
                        onClick={() => setSelectedClassId(cls.id)}
                        className={selectedClassId === cls.id ? "bg-accent" : ""}
                      >
                        {cls.code}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        <LanguageSwitcher />
        <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9">
          <Bell className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9">
              <User className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{currentUser?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>{t("profile.viewProfile")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t("auth.logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
