// Core entity types for Digital Class Folder system

export type Role = "TA" | "Teacher" | "ASA" | "TQM" | "SystemAdmin"

export type RiskLevel = "Green" | "Yellow" | "Red"

export type AttendanceStatus = "Present" | "Absent" | "Late"

export type NoteType = "Positive" | "NeedsImprovement" | "SBI"

export type ClassReportStatus = "Draft" | "Submitted" | "Approved"

export type SpecialRequestStatus = "Open" | "InProgress" | "Resolved" | "Closed"

export type SpecialRequestPriority = "Low" | "Medium" | "High" | "Urgent"

export type NoteFrequency = "Daily" | "Periodic"

export type ParticipationLevel = "Active" | "Moderate" | "Passive"
export type AttentionSpan = "Full" | "Most" | "Struggled"
export type PeerInteraction = "Good" | "NeedsSupport"
export type HomeworkCompletion = "Yes" | "No" | "Partial"
export type HomeworkQuality = "Excellent" | "Good" | "NeedsImprovement"
export type InterventionEffectiveness = "Yes" | "No" | "TBD"

export interface Center {
  id: string
  code: string // Added campus code field
  name: string
  nameVN: string
  location: string
  zone: string // Added zone field (HCMC, SEP, SCP)
}

export interface Class {
  id: string
  centerId: string
  code: string // Format: ProgramLevel_ShiftTerm (e.g., HK6p_Aa2501N)
  program: string // Happy Kids, Super Kids, Young Leader
  level: string // HK4/HK6, SKG1/SKG3, YLA1/YLB1/YLC2
  shift: "Morning" | "Afternoon" | "Evening"
  status: "Active" | "Completed" | "Upcoming"
  startDate: string
  endDate: string
  teacherId: string
  taIds: string[]
  studentCount: number
  riskLevel?: RiskLevel
}

export interface Session {
  id: string
  classId: string
  sessionNumber: number
  scheduledDate: string
  actualDate?: string
  startTime: string
  endTime: string
  topic: string
  status: "Scheduled" | "InProgress" | "Completed" | "Cancelled"
  hasReport: boolean
  bookPages?: string
  unitNumber?: string
  lessonTitle?: string
  lessonObjectives?: string
  homeAssignment?: string
  teacherName?: string
  taName?: string
}

export interface Student {
  id: string
  fullName: string
  avatar?: string // Added avatar field for student photos
  dateOfBirth: string
  phoneNumber?: string
  email?: string
  guardianName?: string
  guardianPhone?: string
  enrollmentDate: string
  status: "Active" | "Inactive" | "Withdrawn"
  riskLevel?: RiskLevel
  isNewStudent?: boolean
}

export interface Enrollment {
  id: string
  studentId: string
  classId: string
  enrolledDate: string
  completedDate?: string
  status: "Active" | "Completed" | "Dropped"
}

export interface Attendance {
  id: string
  sessionId: string
  studentId: string
  status: AttendanceStatus
  reason?: string
  notes?: string
}

export interface StudentNote {
  id: string
  sessionId: string
  studentId: string
  noteType: NoteType
  frequency: NoteFrequency
  content: string
  parentSupportSuggestion?: string
  tags: string[]
  createdBy: string
  createdAt: string
}

export interface StudentSessionMetrics {
  id: string
  sessionId: string
  studentId: string

  // Learning Progress
  skillsBreakdown: {
    speaking: number // 1-5
    listening: number // 1-5
    reading: number // 1-5
    writing: number // 1-5
  }
  lessonObjectivesMastered: boolean
  participationLevel: ParticipationLevel

  // Behavioral & Engagement
  attentionSpan: AttentionSpan
  peerInteraction: PeerInteraction
  englishUsage: boolean // Did they proactively use English

  // Homework & Home Support
  homeworkCompletion: HomeworkCompletion
  homeworkQuality?: HomeworkQuality
  parentFollowedUp: boolean

