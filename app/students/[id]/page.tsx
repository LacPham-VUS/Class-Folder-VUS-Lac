import { StudentDetailClient } from "./student-detail-client"

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Await params in Server Component before passing to Client Component
  const resolvedParams = await params
  return <StudentDetailClient studentId={resolvedParams.id} />
}
