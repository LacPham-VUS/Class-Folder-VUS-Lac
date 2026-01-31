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
import { Bell, User, LogOut, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCenters, getClasses } from "@/lib/data-access"
import type { Center, Class } from "@/lib/types"
import { Input } from "@/components/ui/input"

export function AppHeader() {
  const router = useRouter()
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

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Badge className={roleColors[currentRole]}>{currentRole}</Badge>
          <span className="text-sm font-medium">{currentUser?.name}</span>
        </div>

        {(currentRole === "TA" || currentRole === "Teacher" || currentRole === "ASA") && (
          <>
            <div className="h-6 w-px bg-border" />
            <Select
              value={selectedCenterId || "all"}
              onValueChange={(value: string) => setSelectedCenterId(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-48">
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
                <SelectTrigger className="w-48">
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
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
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
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
