"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Users, Download, Send } from "lucide-react"

interface ProjectEvaluationViewProps {
  projectId: string
}

export function ProjectEvaluationView() {
  const [scores, setScores] = useState({
    innovation: 0,
    technical: 0,
    impact: 0,
    presentation: 0,
  })

  const [comments, setComments] = useState("")

  const maxScores = {
    innovation: 1.5,
    technical: 1.5,
    impact: 1.0,
    presentation: 1.0,
  }

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
  const maxTotalScore = Object.values(maxScores).reduce((sum, max) => sum + max, 0)

  const handleScoreChange = (criterion: keyof typeof scores, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    const maxValue = maxScores[criterion]
    setScores((prev) => ({
      ...prev,
      [criterion]: Math.min(Math.max(0, numValue), maxValue),
    }))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Project Details Card */}
      <Card className="border-border bg-card">
        <CardBody className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-balance">Smart Campus Navigation System</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                An AI-powered mobile app for indoor navigation across campus buildings
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Team members</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium text-muted-foreground"
                    >
                      U{i}
                    </div>
                  ))}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-card bg-muted text-sm font-medium text-muted-foreground">
                    +4
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Project poster</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center px-4">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Poster 1</p>
                  </div>
                </div>
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center px-4">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Poster 2</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Project poster</span>
              </div>
              <Button className="w-full justify-between bg-transparent" size="sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Document 1</span>
                </div>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Evaluation Form Card */}
      <Card className="border-border bg-card">
        <CardHeader>
          <p className="text-lg font-semibold">Project Evaluation</p>
          <p className="text-sm text-muted-foreground">Rate the project based on the criteria below</p>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Innovation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="innovation" className="text-sm font-medium">
                Innovation
              </Label>
              <span className="text-sm text-muted-foreground">/{maxScores.innovation}</span>
            </div>
            <Input
              id="innovation"
              type="number"
              step="0.1"
              min="0"
              max={maxScores.innovation}
              value={scores.innovation.toString()}
              onChange={(e) => handleScoreChange("innovation", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Originality and creativity of the solution.</p>
          </div>

          {/* Technical Implementation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="technical" className="text-sm font-medium">
                Technical Implementation
              </Label>
              <span className="text-sm text-muted-foreground">/{maxScores.technical}</span>
            </div>
            <Input
              id="technical"
              type="number"
              step="0.1"
              min="0"
              max={maxScores.technical}
              value={scores.technical.toString()}
              onChange={(e) => handleScoreChange("technical", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Quality of code, architecture, and technical execution.</p>
          </div>

          {/* Impact & Feasibility */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="impact" className="text-sm font-medium">
                Impact & feasibility
              </Label>
              <span className="text-sm text-muted-foreground">/{maxScores.impact}</span>
            </div>
            <Input
              id="impact"
              type="number"
              step="0.1"
              min="0"
              max={maxScores.impact}
              value={scores.impact.toString()}
              onChange={(e) => handleScoreChange("impact", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Real-world applicability and potential impact.</p>
          </div>

          {/* Presentation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="presentation" className="text-sm font-medium">
                Presentation
              </Label>
              <span className="text-sm text-muted-foreground">/{maxScores.presentation}</span>
            </div>
            <Input
              id="presentation"
              type="number"
              step="0.1"
              min="0"
              max={maxScores.presentation}
              value={scores.presentation.toString()}
              onChange={(e) => handleScoreChange("presentation", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Quality of documentation and presentation.</p>
          </div>

          {/* Total Score */}
          <div className="flex items-center justify-between rounded-lg p-4">
            <span className="font-semibold">Total score</span>
            <span className="text-2xl font-bold">
              {totalScore.toFixed(1)}/{maxTotalScore.toFixed(1)}
            </span>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments" className="text-sm font-medium">
              Comments and Feedback
            </Label>
            <Textarea
              id="comments"
              placeholder="Brief description of the course"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button className="w-full" size="lg">
            <Send className="mr-2 h-4 w-4" />
            Submit evaluation
          </Button>
        </CardBody>
      </Card>
    </div>
  )
}
