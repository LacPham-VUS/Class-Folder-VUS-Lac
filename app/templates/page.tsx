"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockCommentSnippets, defaultChecklistItems } from "@/lib/mock-data"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import type { CommentSnippet, ChecklistItem } from "@/lib/types"

export default function TemplatesPage() {
  const [snippets, setSnippets] = useState<CommentSnippet[]>(mockCommentSnippets)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(defaultChecklistItems)

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.textEN.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.textVN.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || snippet.category.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(snippets.map((s) => s.category.split(" - ")[0])))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates & Rubrics</h1>
          <p className="text-muted-foreground">Manage comment snippets, checklists, and report templates</p>
        </div>
      </div>

      <Tabs defaultValue="snippets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="snippets">Comment Snippets</TabsTrigger>
          <TabsTrigger value="checklists">Daily Checklists</TabsTrigger>
          <TabsTrigger value="report-fields">Report Templates</TabsTrigger>
        </TabsList>

        {/* Comment Snippets Tab */}
        <TabsContent value="snippets" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Snippet
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Comment Snippet</DialogTitle>
                  <DialogDescription>
                    Create a reusable comment template in both English and Vietnamese
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input placeholder="e.g., Positive - Participation" />
                  </div>
                  <div className="space-y-2">
                    <Label>English Text</Label>
                    <Textarea placeholder="Enter comment in English..." rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Vietnamese Text</Label>
                    <Textarea placeholder="Nhập nhận xét bằng tiếng Việt..." rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tags (comma-separated)</Label>
                    <Input placeholder="e.g., Engagement, Speaking" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Create Snippet</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>English</TableHead>
                  <TableHead>Vietnamese</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Usage</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSnippets.map((snippet) => (
                  <TableRow key={snippet.id}>
                    <TableCell className="font-medium">{snippet.category}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{snippet.textEN}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{snippet.textVN}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {snippet.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {snippet.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{snippet.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{snippet.usageCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSnippets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No snippets found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Daily Checklists Tab */}
        <TabsContent value="checklists" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Manage items that TAs check off during each session</p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Checklist Item
            </Button>
          </div>

          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>English Label</TableHead>
                  <TableHead>Vietnamese Label</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checklistItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.label}</TableCell>
                    <TableCell>{item.labelVN}</TableCell>
                    <TableCell>
                      {item.required ? <Badge>Required</Badge> : <Badge variant="secondary">Optional</Badge>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Report Templates Tab */}
        <TabsContent value="report-fields" className="space-y-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Configure which fields appear in session report forms</p>

            <div className="rounded-lg border bg-card p-6 space-y-4">
              <h3 className="font-semibold">Required Fields</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Session Summary</p>
                    <p className="text-sm text-muted-foreground">Brief overview of the session</p>
                  </div>
                  <Badge>Always Required</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Progress Update</p>
                    <p className="text-sm text-muted-foreground">What was covered and achieved</p>
                  </div>
                  <Badge>Always Required</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Daily Checklist</p>
                    <p className="text-sm text-muted-foreground">Required administrative tasks</p>
                  </div>
                  <Badge>Always Required</Badge>
                </div>
              </div>

              <h3 className="font-semibold pt-4">Optional Fields</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Areas for Improvement</p>
                    <p className="text-sm text-muted-foreground">Challenges or issues to address</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Disable
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Incidents/Concerns</p>
                    <p className="text-sm text-muted-foreground">Notable behavioral or academic issues</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Disable
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Next Session Actions</p>
                    <p className="text-sm text-muted-foreground">Planned follow-ups and preparations</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Disable
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
