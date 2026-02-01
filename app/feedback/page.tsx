"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MessageSquare, Star } from "lucide-react"

export default function FeedbackPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Mock data - replace with actual data fetching
  const feedbackList: any[] = []

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t("feedback.title")}</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {t("feedback.manageAllFeedback") || "Manage and view all feedback"}
          </p>
        </div>
        <Button className="w-fit">
          <Plus className="mr-2 h-4 w-4" />
          {t("feedback.addFeedback")}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col gap-3 md:gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("feedback.searchPlaceholder") || "Search feedback..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 md:flex md:gap-4">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder={t("feedback.category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.all")}</SelectItem>
                  <SelectItem value="general">{t("feedback.general")}</SelectItem>
                  <SelectItem value="technical">{t("feedback.technical")}</SelectItem>
                  <SelectItem value="suggestion">{t("feedback.suggestion")}</SelectItem>
                  <SelectItem value="complaint">{t("feedback.complaint")}</SelectItem>
                  <SelectItem value="praise">{t("feedback.praise")}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-36">
                  <SelectValue placeholder={t("feedback.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.all")}</SelectItem>
                  <SelectItem value="pending">{t("feedback.pending")}</SelectItem>
                  <SelectItem value="reviewed">{t("feedback.reviewed")}</SelectItem>
                  <SelectItem value="resolved">{t("feedback.resolved")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      {feedbackList.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground opacity-50" />
            <p className="text-lg font-medium">{t("feedback.noFeedback")}</p>
            <p className="text-sm text-muted-foreground">
              {t("feedback.clickToAdd") || "Click \"Add Feedback\" to create your first feedback"}
            </p>
            <Button className="mt-4" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              {t("feedback.addFeedback")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:gap-4">
          {feedbackList.map((feedback: any) => (
            <Card key={feedback.id} className="transition-all hover:border-primary hover:shadow-md">
              <CardHeader className="p-4 md:p-6">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{feedback.category}</Badge>
                      <Badge 
                        variant={
                          feedback.status === "resolved" 
                            ? "default" 
                            : feedback.status === "reviewed"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {feedback.status}
                      </Badge>
                      {feedback.rating && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < feedback.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-base md:text-lg">{feedback.subject}</CardTitle>
                    <CardDescription className="mt-1">{feedback.message}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {t("feedback.submittedBy")}: {feedback.submittedBy}
                  </span>
                  <span>{feedback.submittedAt}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
