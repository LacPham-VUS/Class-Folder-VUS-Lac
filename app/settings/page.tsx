"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Bell,
  Monitor,
  Database,
  Download,
  Upload,
  Settings2,
  Users,
  AlertTriangle,
  Building2,
  UserPlus,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  getAllUsers,
  updateUser,
  getSystemConfig,
  saveSystemConfig,
  getCenters,
  getClasses as fetchClasses,
  getSessions as fetchSessions,
} from "@/lib/data-access"
import type { SystemConfig, User as UserType, Center, Role, Class, Session } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

export default function SettingsPage() {
  const { currentUser, currentRole } = useAuth()
  const { toast } = useToast()

  // Profile settings
  const [profileName, setProfileName] = useState(currentUser?.name || "")
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || "")

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [reportReminders, setReportReminders] = useState(true)
  const [specialRequestAlerts, setSpecialRequestAlerts] = useState(true)
  const [dailyDigest, setDailyDigest] = useState(false)

  // Display settings
  const [language, setLanguage] = useState("vi")
  const [dateFormat, setDateFormat] = useState("dd/MM/yyyy")
  const [autoSummarization, setautoSummarization] = useState(true)

  // System Admin - Risk Level Configuration
  const [riskConfig, setRiskConfig] = useState<SystemConfig>({
    id: "system-config-1",
    riskLevelThresholds: {
      attendanceRedThreshold: 75,
      attendanceYellowThreshold: 90,
      negativeNotesRedCount: 3,
      negativeNotesYellowCount: 2,
      consecutiveAbsencesRed: 3,
      consecutiveAbsencesYellow: 2,
      overdueRequestsRedCount: 2,
      overdueRequestsYellowCount: 1,
    },
    slaSettings: {
      specialRequestResponseTime: 24,
      reportApprovalTime: 72,
      parentCommunicationTime: 168,
    },
    notificationSettings: {
      enabled: true,
      emailDigestTime: "08:00",
      reportReminderHoursBefore: 24,
      slaWarningPercentage: 80,
    },
    featureFlags: {
      speechToText: true,
      autoSummarization: true,
      photoUpload: true,
      exportToPDF: true,
    },
    updatedBy: "system",
    updatedAt: new Date().toISOString(),
  })

  // System Admin - User Management
  const [users, setUsers] = useState<UserType[]>([])
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // System Admin - Campus Management
  const [centers, setCenters] = useState<Center[]>([])
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null)
  const [centerSearchTerm, setCenterSearchTerm] = useState("")

  // System Admin - User Creation Dialog
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "TA" as Role,
    assignedCenterIds: [] as string[],
  })

  // System Admin - Schedule Management
  const [classes, setClasses] = useState<Class[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [teachers, setTeachers] = useState<UserType[]>([]) // Add teachers list
  const [tas, setTas] = useState<UserType[]>([]) // Add TAs list
  const [selectedStaff, setSelectedStaff] = useState<UserType | null>(null)
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false)
  const [isAssignClassesDialogOpen, setIsAssignClassesDialogOpen] = useState(false)
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([])

  useEffect(() => {
    const loadData = async () => {
      if (currentRole === "SystemAdmin") {
        const [usersData, configData, centersData, classesData, sessionsData] = await Promise.all([
          getAllUsers(),
          getSystemConfig(),
          getCenters(),
          fetchClasses(), // Load real classes
          fetchSessions(), // Load real sessions
        ])
        setUsers(usersData)
        setRiskConfig(configData)
        setCenters(centersData)
        setClasses(classesData)
        setSessions(sessionsData)

        setTeachers(usersData.filter((u) => u.role === "Teacher"))
        setTas(usersData.filter((u) => u.role === "TA"))
      }
    }
    loadData()
  }, [currentRole])

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    })
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Preferences Saved",
      description: "Your notification preferences have been updated.",
    })
  }

  const handleSaveDisplay = () => {
    toast({
      title: "Display Settings Saved",
      description: "Your display preferences have been updated.",
    })
  }

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your data is being prepared for download...",
    })
  }

  const handleSaveRiskConfig = async () => {
    await saveSystemConfig(riskConfig)
    toast({
      title: "Configuration Saved",
      description: "Risk level thresholds and system settings have been updated.",
    })
  }

  const handleUpdateUser = async (user: UserType) => {
    await updateUser(user.id, user)
    const updatedUsers = await getAllUsers()
    setUsers(updatedUsers)
    toast({
      title: "User Updated",
      description: `User ${user.name} has been updated successfully.`,
    })
  }

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const userId = `usr-${Date.now()}`
    const user: UserType = {
      id: userId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      assignedCenterIds: newUser.role === "ASA" ? newUser.assignedCenterIds : undefined,
    }

    await updateUser(userId, user)
    const updatedUsers = await getAllUsers()
    setUsers(updatedUsers)

    setIsCreateUserDialogOpen(false)
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "TA",
      assignedCenterIds: [],
    })

    toast({
      title: "User Created",
      description: `User ${user.name} has been created successfully.`,
    })
  }

  const handleViewStaffDetails = (staff: UserType) => {
    setSelectedStaff(staff)
    setIsViewDetailsDialogOpen(true)
  }

  const handleAssignClasses = (staff: UserType) => {
    setSelectedStaff(staff)
    // Pre-populate with current assignments
    const currentClasses = (classes as any[])
      .filter((c) => (staff.role === "Teacher" ? c.teacherId === staff.id : c.taIds?.includes(staff.id)))
      .map((c) => c.id)
    setSelectedClassIds(currentClasses)
    setIsAssignClassesDialogOpen(true)
  }

  const handleSaveClassAssignments = () => {
    if (!selectedStaff) return

    // Update class assignments based on role
    const updatedClasses = (classes as any[]).map((cls) => {
      if (selectedStaff.role === "Teacher") {
        // Assign/unassign teacher
        return {
          ...cls,
          teacherId: selectedClassIds.includes(cls.id)
            ? selectedStaff.id
            : cls.teacherId === selectedStaff.id
              ? null
              : cls.teacherId,
        }
      } else {
        // Assign/unassign TA
        const taIds = cls.taIds || []
        if (selectedClassIds.includes(cls.id)) {
          return { ...cls, taIds: taIds.includes(selectedStaff.id) ? taIds : [...taIds, selectedStaff.id] }
        } else {
          return { ...cls, taIds: taIds.filter((id: string) => id !== selectedStaff.id) }
        }
      }
    })

    toast({
      title: "Success",
      description: `Updated class assignments for ${selectedStaff.name}`,
    })
    setIsAssignClassesDialogOpen(false)
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredCenters = centers.filter(
    (c) =>
      c.name.toLowerCase().includes(centerSearchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(centerSearchTerm.toLowerCase()) ||
      c.nameVN.toLowerCase().includes(centerSearchTerm.toLowerCase()),
  )

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SystemAdmin":
        return "bg-purple-100 text-purple-700"
      case "TQM":
        return "bg-blue-100 text-blue-700"
      case "ASA":
        return "bg-green-100 text-green-700"
      case "Teacher":
        return "bg-orange-100 text-orange-700"
      case "TA":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const tabs = [
    { value: "profile", label: "Profile", roles: ["TA", "Teacher", "ASA", "TQM", "SystemAdmin"] },
    { value: "notifications", label: "Notifications", roles: ["TA", "Teacher", "ASA", "TQM", "SystemAdmin"] },
    { value: "display", label: "Display", roles: ["TA", "Teacher", "ASA", "TQM", "SystemAdmin"] },
    { value: "data", label: "Data", roles: ["TA", "Teacher", "ASA", "TQM", "SystemAdmin"] },
    { value: "teaching", label: "Teaching Tools", roles: ["Teacher", "TQM"] },
    { value: "student-care", label: "Student Care", roles: ["ASA", "TQM"] },
    { value: "quality", label: "Quality Control", roles: ["TQM"] },
    { value: "risk-config", label: "Risk Configuration", roles: ["SystemAdmin"] },
    { value: "users", label: "User Management", roles: ["SystemAdmin"] },
    { value: "campuses", label: "Campuses", roles: ["SystemAdmin"] },
    { value: "teachers", label: "Teachers", roles: ["SystemAdmin"] },
    { value: "tas", label: "TAs", roles: ["SystemAdmin"] },
    { value: "schedules", label: "Schedules", roles: ["SystemAdmin"] },
  ]

  return (
    <div className="flex-1 space-y-4 md:space-y-6 p-4 md:p-8 pt-4 md:pt-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your account and application preferences</p>
        </div>
      </div>      <Tabs defaultValue="profile" className="space-y-4 md:space-y-6">
        <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0 pb-2">
          <TabsList className="bg-muted/50 inline-flex w-max md:w-auto">
            {tabs
              .filter((tab) => tab.roles.includes(currentRole))
              .map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="text-xs md:text-sm whitespace-nowrap">
                  {(() => {
                    switch (tab.value) {
                      case "profile":
                        return <User className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                      case "notifications":
                        return <Bell className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                      case "display":
                        return <Monitor className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                      case "data":
                        return <Database className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                      case "risk-config":
                        return <Settings2 className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                      case "users":
                        return <Users className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                      case "campuses":
                        return <Building2 className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                      case "schedules":
                        return <UserPlus className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                      case "teaching":
                        return <Upload className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                      case "student-care":
                        return <Download className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                      case "quality":
                        return <AlertTriangle className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                      case "teachers":
                        return <User className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                      case "tas":
                        return <Users className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                      default:
                        return null
                    }
                  })()}
                  <span className="hidden xs:inline">{tab.label}</span>
                  <span className="xs:hidden">{tab.label.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
          </TabsList>
        </div>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details and account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={currentRole} disabled className="bg-muted" />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm new password" />
              </div>
              <Button onClick={handleSaveProfile} className="w-full">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email alerts for important updates</p>
                </div>
                <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="report-reminders">Report Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get reminded about pending class reports</p>
                </div>
                <Switch id="report-reminders" checked={reportReminders} onCheckedChange={setReportReminders} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="special-requests">Special Request Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notifications for new or overdue special requests</p>
                </div>
                <Switch
                  id="special-requests"
                  checked={specialRequestAlerts}
                  onCheckedChange={setSpecialRequestAlerts}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="daily-digest">Daily Digest</Label>
                  <p className="text-sm text-muted-foreground">Receive a daily summary of activities</p>
                </div>
                <Switch id="daily-digest" checked={dailyDigest} onCheckedChange={setDailyDigest} />
              </div>
              <Button onClick={handleSaveNotifications} className="w-full">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>Customize how information is displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger id="date-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-save">Auto-save</Label>
                  <p className="text-sm text-muted-foreground">Automatically save changes while you work</p>
                </div>
                <Switch id="auto-save" checked={autoSummarization} onCheckedChange={setautoSummarization} />
              </div>
              <Button onClick={handleSaveDisplay} className="w-full">
                Save Display Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Import, export, and manage your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Export Data</Label>
                <p className="text-sm text-muted-foreground">Download your data in various formats</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Export as JSON
                  </Button>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Export as CSV
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Import Data</Label>
                <p className="text-sm text-muted-foreground">Upload data from a file</p>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Data
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Danger Zone
                </Label>
                <p className="text-sm text-muted-foreground">Clear all local data (this cannot be undone)</p>
                <Button variant="destructive">Clear All Data</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Configuration Tab (System Admin Only) */}
        {currentRole === "SystemAdmin" && (
          <TabsContent value="risk-config">
            <Card>
              <CardHeader>
                <CardTitle>Risk Level Configuration</CardTitle>
                <CardDescription>Configure thresholds and rules for student risk assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Risk Level Rules Explained
                  </h4>
                  <div className="text-sm text-blue-800 space-y-2">
                    <p>
                      <strong>Green (Thriving):</strong> Student attendance ≥ Yellow threshold, fewer negative notes
                      than Yellow threshold, no overdue requests
                    </p>
                    <p>
                      <strong>Yellow (Needs Support):</strong> Student attendance between Red and Yellow thresholds, or
                      has Yellow threshold negative notes, or has 1 overdue request
                    </p>
                    <p>
                      <strong>Red (Urgent Care):</strong> Student attendance below Red threshold, or has Red threshold+
                      negative notes, or has 2+ overdue requests
                    </p>
                    <p className="pt-2 border-t border-blue-200">
                      <strong>Note:</strong> The system evaluates all conditions and assigns the highest risk level that
                      applies to the student.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Attendance Thresholds (%)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set minimum attendance percentage for each risk level. Students below Red threshold will be marked
                    as high risk.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="attendance-red">Red Risk (Below)</Label>
                      <Input
                        id="attendance-red"
                        type="number"
                        min="0"
                        max="100"
                        value={riskConfig.riskLevelThresholds.attendanceRedThreshold}
                        onChange={(e) =>
                          setRiskConfig({
                            ...riskConfig,
                            riskLevelThresholds: {
                              ...riskConfig.riskLevelThresholds,
                              attendanceRedThreshold: Number.parseInt(e.target.value),
                            },
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground">Default: 75% - Student needs urgent intervention</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="attendance-yellow">Yellow Risk (Below)</Label>
                      <Input
                        id="attendance-yellow"
                        type="number"
                        min="0"
                        max="100"
                        value={riskConfig.riskLevelThresholds.attendanceYellowThreshold}
                        onChange={(e) =>
                          setRiskConfig({
                            ...riskConfig,
                            riskLevelThresholds: {
                              ...riskConfig.riskLevelThresholds,
                              attendanceYellowThreshold: Number.parseInt(e.target.value),
                            },
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground">Default: 90% - Student needs attention</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Negative Notes Count</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Number of "Areas for Improvement" notes in recent sessions (last 5 sessions) to trigger risk levels.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="notes-red">Red Risk (≥)</Label>
                      <Input
                        id="notes-red"
                        type="number"
                        min="0"
                        value={riskConfig.riskLevelThresholds.negativeNotesRedCount}
                        onChange={(e) =>
                          setRiskConfig({
                            ...riskConfig,
                            riskLevelThresholds: {
                              ...riskConfig.riskLevelThresholds,
                              negativeNotesRedCount: Number.parseInt(e.target.value),
                            },
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground">Default: 3 - Multiple consecutive concerns</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes-yellow">Yellow Risk (≥)</Label>
                      <Input
                        id="notes-yellow"
                        type="number"
                        min="0"
                        value={riskConfig.riskLevelThresholds.negativeNotesYellowCount}
                        onChange={(e) =>
                          setRiskConfig({
                            ...riskConfig,
                            riskLevelThresholds: {
                              ...riskConfig.riskLevelThresholds,
                              negativeNotesYellowCount: Number.parseInt(e.target.value),
                            },
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground">Default: 2 - Starting to show concerns</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-4">Feature Flags</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Auto-save</Label>
                      <Switch
                        checked={riskConfig.featureFlags.autoSummarization}
                        onCheckedChange={(checked: boolean) =>
                          setRiskConfig({
                            ...riskConfig,
                            featureFlags: { ...riskConfig.featureFlags, autoSummarization: checked },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Speech to Text</Label>
                      <Switch
                        checked={riskConfig.featureFlags.speechToText}
                        onCheckedChange={(checked: boolean) =>
                          setRiskConfig({
                            ...riskConfig,
                            featureFlags: { ...riskConfig.featureFlags, speechToText: checked },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Photo Upload</Label>
                      <Switch
                        checked={riskConfig.featureFlags.photoUpload}
                        onCheckedChange={(checked: boolean) =>
                          setRiskConfig({
                            ...riskConfig,
                            featureFlags: { ...riskConfig.featureFlags, photoUpload: checked },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Risk Alerts</Label>
                      <Switch
                        checked={riskConfig.featureFlags.exportToPDF}
                        onCheckedChange={(checked: boolean) =>
                          setRiskConfig({
                            ...riskConfig,
                            featureFlags: { ...riskConfig.featureFlags, exportToPDF: checked },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={handleSaveRiskConfig} className="w-full">
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* User Management Tab (System Admin Only) */}
        {currentRole === "SystemAdmin" && (
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                  </div>
                  <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                        <DialogDescription>
                          Add a new user to the system with role and campus assignments
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-user-name">Full Name *</Label>
                            <Input
                              id="new-user-name"
                              value={newUser.name}
                              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                              placeholder="Nguyễn Văn A"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-user-email">Email *</Label>
                            <Input
                              id="new-user-email"
                              type="email"
                              value={newUser.email}
                              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                              placeholder="user@vus.edu.vn"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-user-password">Password *</Label>
                            <Input
                              id="new-user-password"
                              type="password"
                              value={newUser.password}
                              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                              placeholder="••••••••"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-user-role">Role *</Label>
                            <Select
                              value={newUser.role}
                              onValueChange={(value: Role) => setNewUser({ ...newUser, role: value })}
                            >
                              <SelectTrigger id="new-user-role">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="TA">TA</SelectItem>
                                <SelectItem value="Teacher">Teacher</SelectItem>
                                <SelectItem value="ASA">ASA</SelectItem>
                                <SelectItem value="TQM">TQM</SelectItem>
                                <SelectItem value="SystemAdmin">System Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        {newUser.role === "ASA" && (
                          <div className="space-y-2">
                            <Label>Assigned Campuses (Select 2-3)</Label>
                            <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                              {centers.map((center) => (
                                <div key={center.id} className="flex items-center space-x-2 py-2">
                                  <Checkbox
                                    checked={newUser.assignedCenterIds.includes(center.id)}
                                    onCheckedChange={(checked: boolean) => {
                                      if (checked) {
                                        setNewUser({
                                          ...newUser,
                                          assignedCenterIds: [...newUser.assignedCenterIds, center.id],
                                        })
                                      } else {
                                        setNewUser({
                                          ...newUser,
                                          assignedCenterIds: newUser.assignedCenterIds.filter((id) => id !== center.id),
                                        })
                                      }
                                    }}
                                  />
                                  <Label className="cursor-pointer">
                                    {center.code} - {center.nameVN}
                                  </Label>
                                </div>
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Selected: {newUser.assignedCenterIds.length} campuses
                            </p>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateUserDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateUser}>Create User</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Assigned Campuses</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            {user.assignedCenterIds ? (
                              <div className="flex flex-wrap gap-1">
                                {user.assignedCenterIds.map((centerId) => {
                                  const center = centers.find((c) => c.id === centerId)
                                  return center ? (
                                    <Badge key={centerId} variant="outline" className="text-xs">
                                      {center.code}
                                    </Badge>
                                  ) : null
                                })}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">All</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Campus Management Tab (System Admin Only) */}
        {currentRole === "SystemAdmin" && (
          <TabsContent value="campuses">
            <Card>
              <CardHeader>
                <CardTitle>Campus Management</CardTitle>
                <CardDescription>View and manage VUS centers across all locations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Search campuses by name or code..."
                  value={centerSearchTerm}
                  onChange={(e) => setCenterSearchTerm(e.target.value)}
                />
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Name (English)</TableHead>
                        <TableHead>Name (Vietnamese)</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Zone</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCenters.map((center) => (
                        <TableRow key={center.id}>
                          <TableCell className="font-medium">{center.code}</TableCell>
                          <TableCell>{center.name}</TableCell>
                          <TableCell>{center.nameVN}</TableCell>
                          <TableCell>{center.location}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{center.zone}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <p className="text-sm text-muted-foreground">Total campuses: {filteredCenters.length}</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Schedule Management Tab (System Admin Only) */}
        {currentRole === "SystemAdmin" && (
          <TabsContent value="schedules">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Management</CardTitle>
                <CardDescription>Manage teacher and TA assignments to classes and individual sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Teacher Management</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    All teachers and their currently assigned classes
                  </p>
                  <div className="overflow-auto border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Teacher Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Assigned Classes</TableHead>
                          <TableHead>Total Sessions</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teachers.map((teacher) => {
                          const assignedClasses = classes.filter((c: any) => c.teacherId === teacher.id)
                          const totalSessions = sessions.filter((s: any) =>
                            assignedClasses.some((c: any) => c.id === s.classId),
                          ).length
                          return (
                            <TableRow key={teacher.id}>
                              <TableCell className="font-medium">{teacher.name}</TableCell>
                              <TableCell>{teacher.email}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {assignedClasses.map((c: any) => (
                                    <Badge key={c.id} variant="outline">
                                      {c.code}
                                    </Badge>
                                  ))}
                                  {assignedClasses.length === 0 && (
                                    <span className="text-muted-foreground text-sm">No classes</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{totalSessions}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  Manage
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">TA Management</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    All teaching assistants and their currently assigned classes
                  </p>
                  <div className="overflow-auto border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>TA Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Assigned Classes</TableHead>
                          <TableHead>Total Sessions</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tas.map((ta) => {
                          const assignedClasses = classes.filter((c: any) => c.taIds?.includes(ta.id))
                          const totalSessions = sessions.filter((s: any) =>
                            assignedClasses.some((c: any) => c.id === s.classId),
                          ).length
                          return (
                            <TableRow key={ta.id}>
                              <TableCell className="font-medium">{ta.name}</TableCell>
                              <TableCell>{ta.email}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {assignedClasses.map((c: any) => (
                                    <Badge key={c.id} variant="outline">
                                      {c.code}
                                    </Badge>
                                  ))}
                                  {assignedClasses.length === 0 && (
                                    <span className="text-muted-foreground text-sm">No classes</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{totalSessions}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  Manage
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <Separator />

                {/* Class assignments */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Class Assignments</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Current teacher and TA assignments for each class
                  </p>
                  <div className="overflow-auto border rounded-lg">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-3 font-semibold">Class Code</th>
                          <th className="text-left p-3 font-semibold">Program</th>
                          <th className="text-left p-3 font-semibold">Teacher</th>
                          <th className="text-left p-3 font-semibold">TA</th>
                          <th className="text-left p-3 font-semibold">Schedule</th>
                          <th className="text-left p-3 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classes.map((cls: any) => {
                          const teacher = teachers.find((t) => t.id === cls.teacherId)
                          const taList = tas.filter((ta) => cls.taIds?.includes(ta.id))
                          return (
                            <tr key={cls.id} className="border-b">
                              <td className="p-3 font-medium">{cls.code}</td>
                              <td className="p-3">{cls.program}</td>
                              <td className="p-3">{teacher?.name || "Not assigned"}</td>
                              <td className="p-3">
                                {taList.length > 0 ? taList.map((ta) => ta.name).join(", ") : "Not assigned"}
                              </td>
                              <td className="p-3 text-sm text-muted-foreground">
                                {cls.shift} - {cls.startTime}
                              </td>
                              <td className="p-3">
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <Separator />

                {/* Session-specific assignments */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Session Assignments</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    View and modify teacher/TA assignments for specific sessions (useful for substitute teachers)
                  </p>
                  <div className="space-y-4">
                    {classes.slice(0, 3).map((cls: any) => {
                      const classSessions = sessions.filter((s: any) => s.classId === cls.id).slice(0, 3)
                      return (
                        <Card key={cls.id}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">{cls.code}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {classSessions.map((session: any) => (
                                <div
                                  key={session.id}
                                  className="flex items-center justify-between p-3 rounded-lg border"
                                >
                                  <div className="space-y-1">
                                    <div className="font-medium">
                                      Session {session.sessionNumber} - {session.lessonTitle || session.topic}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{session.scheduledDate}</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge>{session.teacherName || "No teacher"}</Badge>
                                    <Badge variant="outline">{session.taName || "No TA"}</Badge>
                                    <Button variant="ghost" size="sm">
                                      Reassign
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {currentRole === "SystemAdmin" && (
          <TabsContent value="teachers">
            <Card>
              <CardHeader>
                <CardTitle>Teachers Management</CardTitle>
                <CardDescription>Manage all teachers and their class assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search teachers by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                </div>

                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Assigned Classes</TableHead>
                        <TableHead>Total Sessions</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teachers
                        .filter(
                          (t) =>
                            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            t.email.toLowerCase().includes(searchTerm.toLowerCase()),
                        )
                        .map((teacher) => {
                          const teacherClasses = (classes as any[]).filter((c) => c.teacherId === teacher.id)
                          const teacherSessions = (sessions as any[]).filter((s) =>
                            teacherClasses.some((c) => c.id === s.classId),
                          )

                          return (
                            <TableRow key={teacher.id}>
                              <TableCell className="font-medium">{teacher.name}</TableCell>
                              <TableCell>{teacher.email}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {teacherClasses.length > 0 ? (
                                    teacherClasses.map((cls) => (
                                      <Badge key={cls.id} variant="outline">
                                        {cls.code}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-sm text-muted-foreground">No classes</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge>{teacherSessions.length} sessions</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleViewStaffDetails(teacher)}>
                                    View
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleAssignClasses(teacher)}>
                                    Assign
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </Table>
                </div>

                {teachers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No teachers found. Create teacher accounts in the User Management tab.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {currentRole === "SystemAdmin" && (
          <TabsContent value="tas">
            <Card>
              <CardHeader>
                <CardTitle>TAs Management</CardTitle>
                <CardDescription>Manage all teaching assistants and their class assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search TAs by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                </div>

                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Assigned Classes</TableHead>
                        <TableHead>Total Sessions</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tas
                        .filter(
                          (ta) =>
                            ta.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ta.email.toLowerCase().includes(searchTerm.toLowerCase()),
                        )
                        .map((ta) => {
                          const taClasses = (classes as any[]).filter((c) => c.taIds?.includes(ta.id))
                          const taSessions = (sessions as any[]).filter((s) =>
                            taClasses.some((c) => c.id === s.classId),
                          )

                          return (
                            <TableRow key={ta.id}>
                              <TableCell className="font-medium">{ta.name}</TableCell>
                              <TableCell>{ta.email}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {taClasses.length > 0 ? (
                                    taClasses.map((cls) => (
                                      <Badge key={cls.id} variant="outline">
                                        {cls.code}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-sm text-muted-foreground">No classes</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge>{taSessions.length} sessions</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleViewStaffDetails(ta)}>
                                    View
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleAssignClasses(ta)}>
                                    Assign
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </Table>
                </div>

                {tas.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No TAs found. Create TA accounts in the User Management tab.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Quality Control Tab (TQM Only) */}
        {currentRole === "TQM" && (
          <TabsContent value="quality">
            <Card>
              <CardHeader>
                <CardTitle>Quality Control</CardTitle>
                <CardDescription>Monitor and improve quality control processes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Placeholder for Quality Control content */}
                <p className="text-sm text-muted-foreground">Coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedStaff?.role} Details</DialogTitle>
            <DialogDescription>Viewing assignments and performance for {selectedStaff?.name}</DialogDescription>
          </DialogHeader>

          {selectedStaff && (
            <div className="space-y-6 py-4">
              {/* Staff Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <div className="font-medium">{selectedStaff.name}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <div className="font-medium">{selectedStaff.email}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Role</Label>
                  <Badge className={getRoleBadgeColor(selectedStaff.role)}>{selectedStaff.role}</Badge>
                </div>
              </div>

              <Separator />

              {/* Assigned Classes */}
              <div>
                <h4 className="font-semibold mb-3">Assigned Classes</h4>
                {(() => {
                  const staffClasses = (classes as any[]).filter((c) =>
                    selectedStaff.role === "Teacher"
                      ? c.teacherId === selectedStaff.id
                      : c.taIds?.includes(selectedStaff.id),
                  )

                  return staffClasses.length > 0 ? (
                    <div className="space-y-3">
                      {staffClasses.map((cls) => {
                        const classSessions = (sessions as any[]).filter((s) => s.classId === cls.id)
                        const completedSessions = classSessions.filter((s) => s.status === "Completed")

                        return (
                          <Card key={cls.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <div className="font-medium">
                                    {cls.code} - {cls.program}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {cls.shift} • {cls.startTime} • {cls.centerCode}
                                  </div>
                                  <div className="flex gap-2 mt-2">
                                    <Badge variant="outline">
                                      {completedSessions.length}/{classSessions.length} sessions
                                    </Badge>
                                    <Badge variant="outline">{cls.studentCount || 0} students</Badge>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                  <a href={`/classes/${cls.id}`}>View Class</a>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">No classes assigned yet</div>
                  )
                })()}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsViewDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAssignClassesDialogOpen} onOpenChange={setIsAssignClassesDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Classes to {selectedStaff?.name}</DialogTitle>
            <DialogDescription>
              Select the classes you want to assign to this {selectedStaff?.role?.toLowerCase()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
              {(classes as any[]).map((cls) => (
                <div key={cls.id} className="flex items-start space-x-3 py-3 border-b last:border-0">
                  <Checkbox
                    checked={selectedClassIds.includes(cls.id)}
                    onCheckedChange={(checked: boolean) => {
                      if (checked) {
                        setSelectedClassIds([...selectedClassIds, cls.id])
                      } else {
                        setSelectedClassIds(selectedClassIds.filter((id) => id !== cls.id))
                      }
                    }}
                  />
                  <div className="flex-1 space-y-1">
                    <Label className="cursor-pointer font-medium">
                      {cls.code} - {cls.program}
                    </Label>
                    <div className="text-sm text-muted-foreground">
                      {cls.shift} • {cls.startTime} • {cls.centerCode}
                    </div>
                  </div>
                  <Badge variant="outline">{cls.studentCount || 0} students</Badge>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Selected Classes:</span>
              <Badge>{selectedClassIds.length}</Badge>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignClassesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveClassAssignments}>Save Assignments</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Dummy functions for demonstration purposes
const getClasses = async () => {
  return [
    {
      id: 1,
      code: "CS101",
      program: "Computer Science",
      level: "Undergraduate",
      shift: "Morning",
      startTime: "09:00",
      teacherId: "usr-1",
      taIds: ["usr-2"],
    },
    // ... more classes
  ]
}

const getSessions = async () => {
  return [
    {
      id: 1,
      classId: 1,
      sessionNumber: 1,
      topic: "Introduction to Programming",
      lessonTitle: "Introduction to Programming",
      scheduledDate: "2023-10-01",
      startTime: "09:00",
      endTime: "10:30",
      teacherName: "Dr. Smith",
      taName: "John Doe",
    },
    // ... more sessions
  ]
}
