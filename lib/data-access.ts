import type { Role, UserType } from "./types"
import {
  mockCenters,
  mockClasses,
  mockSessions,
  mockStudents,
  mockEnrollments,
  mockAttendance,
  mockStudentNotes,
  mockClassReports,
  mockSpecialRequests,
  mockCommentSnippets,
  mockUsers,
  mockStudentSessionMetrics,
  mockParentCommunications,
  mockStudentPhotos,
  mockGuidelines,
  mockSystemConfig, // Added system config import
} from "./mock-data"
import { calculateRiskScore } from "./ai-helpers"

// Data access layer - all functions return promises to simulate async API calls

const STORAGE_KEYS = {
  ATTENDANCE: "vus_attendance",
  NOTES: "vus_student_notes",
  METRICS: "vus_student_metrics",
  REPORTS: "vus_class_reports", // Added reports to storage keys
  SYSTEM_CONFIG: "vus_system_config", // Added system config storage key
}

// Load data from localStorage or fall back to mock data
function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch (e) {
    console.error(`[v0] Error loading from localStorage:`, e)
    return fallback
  }
}

// Save data to localStorage
function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(data))
    console.log(`[v0] Saved to localStorage: ${key}, count: ${data.length}`)
  } catch (e) {
    console.error(`[v0] Error saving to localStorage:`, e)
  }
}

// Initialize storage-backed arrays
const attendanceData = loadFromStorage(STORAGE_KEYS.ATTENDANCE, mockAttendance)
const notesData = loadFromStorage(STORAGE_KEYS.NOTES, mockStudentNotes)
const metricsData = loadFromStorage(STORAGE_KEYS.METRICS, mockStudentSessionMetrics)
const reportsData = loadFromStorage(STORAGE_KEYS.REPORTS, mockClassReports) // Initialize reports data from localStorage
const systemConfigData = loadFromStorage(STORAGE_KEYS.SYSTEM_CONFIG, [mockSystemConfig])

export async function getCenters(userId?: string) {
  if (userId) {
    const user = mockUsers.find((u) => u.id === userId)
    if (user?.role === "ASA" && user.assignedCenterIds) {
      return mockCenters.filter((c) => user.assignedCenterIds?.includes(c.id))
    }
  }
  return mockCenters
}

export async function getClasses(centerId?: string) {
  console.log(`[v0] getClasses called with centerId: ${centerId}`)
  console.log(`[v0] Total mockClasses available: ${mockClasses.length}`)

  if (centerId) {
    const filtered = mockClasses.filter((c) => c.centerId === centerId)
    console.log(`[v0] Filtered classes for center ${centerId}: ${filtered.length}`)
    return filtered
  }

  console.log(`[v0] Returning all ${mockClasses.length} classes`)
  return mockClasses
}

export async function getClassById(classId: string) {
  return mockClasses.find((c) => c.id === classId)
}

export async function getSessions(classId?: string) {
  if (classId) {
    return mockSessions.filter((s) => s.classId === classId)
  }
  return mockSessions
}

export async function getSessionById(sessionId: string) {
  return mockSessions.find((s) => s.id === sessionId)
}

export async function getStudents() {
  return mockStudents
}

export async function getStudentsByClass(classId: string) {
  const enrollments = mockEnrollments.filter((e) => e.classId === classId && e.status === "Active")
  const studentIds = enrollments.map((e) => e.studentId)
  return mockStudents.filter((s) => studentIds.includes(s.id))
}

export async function getAttendanceBySession(sessionId: string) {
  console.log(`[v0] Getting attendance for session ${sessionId}, total records: ${attendanceData.length}`)
  return attendanceData.filter((a) => a.sessionId === sessionId)
}

export async function getStudentNotesBySession(sessionId: string) {
  console.log(`[v0] Getting notes for session ${sessionId}, total notes: ${notesData.length}`)
  return notesData.filter((n) => n.sessionId === sessionId)
}

export async function getClassReportBySession(sessionId: string) {
  return reportsData.find((r) => r.sessionId === sessionId)
}

