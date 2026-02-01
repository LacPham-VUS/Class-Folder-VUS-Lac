"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  RefreshCw, 
  Clock, 
  Users, 
  BookOpen,
  ChevronRight,
  MapPin,
  Timer,
  Play,
  Pause,
  CheckCircle,
  Layout,
  Search,
  X
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

// Mock data cho các phòng học
interface RoomSession {
  id: string
  classCode: string
  className: string
  teacher: string
  startTime: string
  endTime: string
  studentsCount: number
  program: string
  level: string
}

interface Room {
  id: string
  name: string
  floor: number
  capacity: number
  status: "available" | "in-progress" | "upcoming" | "ending-soon"
  currentSession?: RoomSession
  nextSession?: RoomSession
}

interface Floor {
  id: number
  name: string
  rooms: Room[]
}

// Mock data
const mockFloors: Floor[] = [
  {
    id: 0,
    name: "Ground Floor",
    rooms: [
      {
        id: "G01",
        name: "Room G01",
        floor: 0,
        capacity: 20,
        status: "in-progress",
        currentSession: {
          id: "s1",
          classCode: "YLE-S1-2425-001",
          className: "Young Learners Starters 1",
          teacher: "Ms. Sarah Johnson",
          startTime: "14:00",
          endTime: "15:30",
          studentsCount: 15,
          program: "YLE",
          level: "Starters 1"
        }
      },
      {
        id: "G02",
        name: "Room G02",
        floor: 0,
        capacity: 25,
        status: "ending-soon",
        currentSession: {
          id: "s2",
          classCode: "IELTS-B1-2425-003",
          className: "IELTS Band 6.5",
          teacher: "Mr. John Smith",
          startTime: "13:00",
          endTime: "14:30",
          studentsCount: 18,
          program: "IELTS",
          level: "Band 6.5"
        }
      },
      {
        id: "G03",
        name: "Room G03",
        floor: 0,
        capacity: 20,
        status: "available"
      },
      {
        id: "G04",
        name: "Room G04",
        floor: 0,
        capacity: 15,
        status: "upcoming",
        nextSession: {
          id: "s3",
          classCode: "YLE-M1-2425-005",
          className: "Young Learners Movers 1",
          teacher: "Ms. Lan Nguyen",
          startTime: "15:00",
          endTime: "16:30",
          studentsCount: 12,
          program: "YLE",
          level: "Movers 1"
        }
      },
    ]
  },
  {
    id: 1,
    name: "Floor 1",
    rooms: [
      {
        id: "101",
        name: "Room 101",
        floor: 1,
        capacity: 20,
        status: "in-progress",
        currentSession: {
          id: "s4",
          classCode: "TOEIC-500-2425-002",
          className: "TOEIC 500+",
          teacher: "Mr. David Lee",
          startTime: "14:00",
          endTime: "16:00",
          studentsCount: 20,
          program: "TOEIC",
          level: "500+"
        }
      },
      {
        id: "102",
        name: "Room 102",
        floor: 1,
        capacity: 18,
        status: "available"
      },
      {
        id: "103",
        name: "Room 103",
        floor: 1,
        capacity: 25,
        status: "in-progress",
        currentSession: {
          id: "s5",
          classCode: "ESL-A2-2425-007",
          className: "ESL Advanced 2",
          teacher: "Ms. Emily Brown",
          startTime: "13:30",
          endTime: "15:00",
          studentsCount: 22,
          program: "ESL",
          level: "Advanced 2"
        }
      },
      {
        id: "104",
        name: "Room 104",
        floor: 1,
        capacity: 15,
        status: "upcoming",
        nextSession: {
          id: "s6",
          classCode: "YLE-F1-2425-010",
          className: "Young Learners Flyers 1",
          teacher: "Ms. Hoa Tran",
          startTime: "16:00",
          endTime: "17:30",
          studentsCount: 14,
          program: "YLE",
          level: "Flyers 1"
        }
      },
    ]
  },
  {
    id: 2,
    name: "Floor 2",
    rooms: [
      {
        id: "201",
        name: "Room 201",
        floor: 2,
        capacity: 30,
        status: "in-progress",
        currentSession: {
          id: "s7",
          classCode: "IELTS-B2-2425-008",
          className: "IELTS Band 7.0",
          teacher: "Dr. Jennifer Smith",
          startTime: "14:00",
          endTime: "16:00",
          studentsCount: 25,
          program: "IELTS",
          level: "Band 7.0"
        }
      },
      {
        id: "202",
        name: "Room 202",
        floor: 2,
        capacity: 20,
        status: "available"
      },
      {
        id: "203",
        name: "Room 203",
        floor: 2,
        capacity: 20,
        status: "ending-soon",
        currentSession: {
          id: "s8",
          classCode: "YLE-S2-2425-012",
          className: "Young Learners Starters 2",
          teacher: "Ms. Mai Pham",
          startTime: "12:30",
          endTime: "14:00",
          studentsCount: 16,
          program: "YLE",
          level: "Starters 2"
        }
      },
    ]
  },
  {
    id: 3,
    name: "Floor 3",
    rooms: [
      {
        id: "301",
        name: "Room 301",
        floor: 3,
        capacity: 25,
        status: "available"
      },
      {
        id: "302",
        name: "Room 302",
        floor: 3,
        capacity: 25,
        status: "upcoming",
        nextSession: {
          id: "s9",
          classCode: "TOEFL-80-2425-004",
          className: "TOEFL iBT 80+",
          teacher: "Mr. Robert Chen",
          startTime: "17:00",
          endTime: "19:00",
          studentsCount: 18,
          program: "TOEFL",
          level: "iBT 80+"
        }
      },
    ]
  },
]

