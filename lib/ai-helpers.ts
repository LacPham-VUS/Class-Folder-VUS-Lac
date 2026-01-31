import type { StudentNote } from "./types"

// AI Helper Functions (Rule-based for demo purposes)

export function generateAutoSummary(notes: StudentNote[]): string[] {
  if (notes.length === 0) {
    return ["No student notes recorded for this session."]
  }

  const positiveNotes = notes.filter((n) => n.noteType === "Positive")
  const improvementNotes = notes.filter((n) => n.noteType === "NeedsImprovement")
  const sbiNotes = notes.filter((n) => n.noteType === "SBI")

  const bullets: string[] = []

  // Analyze overall sentiment
  if (positiveNotes.length > improvementNotes.length) {
    bullets.push(
      `Strong engagement observed with ${positiveNotes.length} positive interactions recorded across multiple students.`,
    )
  } else if (improvementNotes.length > positiveNotes.length) {
    bullets.push(
      `Several areas requiring attention identified, with ${improvementNotes.length} students needing additional support.`,
    )
  } else {
    bullets.push("Balanced session with mixed student performance across different activities.")
  }

  // Highlight common themes
  const allTags = notes.flatMap((n) => n.tags)
  const tagCounts = allTags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([tag]) => tag)

  if (topTags.length > 0) {
    bullets.push(`Key focus areas: ${topTags.join(", ")}.`)
  }

  // Actionable insights
  if (improvementNotes.length > 0) {
    bullets.push(
      `Follow-up required for ${improvementNotes.length} student${improvementNotes.length > 1 ? "s" : ""} showing challenges.`,
    )
  }

  return bullets.slice(0, 3) // Return max 3 bullets
}

export function suggestSBIRewrite(content: string): string {
  // Simple rule-based SBI suggestion
  const lowerContent = content.toLowerCase()

  // Check if already in SBI format
  if (lowerContent.includes("situation:") && lowerContent.includes("behavior:") && lowerContent.includes("impact:")) {
    return content // Already in SBI format
  }

  // Generate SBI template with hints
  return `Situation: [When did this happen? What was the context?]\n\nBehavior: [What specific actions did you observe?]\n\nImpact: [What was the result or effect?]\n\nYour original note: "${content}"`
}

export function calculateRiskScore(data: {
  attendanceRate: number
  negativeNoteCount: number
  overdueRequestCount: number
}): { score: number; level: "Green" | "Yellow" | "Red"; factors: string[] } {
  let score = 0
  const factors: string[] = []

  // Attendance factor (0-40 points)
  if (data.attendanceRate < 70) {
    score += 40
    factors.push(`Low attendance (${data.attendanceRate}%)`)
  } else if (data.attendanceRate < 85) {
    score += 20
    factors.push(`Below-average attendance (${data.attendanceRate}%)`)
  }

  // Negative notes factor (0-30 points)
  if (data.negativeNoteCount > 5) {
    score += 30
    factors.push(`Multiple concerns (${data.negativeNoteCount} negative notes)`)
  } else if (data.negativeNoteCount > 2) {
    score += 15
    factors.push(`Some concerns (${data.negativeNoteCount} negative notes)`)
  }

  // Overdue requests factor (0-30 points)
  if (data.overdueRequestCount > 2) {
    score += 30
    factors.push(`${data.overdueRequestCount} overdue special requests`)
  } else if (data.overdueRequestCount > 0) {
    score += 15
    factors.push(`${data.overdueRequestCount} overdue request`)
  }

  // Determine level
  let level: "Green" | "Yellow" | "Red" = "Green"
  if (score >= 50) {
    level = "Red"
  } else if (score >= 25) {
    level = "Yellow"
  }

  return { score, level, factors }
}

export function exportToPDF(data: any): void {
  // Stub for PDF export functionality
  console.log("[v0] PDF Export triggered for:", data)
  alert("PDF Export feature coming soon. Data logged to console.")
}
