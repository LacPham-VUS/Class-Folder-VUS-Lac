"use client"

import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestLanguagePage() {
  const { t, language, setLanguage } = useLanguage()

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Language System Test</h1>
          <p className="text-muted-foreground">Test instant language switching</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={language === "vi" ? "default" : "outline"}
            onClick={() => setLanguage("vi")}
          >
            🇻🇳 Tiếng Việt
          </Button>
          <Button 
            variant={language === "en" ? "default" : "outline"}
            onClick={() => setLanguage("en")}
          >
            🇺🇸 English
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Language: <span className="text-primary">{language.toUpperCase()}</span></CardTitle>
          <CardDescription>All texts below should change instantly when you switch languages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Navigation</h3>
              <ul className="space-y-1 text-sm">
                <li>• {t("nav.dashboard")}</li>
                <li>• {t("nav.classes")}</li>
                <li>• {t("nav.students")}</li>
                <li>• {t("nav.sessions")}</li>
                <li>• {t("nav.reports")}</li>
                <li>• {t("nav.requests")}</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Common Actions</h3>
              <ul className="space-y-1 text-sm">
                <li>• {t("common.save")}</li>
                <li>• {t("common.cancel")}</li>
                <li>• {t("common.edit")}</li>
                <li>• {t("common.delete")}</li>
                <li>• {t("common.search")}</li>
                <li>• {t("common.filter")}</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Classes Section</h3>
            <p className="text-sm">{t("classes.title")}</p>
            <p className="text-sm">{t("classes.addClass")}</p>
            <p className="text-sm">{t("classes.className")}</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Students Section</h3>
            <p className="text-sm">{t("students.title")}</p>
            <p className="text-sm">{t("students.addStudent")}</p>
            <p className="text-sm">{t("students.studentName")}</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Photos Section</h3>
            <p className="text-sm">{t("photos.uploadPhoto")}</p>
            <p className="text-sm">{t("photos.classPhotos")}</p>
            <p className="text-sm">{t("photos.studentPhotos")}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">✅ Test Instructions</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-green-700 space-y-2">
          <p><strong>Expected Behavior:</strong></p>
          <ol className="list-decimal ml-4 space-y-1">
            <li>Click the 🇻🇳 or 🇺🇸 buttons above</li>
            <li>All text should change <strong>instantly</strong> without page refresh</li>
            <li>The sidebar navigation should also update</li>
            <li>Refresh the page - language preference should persist</li>
          </ol>
          <p className="mt-4"><strong>If switching doesn't work instantly:</strong></p>
          <ol className="list-decimal ml-4 space-y-1">
            <li>Check browser console for errors (F12)</li>
            <li>Verify LanguageProvider wraps the entire app in layout.tsx</li>
            <li>Ensure all components use useLanguage() hook correctly</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