export async function getSpecialRequests(filters?: {
  classId?: string
  status?: string
  priority?: string
  slaStatus?: string
}) {
  let results = mockSpecialRequests

  if (filters?.classId) {
    results = results.filter((r) => r.classId === filters.classId)
  }
  if (filters?.status) {
    results = results.filter((r) => r.status === filters.status)
  }
  if (filters?.priority) {
    results = results.filter((r) => r.priority === filters.priority)
  }
  if (filters?.slaStatus) {
    results = results.filter((r) => r.slaStatus === filters.slaStatus)
  }

  return results
}

export async function getCommentSnippets(category?: string) {
  if (category) {
    return mockCommentSnippets.filter((s) => s.category.includes(category))
  }
  return mockCommentSnippets
}

export async function getUserByRole(role: Role) {
  return mockUsers.find((u) => u.role === role)
}

export async function getStudentSessionMetrics(sessionId: string, studentId?: string) {
  let metrics = metricsData.filter((m) => m.sessionId === sessionId)
  if (studentId) {
    metrics = metrics.filter((m) => m.studentId === studentId)
  }
  console.log(`[v0] Getting metrics for session ${sessionId}, found: ${metrics.length}`)
  return metrics
}

export async function getParentCommunications(studentId: string) {
  return mockParentCommunications.filter((c) => c.studentId === studentId)
}

