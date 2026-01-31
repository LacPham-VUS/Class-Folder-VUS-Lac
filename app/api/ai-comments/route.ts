import type { NextRequest } from "next/server"

interface StudentData {
  id: string
  fullName: string
  attendanceRate?: number
  skillsBreakdown?: {
    speaking: number
    listening: number
    reading: number
    writing: number
  }
  recentNotes?: Array<{ type: string; content: string }>
  riskLevel?: string
}

function getWeakestSkill(skills?: { speaking: number; listening: number; reading: number; writing: number }) {
  if (!skills) return "N/A"
  const entries = Object.entries(skills) as [string, number][]
  const sorted = entries.sort((a, b) => a[1] - b[1])
  return sorted[0][0]
}

export async function POST(req: NextRequest) {
  try {
    const { studentData, type } = (await req.json()) as { studentData: StudentData; type: "positive" | "improvement" }

    console.log("[v0] AI Comment API called for type:", type, "student:", studentData?.fullName)

    const mockSuggestions =
      type === "positive"
        ? [
            `Em ${studentData.fullName} rất tích cực tham gia các hoạt động nhóm và nhiệt tình giúp đỡ bạn. Em thể hiện sự tiến bộ rõ rệt trong kỹ năng giao tiếp tiếng Anh.`,
            `Em thể hiện khả năng speaking tốt với phát âm rõ ràng và tự tin khi trình bày trước lớp. Em luôn hoàn thành bài tập đầy đủ và đúng hạn.`,
            `Em có thái độ học tập nghiêm túc và tỉ mỉ trong việc ghi chép. Em thường xuyên đặt câu hỏi để hiểu sâu hơn về bài học, thể hiện sự ham học hỏi đáng khen.`,
          ]
        : [
            `Em ${studentData.fullName} cần chú ý hơn đến việc tập trung trong lớp, đặc biệt là khi làm bài tập nhóm. Cô khuyên em nên đặt mục tiêu hoàn thành homework trước deadline.`,
            `Em nên luyện tập thêm phát âm các từ có âm cuối và intonation trong câu hỏi. Cô đề xuất em dành 10 phút mỗi ngày để luyện nghe podcast tiếng Anh.`,
          ]

    return Response.json({ success: true, suggestions: mockSuggestions })

    // When ready with API key, uncomment below and remove mock return above:
    /*
    let prompt: string
    if (type === 'positive') {
      prompt = `Bạn là một giáo viên tiếng Anh tại VUS (Vietnam-USA Society). Hãy tạo 3 gợi ý nhận xét cho học viên sau:

Tên học viên: ${studentData.fullName}
Tỷ lệ tham gia: ${studentData.attendanceRate || 'N/A'}%
Kỹ năng hiện tại:
- Speaking: ${studentData.skillsBreakdown?.speaking || 'N/A'}/5
- Listening: ${studentData.skillsBreakdown?.listening || 'N/A'}/5
- Reading: ${studentData.skillsBreakdown?.reading || 'N/A'}/5
- Writing: ${studentData.skillsBreakdown?.writing || 'N/A'}/5

Yêu cầu:
1. Viết 3 nhận xét TÍCH CỰC bằng tiếng Việt
2. Mỗi nhận xét khoảng 30-40 từ
3. Tone: Ấm áp, khuyến khích, professional
4. Focus vào điểm mạnh và tiến bộ cụ thể
5. Theo phong cách VUS: F.A.S.T (Frequent, Accurate, Specific, Timely)

Trả về JSON với format: {"suggestions": ["comment1", "comment2", "comment3"]}`
    } else {
      prompt = `Bạn là một giáo viên tiếng Anh tại VUS. Hãy tạo 2 gợi ý về điểm cần cải thiện cho học viên:

Tên học viên: ${studentData.fullName}
Risk Level: ${studentData.riskLevel || 'Normal'}
Kỹ năng yếu nhất: ${getWeakestSkill(studentData.skillsBreakdown)}

Yêu cầu:
1. Viết 2 gợi ý CẢI THIỆN bằng tiếng Việt
2. Mỗi gợi ý khoảng 25-35 từ
3. Tone: Constructive, supportive (không harsh)
4. Sử dụng S.B.I framework (Situation-Behavior-Impact)
5. Kết thúc với action item cụ thể

Trả về JSON với format: {"suggestions": ["suggestion1", "suggestion2"]}`
    }

    const { text } = await generateText({
      model: 'openai/gpt-4o-mini',
      prompt: prompt,
      temperature: type === 'positive' ? 0.7 : 0.6,
      maxTokens: type === 'positive' ? 500 : 400,
    })

    const parsed = JSON.parse(text)
    console.log('[v0] AI result success, suggestions count:', parsed.suggestions?.length || 0)

    return Response.json({
      success: true,
      suggestions: parsed.suggestions || [],
    })
    */
  } catch (error) {
    console.error("[v0] AI API Error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        suggestions: [],
      },
      { status: 500 },
    )
  }
}