function getStatusColor(status: Room["status"]) {
  switch (status) {
    case "in-progress":
      return "bg-green-500"
    case "ending-soon":
      return "bg-orange-500"
    case "upcoming":
      return "bg-blue-500"
    case "available":
      return "bg-gray-300"
    default:
      return "bg-gray-300"
  }
}

function getStatusBadge(status: Room["status"], t: (key: string) => string) {
  switch (status) {
    case "in-progress":
      return <Badge className="bg-green-500 hover:bg-green-600">{t("floorMap.inProgress")}</Badge>
    case "ending-soon":
      return <Badge className="bg-orange-500 hover:bg-orange-600">{t("floorMap.endingSoon")}</Badge>
    case "upcoming":
      return <Badge className="bg-blue-500 hover:bg-blue-600">{t("floorMap.upcoming")}</Badge>
    case "available":
      return <Badge variant="secondary">{t("floorMap.available")}</Badge>
    default:
      return <Badge variant="secondary">{t("floorMap.available")}</Badge>
  }
}

// Floor Plan Visual Component
function FloorPlanVisual({ floor, rooms, t }: { floor: Floor; rooms: Room[]; t: (key: string) => string }) {
  // Define room positions for visual floor plan layout
  const getRoomPosition = (roomId: string) => {
    // Layout configuration for each floor
    const layouts: Record<string, { gridCol: string; gridRow: string }> = {
      // Ground Floor
      "G01": { gridCol: "1 / 3", gridRow: "1 / 2" },
      "G02": { gridCol: "3 / 5", gridRow: "1 / 2" },
      "G03": { gridCol: "1 / 3", gridRow: "2 / 3" },
      "G04": { gridCol: "3 / 5", gridRow: "2 / 3" },
      // Floor 1
      "101": { gridCol: "1 / 2", gridRow: "1 / 2" },
      "102": { gridCol: "2 / 3", gridRow: "1 / 2" },
      "103": { gridCol: "3 / 4", gridRow: "1 / 2" },
      "104": { gridCol: "4 / 5", gridRow: "1 / 2" },
      // Floor 2
      "201": { gridCol: "1 / 3", gridRow: "1 / 2" },
      "202": { gridCol: "3 / 5", gridRow: "1 / 2" },
      "203": { gridCol: "2 / 4", gridRow: "2 / 3" },
      // Floor 3
      "301": { gridCol: "1 / 3", gridRow: "1 / 2" },
      "302": { gridCol: "3 / 5", gridRow: "1 / 2" },
    }
    return layouts[roomId] || { gridCol: "1 / 2", gridRow: "1 / 2" }
  }

  return (
    <div className="relative w-full">
      {/* Floor Plan Container */}
      <div className="bg-muted/30 border-2 border-dashed border-muted-foreground/30 rounded-lg p-4">
        {/* Corridor / Hallway */}
        <div className="bg-amber-100 dark:bg-amber-900/30 rounded-md p-2 mb-4 text-center text-sm text-amber-700 dark:text-amber-300 font-medium">
          🚪 {t("floorMap.corridor")} / {t("floorMap.hallway")}
        </div>
        
        {/* Rooms Grid */}
        <div 
          className="grid gap-3"
          style={{ 
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(2, minmax(120px, auto))"
          }}
        >
          {rooms.map((room) => {
            const position = getRoomPosition(room.id)
            const session = room.currentSession || room.nextSession
            
            return (
              <div
                key={room.id}
                className={cn(
                  "relative rounded-lg p-3 border-2 transition-all cursor-pointer hover:scale-[1.02]",
                  room.status === "in-progress" && "bg-green-100 dark:bg-green-900/30 border-green-500",
                  room.status === "ending-soon" && "bg-orange-100 dark:bg-orange-900/30 border-orange-500",
                  room.status === "upcoming" && "bg-blue-100 dark:bg-blue-900/30 border-blue-500",
                  room.status === "available" && "bg-gray-100 dark:bg-gray-800/50 border-gray-300"
                )}
                style={{
                  gridColumn: position.gridCol,
                  gridRow: position.gridRow
                }}
              >
                {/* Status indicator dot */}
                <div className={cn(
                  "absolute top-2 right-2 h-3 w-3 rounded-full",
                  room.status === "in-progress" && "bg-green-500 animate-pulse",
                  room.status === "ending-soon" && "bg-orange-500 animate-pulse",
                  room.status === "upcoming" && "bg-blue-500",
                  room.status === "available" && "bg-gray-400"
                )} />
                
                {/* Room Name */}
                <div className="font-bold text-base mb-1">{room.name}</div>
                
                {/* Capacity */}
                <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                  <Users className="h-3 w-3" />
                  {room.capacity} {t("floorMap.seats")}
                </div>
                
                {/* Session Info */}
                {session ? (
                  <div className="text-xs space-y-1">
                    <div className="font-medium truncate" title={session.classCode}>
                      {session.classCode}
                    </div>
                    <div className="text-muted-foreground">
                      {session.startTime} - {session.endTime}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {session.studentsCount}/{room.capacity}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground italic">
                    {t("floorMap.available")}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {/* Facilities */}
        <div className="flex justify-between mt-4 pt-3 border-t border-dashed border-muted-foreground/30">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              🚻 {t("floorMap.restroom")}
            </span>
            <span className="flex items-center gap-1">
              🛗 {t("floorMap.elevator")}
            </span>
            <span className="flex items-center gap-1">
              🚪 {t("floorMap.exit")}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>📍 {floor.id === 0 ? t("floorMap.groundFloor") : `${t("floorMap.floor")} ${floor.id}`}</span>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span>{t("floorMap.inProgress")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-orange-500" />
          <span>{t("floorMap.endingSoon")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-blue-500" />
          <span>{t("floorMap.upcoming")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-gray-400" />
          <span>{t("floorMap.available")}</span>
        </div>
      </div>
    </div>
  )
}

// Floor Plan Dialog Component
function FloorPlanDialog({ 
  floor, 
  rooms, 
  t, 
  open, 
  onOpenChange 
}: { 
  floor: Floor; 
  rooms: Room[]; 
  t: (key: string) => string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            {t("floorMap.floorPlan")} - {floor.id === 0 ? t("floorMap.groundFloor") : `${t("floorMap.floor")} ${floor.id}`}
          </DialogTitle>
          <DialogDescription>
            {t("floorMap.floorPlanDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <FloorPlanVisual floor={floor} rooms={rooms} t={t} />
      </DialogContent>
    </Dialog>
  )
}

function RoomCard({ room, t }: { room: Room; t: (key: string) => string }) {
  const session = room.currentSession || room.nextSession
  
  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg border-l-4",
      room.status === "in-progress" && "border-l-green-500",
      room.status === "ending-soon" && "border-l-orange-500",
      room.status === "upcoming" && "border-l-blue-500",
      room.status === "available" && "border-l-gray-300"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "h-3 w-3 rounded-full animate-pulse",
              getStatusColor(room.status)
            )} />
            <CardTitle className="text-lg">{room.name}</CardTitle>
          </div>
          {getStatusBadge(room.status, t)}
        </div>
        <CardDescription className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          {t("floorMap.roomCapacity")}: {room.capacity}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {session ? (
          <div className="space-y-3">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">{session.classCode}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{session.className}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{session.studentsCount} {t("floorMap.studentsCount")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{session.startTime} - {session.endTime}</span>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-muted-foreground">
                {t("floorMap.teacher")}: {session.teacher}
              </div>
            </div>
            
            {room.status === "in-progress" && (
              <div className="flex items-center gap-2 text-sm">
                <Play className="h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">{t("floorMap.inProgress")}</span>
              </div>
            )}
            
            {room.status === "ending-soon" && (
              <div className="flex items-center gap-2 text-sm">
                <Timer className="h-4 w-4 text-orange-500" />
                <span className="text-orange-600 font-medium">
                  {t("floorMap.timeRemaining")}: 15 {t("floorMap.minutes")}
                </span>
              </div>
            )}
            
            {room.status === "upcoming" && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-blue-600 font-medium">
                  {t("floorMap.startsIn")}: 30 {t("floorMap.minutes")}
                </span>
              </div>
            )}
            
            <Link href={`/classes/${session.classCode}`}>
              <Button variant="ghost" size="sm" className="w-full">
                {t("floorMap.viewDetails")}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">{t("floorMap.available")}</p>
            <p className="text-xs mt-1">{t("floorMap.noUpcomingSession")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function FloorMapPage() {
  const { t } = useLanguage()
  const { selectedCenterId } = useAuth()
  const [selectedFloor, setSelectedFloor] = useState<string>("all")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [floorPlanOpen, setFloorPlanOpen] = useState(false)
  const [selectedFloorForPlan, setSelectedFloorForPlan] = useState<Floor | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<{room: Room; floor: Floor}[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Search function
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim().length < 2) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const results: {room: Room; floor: Floor}[] = []
    const lowerQuery = query.toLowerCase()

    mockFloors.forEach(floor => {
      floor.rooms.forEach(room => {
        const session = room.currentSession || room.nextSession
        if (session) {
          // Search by class code, class name, teacher name, program
          if (
            session.classCode.toLowerCase().includes(lowerQuery) ||
            session.className.toLowerCase().includes(lowerQuery) ||
            session.teacher.toLowerCase().includes(lowerQuery) ||
            session.program.toLowerCase().includes(lowerQuery) ||
            room.name.toLowerCase().includes(lowerQuery)
          ) {
            results.push({ room, floor })
          }
        } else if (room.name.toLowerCase().includes(lowerQuery)) {
          results.push({ room, floor })
        }
      })
    })

    setSearchResults(results)
    setShowSearchResults(true)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setShowSearchResults(false)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  // Auto refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const filteredFloors = selectedFloor === "all" 
    ? mockFloors 
    : mockFloors.filter(f => f.id.toString() === selectedFloor)

  // Calculate statistics
  const stats = {
    total: mockFloors.reduce((acc, f) => acc + f.rooms.length, 0),
    inProgress: mockFloors.reduce((acc, f) => acc + f.rooms.filter(r => r.status === "in-progress").length, 0),
    endingSoon: mockFloors.reduce((acc, f) => acc + f.rooms.filter(r => r.status === "ending-soon").length, 0),
    upcoming: mockFloors.reduce((acc, f) => acc + f.rooms.filter(r => r.status === "upcoming").length, 0),
    available: mockFloors.reduce((acc, f) => acc + f.rooms.filter(r => r.status === "available").length, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{t("floorMap.title")}</h1>
          <p className="text-muted-foreground">{t("floorMap.subtitle")}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedFloor} onValueChange={setSelectedFloor}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t("floorMap.selectFloor")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("floorMap.allFloors")}</SelectItem>
              {mockFloors.map((floor) => (
                <SelectItem key={floor.id} value={floor.id.toString()}>
                  {floor.id === 0 ? t("floorMap.groundFloor") : `${t("floorMap.floor")} ${floor.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("floorMap.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Search Results */}
          {showSearchResults && (
            <div className="mt-4">
              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {t("floorMap.searchResults")}: {searchResults.length} {t("floorMap.classesFound")}
                    </p>
                    <Button variant="ghost" size="sm" onClick={clearSearch}>
                      {t("common.clear")}
                    </Button>
                  </div>
                  <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                    {searchResults.map(({ room, floor }) => {
                      const session = room.currentSession || room.nextSession
                      return (
                        <div
                          key={`${floor.id}-${room.id}`}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg border-l-4 bg-muted/50 hover:bg-muted transition-colors",
                            room.status === "in-progress" && "border-l-green-500",
                            room.status === "ending-soon" && "border-l-orange-500",
                            room.status === "upcoming" && "border-l-blue-500",
                            room.status === "available" && "border-l-gray-300"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-2.5 w-2.5 rounded-full",
                              room.status === "in-progress" && "bg-green-500 animate-pulse",
                              room.status === "ending-soon" && "bg-orange-500 animate-pulse",
                              room.status === "upcoming" && "bg-blue-500",
                              room.status === "available" && "bg-gray-400"
                            )} />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{room.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {floor.id === 0 ? t("floorMap.groundFloor") : `${t("floorMap.floor")} ${floor.id}`}
                                </Badge>
                                {getStatusBadge(room.status, t)}
                              </div>
                              {session && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  <span className="font-medium">{session.classCode}</span>
                                  <span className="mx-2">•</span>
                                  <span>{session.teacher}</span>
                                  <span className="mx-2">•</span>
                                  <span>{session.startTime} - {session.endTime}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {session && (
                            <Link href={`/classes/${session.classCode}`}>
                              <Button variant="ghost" size="sm">
                                {t("floorMap.viewDetails")}
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t("floorMap.noSearchResults")}</p>
                  <p className="text-xs mt-1">{t("floorMap.tryDifferentKeyword")}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">{t("floorMap.room")}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.inProgress}</div>
              <div className="text-xs text-muted-foreground">{t("floorMap.inProgress")}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.endingSoon}</div>
              <div className="text-xs text-muted-foreground">{t("floorMap.endingSoon")}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
              <div className="text-xs text-muted-foreground">{t("floorMap.upcoming")}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-300">
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-500">{stats.available}</div>
              <div className="text-xs text-muted-foreground">{t("floorMap.available")}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="font-medium">{t("floorMap.legend")}:</span>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span>{t("floorMap.inProgress")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-orange-500" />
              <span>{t("floorMap.endingSoon")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span>{t("floorMap.upcoming")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-gray-300" />
              <span>{t("floorMap.available")}</span>
            </div>
            <div className="ml-auto text-xs text-muted-foreground">
              {t("floorMap.lastUpdated")}: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>      {/* Floor Sections */}
      {filteredFloors.map((floor) => (
        <div key={floor.id} className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">
              {floor.id === 0 ? t("floorMap.groundFloor") : `${t("floorMap.floor")} ${floor.id}`}
            </h2>
            <Badge variant="outline">{floor.rooms.length} {t("floorMap.room")}</Badge>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto"
              onClick={() => {
                setSelectedFloorForPlan(floor)
                setFloorPlanOpen(true)
              }}
            >
              <Layout className="h-4 w-4 mr-1.5" />
              {t("floorMap.viewFloorPlan")}
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {floor.rooms.map((room) => (
              <RoomCard key={room.id} room={room} t={t} />
            ))}
          </div>
        </div>
      ))}

      {/* Floor Plan Dialog */}
      {selectedFloorForPlan && (
        <FloorPlanDialog
          floor={selectedFloorForPlan}
          rooms={selectedFloorForPlan.rooms}
          t={t}
          open={floorPlanOpen}
          onOpenChange={setFloorPlanOpen}
        />
      )}
    </div>
  )
}