export async function getStudentPhotos(filters?: { studentId?: string; sessionId?: string }) {
  let photos = mockStudentPhotos

  if (filters?.studentId) {
    photos = photos.filter((p) => p.studentId === filters.studentId)
  }
  if (filters?.sessionId) {
    photos = photos.filter((p) => p.sessionId === filters.sessionId)
  }

  return photos.sort((a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime())
}

export async function getEnrollments(studentId?: string) {
  if (studentId) {
    return mockEnrollments.filter((e) => e.studentId === studentId)
  }
  return mockEnrollments
}

export async function getStudentNotesByStudent(studentId: string) {
  return notesData.filter((n) => n.studentId === studentId)
}

export async function getAttendance(sessionId: string) {
  console.log(`[v0] Getting attendance for session ${sessionId}, total records: ${attendanceData.length}`)
  return attendanceData.filter((a) => a.sessionId === sessionId)
}

export async function getStudentNotes(sessionId: string) {
  console.log(`[v0] Getting notes for session ${sessionId}, total notes: ${notesData.length}`)
  return notesData.filter((n) => n.sessionId === sessionId)
}

export async function getStudentMetrics(filters?: { studentId?: string; sessionId?: string }) {
  let metrics = metricsData

  if (filters?.studentId) {
    metrics = metrics.filter((m) => m.studentId === filters.studentId)
  }
  if (filters?.sessionId) {
    metrics = metrics.filter((m) => m.sessionId === filters.sessionId)
  }

  return metrics
}

export async function getGuidelines(section?: string) {
  if (section) {
    return mockGuidelines.filter((g) => g.section === section)
  }
  return mockGuidelines
}

export async function getGuidelineById(id: string) {
  return mockGuidelines.find((g) => g.id === id)
}

export async function getContextualGuidelines(context: string) {
  return mockGuidelines.filter((g) => g.contextTriggers?.includes(context))
}

export { mockClassReports, mockSessions, mockUsers, mockEnrollments, mockSystemConfig }

export async function saveAttendance(attendanceRecords: typeof mockAttendance) {
  console.log(`[v0] Saving ${attendanceRecords.length} attendance records`)

  attendanceRecords.forEach((record) => {
    const existingIndex = attendanceData.findIndex(
      (a) => a.sessionId === record.sessionId && a.studentId === record.studentId,
    )
    if (existingIndex >= 0) {
      attendanceData[existingIndex] = record
      console.log(`[v0] Updated attendance for student ${record.studentId}`)
    } else {
      attendanceData.push(record)
      console.log(`[v0] Added new attendance for student ${record.studentId}`)
    }
  })

  saveToStorage(STORAGE_KEYS.ATTENDANCE, attendanceData)
  return attendanceRecords
}

export async function saveStudentNotes(notes: typeof mockStudentNotes) {
  console.log(`[v0] Saving ${notes.length} notes`)

  notes.forEach((note) => {
    // Check if note already exists
    const exists = notesData.some((n) => n.id === note.id)
    if (!exists) {
      notesData.push(note)
      console.log(`[v0] Added new note ${note.id} for student ${note.studentId}`)
    }
  })

  saveToStorage(STORAGE_KEYS.NOTES, notesData)
  return notes
}

export async function saveStudentMetrics(metrics: typeof mockStudentSessionMetrics) {
  console.log(`[v0] Saving ${metrics.length} metrics`)

  metrics.forEach((metric) => {
    const existingIndex = metricsData.findIndex(
      (m) => m.sessionId === metric.sessionId && m.studentId === metric.studentId,
    )
    if (existingIndex >= 0) {
      metricsData[existingIndex] = metric
      console.log(`[v0] Updated metrics for student ${metric.studentId}`)
    } else {
      metricsData.push(metric)
      console.log(`[v0] Added new metrics for student ${metric.studentId}`)
    }
  })

  saveToStorage(STORAGE_KEYS.METRICS, metricsData)
  return metrics
}

// Helper functions for dashboard stats

export async function getTodaysSessions(role: Role, userId: string) {
  const today = "2026-01-15" // Current date from context
  let sessions = mockSessions.filter((s) => s.scheduledDate === today)

  if (role === "TA" || role === "Teacher") {
    // Filter by classes the user teaches
    const userClasses = mockClasses.filter((c) => c.teacherId === userId || c.taIds.includes(userId))
    const classIds = userClasses.map((c) => c.id)
    sessions = sessions.filter((s) => classIds.includes(s.classId))
  }

  return sessions
}

export async function getDraftReports(role: Role, userId: string) {
  let reports = mockClassReports.filter((r) => r.status === "Draft" || r.status === "Submitted")

  if (role === "TA") {
    // Filter by sessions from classes the TA is assigned to
    const taClasses = mockClasses.filter((c) => c.taIds.includes(userId))
    const classIds = taClasses.map((c) => c.id)
    const classSessions = mockSessions.filter((s) => classIds.includes(s.classId))
    const sessionIds = classSessions.map((s) => s.id)
    reports = reports.filter((r) => sessionIds.includes(r.sessionId))
  }

  return reports
}

export async function getStudentsNeedingAttention(role: Role, centerId?: string) {
  let students = mockStudents.filter((s) => s.riskLevel === "Yellow" || s.riskLevel === "Red")

  if (centerId) {
    // Filter by center
    const centerClasses = mockClasses.filter((c) => c.centerId === centerId)
    const classIds = centerClasses.map((c) => c.id)
    const centerEnrollments = mockEnrollments.filter((e) => classIds.includes(e.classId))
    const studentIds = centerEnrollments.map((e) => e.studentId)
    students = students.filter((s) => studentIds.includes(s.id))
  }

  return students
}

export async function getCenterHeatmap(userId?: string) {
  let centersToProcess = mockCenters

  // Filter centers for ASA role
  if (userId) {
    const user = mockUsers.find((u) => u.id === userId)
    if (user?.role === "ASA" && user.assignedCenterIds) {
      centersToProcess = mockCenters.filter((c) => user.assignedCenterIds?.includes(c.id))
    }
  }

  // Calculate risk distribution by center
  return centersToProcess.map((center) => {
    const centerClasses = mockClasses.filter((c) => c.centerId === center.id)
    const riskCounts = {
      Green: centerClasses.filter((c) => c.riskLevel === "Green").length,
      Yellow: centerClasses.filter((c) => c.riskLevel === "Yellow").length,
      Red: centerClasses.filter((c) => c.riskLevel === "Red").length,
    }

    return {
      center,
      ...riskCounts,
      total: centerClasses.length,
    }
  })
}

export async function getOverdueSpecialRequests(userId?: string) {
  let overdueRequests = mockSpecialRequests.filter((r) => r.slaStatus === "Overdue" && r.status !== "Resolved")

  // Filter by assigned centers for ASA role
  if (userId) {
    const user = mockUsers.find((u) => u.id === userId)
    if (user?.role === "ASA" && user.assignedCenterIds) {
      const centerClasses = mockClasses.filter((c) => user.assignedCenterIds?.includes(c.centerId))
      const classIds = centerClasses.map((c) => c.id)
      overdueRequests = overdueRequests.filter((r) => classIds.includes(r.classId))
    }
  }

  return overdueRequests
}

export async function calculateStudentRisk(studentId: string) {
  // Get all attendance records for this student
  const studentEnrollments = mockEnrollments.filter((e) => e.studentId === studentId && e.status === "Active")
  const classIds = studentEnrollments.map((e) => e.classId)

  // Calculate attendance rate
  const allAttendance = mockAttendance.filter((a) => a.studentId === studentId)
  const presentCount = allAttendance.filter((a) => a.status === "Present").length
  const attendanceRate = allAttendance.length > 0 ? (presentCount / allAttendance.length) * 100 : 100

  // Count negative notes
  const negativeNotes = mockStudentNotes.filter((n) => n.studentId === studentId && n.noteType === "NeedsImprovement")

  // Count overdue requests related to this student
  const overdueRequests = mockSpecialRequests.filter(
    (r) => r.studentId === studentId && r.slaStatus === "Overdue" && r.status !== "Resolved",
  )

  return calculateRiskScore({
    attendanceRate,
    negativeNoteCount: negativeNotes.length,
    overdueRequestCount: overdueRequests.length,
  })
}

export async function saveClassReport(report: (typeof mockClassReports)[0]) {
  console.log(`[v0] Saving class report for session ${report.sessionId}`)

  if (!report.id) {
    // Generate ID based on session if not provided
    const session = mockSessions.find((s) => s.id === report.sessionId)
    if (session) {
      report.id = `rpt-${session.classId}-${session.sessionNumber}`
    } else {
      report.id = `rpt-${report.sessionId}`
    }
    console.log(`[v0] Generated report ID: ${report.id}`)
  }

  const existingIndex = reportsData.findIndex((r) => r.sessionId === report.sessionId)
  if (existingIndex >= 0) {
    reportsData[existingIndex] = report
    console.log(`[v0] Updated existing class report with ID: ${report.id}`)
  } else {
    reportsData.push(report)
    console.log(`[v0] Created new class report with ID: ${report.id}`)
  }

  saveToStorage(STORAGE_KEYS.REPORTS, reportsData)
  return report
}

export async function getAllClassReports() {
  const freshReports = loadFromStorage(STORAGE_KEYS.REPORTS, mockClassReports)
  console.log(`[v0] Getting all class reports from storage, count: ${freshReports.length}`)
  return freshReports
}

export async function getClassReportById(reportId: string) {
  const reports = loadFromStorage(STORAGE_KEYS.REPORTS, mockClassReports)
  console.log(`[v0] Looking for report ${reportId} in ${reports.length} total reports`)

  let report = reports.find((r) => r.id === reportId)

  if (!report) {
    console.log(`[v0] Report not found by ID, trying sessionId`)
    report = reports.find((r) => r.sessionId === reportId)
  }

  console.log(`[v0] Report found:`, report ? `Yes (${report.id})` : "No")
  return report
}

export async function getAllUsers() {
  return mockUsers
}

export async function updateUser(userId: string, updates: Partial<UserType>) {
  const userIndex = mockUsers.findIndex((u) => u.id === userId)
  if (userIndex >= 0) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates }
    console.log(`[v0] Updated user ${userId}`)
    return mockUsers[userIndex]
  }
  return null
}

export async function getSystemConfig() {
  if (typeof window === "undefined") return mockSystemConfig
  try {
    const stored = localStorage.getItem("vus_system_config")
    return stored ? JSON.parse(stored) : mockSystemConfig
  } catch (e) {
    console.error(`[v0] Error loading system config:`, e)
    return mockSystemConfig
  }
}

export async function saveSystemConfig(config: typeof mockSystemConfig) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem("vus_system_config", JSON.stringify(config))
    console.log(`[v0] Saved system config`)
  } catch (e) {
    console.error(`[v0] Error saving system config:`, e)
  }
}