  // Intervention Tracking
  actionTaken?: string
  effectiveness?: InterventionEffectiveness
  nextSteps?: string

  // Positive Reinforcement
  achievementsToday?: string
  growthMoments?: string

  updatedBy: string
  updatedAt: string
}

export interface ClassReport {
  id: string
  sessionId: string
  summary: string
  progressUpdate: string
  areasForImprovement: string
  incidents?: string
  nextActions: string
  homeAssignment: string
  status: ClassReportStatus
  checklistItems: ChecklistItem[]
  submittedBy?: string
  submittedAt?: string
  approvedBy?: string
  approvedAt?: string
}

export interface ChecklistItem {
  id: string
  label: string
  labelVN: string
  checked: boolean
  required: boolean
}

export interface SpecialRequest {
  id: string
  classId: string
  studentId?: string
  type: string
  title: string
  description: string
  priority: SpecialRequestPriority
  status: SpecialRequestStatus
  requestedBy: string
  requestedAt: string
  dueDate?: string
  assignedTo?: string
  resolvedAt?: string
  resolution?: string
  slaStatus: "OnTrack" | "AtRisk" | "Overdue"
}

export interface ParentCommunication {
  id: string
  studentId: string
  date: string
  topic: string
  method: "Phone" | "Email" | "InPerson" | "App"
  outcome: string
  followUpRequired: boolean
  followUpDate?: string
  createdBy: string
}

export interface StudentPhoto {
  id: string
  studentId: string
  sessionId: string
  imageUrl: string
  caption?: string
  takenBy: string
  takenAt: string
  shareWithParents: boolean
  tags: string[]
}

export interface CommentSnippet {
  id: string
  category: string
  textEN: string
  textVN: string
  tags: string[]
  usageCount: number
}

export interface User {
  id: string
  name: string
  email: string
  role: Role
  centerId?: string
  assignedCenterIds?: string[] // For ASA - manages 2-3 campuses
}

export type UserType = User

export interface PeriodicCommentSchedule {
  classId: string
  scheduledWeeks: number[]
  programType: string // "Short" or "Long" program
}

export interface Guideline {
  id: string
  section: "4.1" | "4.2" | "4.3" | "4.4"
  title: string
  titleVN: string
  content: string
  contentVN: string
  contextTriggers?: string[] // When to show this guideline
  examples?: string[]
}

export interface TAChecklist {
  id: string
  sessionId?: string
  items: ChecklistItem[]
  completedAt?: string
}

export interface NewStudentChecklist {
  studentId: string
  steps: {
    step: number
    description: string
    descriptionVN: string
    completed: boolean
    completedAt?: string
  }[]
}

export interface SystemConfig {
  id: string
  riskLevelThresholds: RiskLevelThresholds
  slaSettings: SLASettings
  notificationSettings: NotificationSettings
  featureFlags: FeatureFlags
  updatedBy: string
  updatedAt: string
}

export interface RiskLevelThresholds {
  attendanceRedThreshold: number // < 75%
  attendanceYellowThreshold: number // < 90%
  negativeNotesRedCount: number // >= 3 in last 5 sessions
  negativeNotesYellowCount: number // >= 1-2 in last 5 sessions
  overdueRequestsRedCount: number // >= 2
  overdueRequestsYellowCount: number // >= 1
  consecutiveAbsencesRed: number // >= 3
  consecutiveAbsencesYellow: number // >= 2
}

export interface SLASettings {
  specialRequestResponseTime: number // hours
  reportApprovalTime: number // hours
  parentCommunicationTime: number // hours
}

export interface NotificationSettings {
  enabled: boolean
  emailDigestTime: string // "08:00"
  reportReminderHoursBefore: number
  slaWarningPercentage: number // 80% = warn when 80% of SLA time used
}

export interface FeatureFlags {
  speechToText: boolean
  autoSummarization: boolean
  photoUpload: boolean
  exportToPDF: boolean
}
