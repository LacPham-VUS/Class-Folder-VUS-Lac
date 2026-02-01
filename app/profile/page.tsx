"use client"

import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase,
  GraduationCap,
  Award,
  BookOpen,
  Users,
  Edit,
  Settings
} from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export default function ProfilePage() {
  const { currentUser, currentRole } = useAuth()
  const { t } = useLanguage()
  const [coverImage, setCoverImage] = useState("/placeholder.jpg")
  const [avatarImage, setAvatarImage] = useState("/placeholder-user.jpg")

  if (!currentUser) {
    return null
  }

  // Mock data - replace with real data from API
  const profileData = {
    coverPhoto: coverImage,
    avatar: avatarImage,
    name: currentUser.name,
    role: currentRole,
    email: currentUser.email,
    phone: "+84 123 456 789",
    location: "VUS Lac Long Quan, District 11, HCMC",
    joinDate: "January 2024",
    bio: "Passionate educator committed to helping students achieve their full potential in English language learning.",
    stats: {
      classes: 12,
      students: 180,
      sessions: 240,
      rating: 4.8
    },
    recentActivity: [
      { id: 1, type: "class", description: "Completed Session 15 - Class YLE-S1-2425-001", date: "2 hours ago" },
      { id: 2, type: "report", description: "Submitted Class Report for Session 14", date: "1 day ago" },
      { id: 3, type: "photo", description: "Uploaded 15 photos to Class YLE-S1-2425-001", date: "2 days ago" },
    ],
    classes: [
      { id: 1, code: "YLE-S1-2425-001", program: "YLE", level: "Starters 1", students: 15 },
      { id: 2, code: "YLE-S2-2425-002", program: "YLE", level: "Starters 2", students: 12 },
    ]
  }

  const roleColors: Record<string, string> = {
    TA: "bg-blue-500",
    Teacher: "bg-green-500",
    ASA: "bg-purple-500",
    TQM: "bg-orange-500",
    SystemAdmin: "bg-red-500",
  }

  return (
    <div className="pb-8">
      {/* Cover Photo Section */}
      <div className="relative h-48 md:h-72 lg:h-80 bg-gradient-to-r from-primary/20 to-accent/20 rounded-b-xl overflow-hidden">
        <Image
          src={profileData.coverPhoto}
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Edit Cover Button */}
        <Button 
          variant="secondary" 
          size="sm" 
          className="absolute bottom-4 right-4 gap-2"
        >
          <Camera className="h-4 w-4" />
          {t("profile.editCover")}
        </Button>
      </div>

      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-end">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl">
              <AvatarImage src={avatarImage} alt={currentUser.name} />
              <AvatarFallback className="text-4xl">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button 
              size="icon" 
              variant="secondary" 
              className="absolute bottom-0 right-0 rounded-full h-10 w-10"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          {/* Name & Role */}
          <div className="flex-1 text-center md:text-left mb-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{profileData.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
              <Badge className={`${roleColors[profileData.role]} text-sm px-3 py-1`}>
                {profileData.role}
              </Badge>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{profileData.location}</span>
            </div>
            <p className="text-muted-foreground max-w-2xl">{profileData.bio}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              {t("profile.editProfile")}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{profileData.stats.classes}</div>
                <div className="text-xs text-muted-foreground">{t("profile.classes")}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{profileData.stats.students}</div>
                <div className="text-xs text-muted-foreground">{t("profile.students")}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <GraduationCap className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{profileData.stats.sessions}</div>
                <div className="text-xs text-muted-foreground">{t("profile.sessions")}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{profileData.stats.rating}</div>
                <div className="text-xs text-muted-foreground">{t("profile.rating")}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="about" className="mt-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="about">{t("profile.about")}</TabsTrigger>
            <TabsTrigger value="classes">{t("profile.myClasses")}</TabsTrigger>
            <TabsTrigger value="activity">{t("profile.activity")}</TabsTrigger>
            <TabsTrigger value="achievements">{t("profile.achievements")}</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("profile.contactInfo")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">{t("profile.email")}</div>
                      <div className="font-medium">{profileData.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">{t("profile.phone")}</div>
                      <div className="font-medium">{profileData.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">{t("profile.location")}</div>
                      <div className="font-medium">{profileData.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">{t("profile.joinedDate")}</div>
                      <div className="font-medium">{profileData.joinDate}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("profile.workInfo")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">{t("profile.position")}</div>
                      <div className="font-medium">{profileData.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">{t("profile.department")}</div>
                      <div className="font-medium">English Language Teaching</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("profile.myClasses")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profileData.classes.map((cls) => (
                    <div 
                      key={cls.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div>
                        <div className="font-medium">{cls.code}</div>
                        <div className="text-sm text-muted-foreground">
                          {cls.program} • {cls.level}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{cls.students} {t("profile.students")}</Badge>
                        <Button variant="ghost" size="sm">{t("common.view")}</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("profile.recentActivity")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profileData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("profile.achievements")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <Award className="h-12 w-12 text-yellow-500" />
                    <div>
                      <div className="font-medium">Top Performer 2024</div>
                      <div className="text-sm text-muted-foreground">Achieved excellence in teaching</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <Award className="h-12 w-12 text-blue-500" />
                    <div>
                      <div className="font-medium">100 Sessions Completed</div>
                      <div className="text-sm text-muted-foreground">Milestone achievement</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
