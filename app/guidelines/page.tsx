"use client"

import { useEffect, useState } from "react"
import { getGuidelines } from "@/lib/data-access"
import type { Guideline } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, FileText, MessageSquare, Award, Users, Info } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GuidelineContentRenderer } from "@/components/guideline-content-renderer"

export default function GuidelinesPage() {
  const [guidelines, setGuidelines] = useState<Guideline[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadGuidelines() {
      const data = await getGuidelines()
      setGuidelines(data)
      setLoading(false)
    }
    loadGuidelines()
  }, [])

  const filteredGuidelines = guidelines.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.titleVN.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getSectionIcon = (section: string) => {
    switch (section) {
      case "4.1":
        return FileText
      case "4.2":
        return MessageSquare
      case "4.3":
        return Award
      case "4.4":
        return Users
      default:
        return BookOpen
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-96 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-3 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">VUS Guidelines Hub</h1>
          <p className="mt-1 md:mt-2 text-sm md:text-base text-muted-foreground">
            Trung tâm hướng dẫn - Quick reference for classroom procedures and best practices
          </p>
        </div>

        <div className="mb-4 md:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search guidelines... / Tìm kiếm hướng dẫn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4 md:space-y-6">
          <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
            <TabsList className="inline-flex w-max md:w-auto">
              <TabsTrigger value="all" className="text-xs md:text-sm whitespace-nowrap">All Guidelines</TabsTrigger>
              <TabsTrigger value="4.1" className="text-xs md:text-sm whitespace-nowrap">Class Reports</TabsTrigger>
              <TabsTrigger value="4.2" className="text-xs md:text-sm whitespace-nowrap">Classroom English</TabsTrigger>
              <TabsTrigger value="4.3" className="text-xs md:text-sm whitespace-nowrap">Feedback</TabsTrigger>
              <TabsTrigger value="4.4" className="text-xs md:text-sm whitespace-nowrap">New Students</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-4">
            {filteredGuidelines.map((guideline) => {
              const Icon = getSectionIcon(guideline.section)
              return (
                <Card key={guideline.id}>
                  <CardHeader className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                          <Icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base md:text-xl">{guideline.title}</CardTitle>
                          <CardDescription className="mt-1 text-sm">{guideline.titleVN}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="w-fit text-xs">Section {guideline.section}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                    <Tabs defaultValue="en" className="w-full">
                      <TabsList>
                        <TabsTrigger value="en" className="text-xs md:text-sm">English</TabsTrigger>
                        <TabsTrigger value="vn" className="text-xs md:text-sm">Tiếng Việt</TabsTrigger>
                      </TabsList>
                      <TabsContent value="en">
                        <ScrollArea className="h-[300px] md:h-[400px] w-full rounded-md border p-3 md:p-4">
                          <GuidelineContentRenderer content={guideline.content} />
                          {guideline.examples && guideline.examples.length > 0 && (
                            <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
                              <h4 className="mb-3 flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-100">
                                <Info className="h-4 w-4" />
                                Examples
                              </h4>
                              <ul className="space-y-2">
                                {guideline.examples.map((example, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm">
                                    <span className="mt-1 text-blue-600 dark:text-blue-400">→</span>
                                    <span className="text-blue-800 dark:text-blue-200">{example}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </ScrollArea>
                      </TabsContent>
                      <TabsContent value="vn">
                        <ScrollArea className="h-[300px] md:h-[400px] w-full rounded-md border p-3 md:p-4">
                          <GuidelineContentRenderer content={guideline.contentVN} />
                          {guideline.examples && guideline.examples.length > 0 && (
                            <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
                              <h4 className="mb-3 flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-100">
                                <Info className="h-4 w-4" />
                                Ví dụ
                              </h4>
                              <ul className="space-y-2">
                                {guideline.examples.map((example, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm">
                                    <span className="mt-1 text-blue-600 dark:text-blue-400">→</span>
                                    <span className="text-blue-800 dark:text-blue-200">{example}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          {["4.1", "4.2", "4.3", "4.4"].map((section) => (
            <TabsContent key={section} value={section} className="space-y-4">
              {filteredGuidelines
                .filter((g) => g.section === section)
                .map((guideline) => {
                  const Icon = getSectionIcon(guideline.section)
                  return (
                    <Card key={guideline.id}>
                      <CardHeader className="p-4 md:p-6">
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                            <Icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base md:text-xl">{guideline.title}</CardTitle>
                            <CardDescription className="mt-1 text-sm">{guideline.titleVN}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                        <Tabs defaultValue="en" className="w-full">
                          <TabsList>
                            <TabsTrigger value="en" className="text-xs md:text-sm">English</TabsTrigger>
                            <TabsTrigger value="vn" className="text-xs md:text-sm">Tiếng Việt</TabsTrigger>
                          </TabsList>
                          <TabsContent value="en">
                            <ScrollArea className="h-[300px] md:h-[400px] w-full rounded-md border p-3 md:p-4">
                              <GuidelineContentRenderer content={guideline.content} />
                              {guideline.examples && guideline.examples.length > 0 && (
                                <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
                                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-100">
                                    <Info className="h-4 w-4" />
                                    Examples
                                  </h4>
                                  <ul className="space-y-2">
                                    {guideline.examples.map((example, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-sm">
                                        <span className="mt-1 text-blue-600 dark:text-blue-400">→</span>
                                        <span className="text-blue-800 dark:text-blue-200">{example}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </ScrollArea>
                          </TabsContent>
                          <TabsContent value="vn">
                            <ScrollArea className="h-[300px] md:h-[400px] w-full rounded-md border p-3 md:p-4">
                              <GuidelineContentRenderer content={guideline.contentVN} />
                              {guideline.examples && guideline.examples.length > 0 && (
                                <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
                                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-100">
                                    <Info className="h-4 w-4" />
                                    Ví dụ
                                  </h4>
                                  <ul className="space-y-2">
                                    {guideline.examples.map((example, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-sm">
                                        <span className="mt-1 text-blue-600 dark:text-blue-400">→</span>
                                        <span className="text-blue-800 dark:text-blue-200">{example}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </ScrollArea>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  )
                })}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
