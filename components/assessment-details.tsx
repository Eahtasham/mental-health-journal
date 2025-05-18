"use client"

import { format, parseISO } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AssessmentEntry } from "@/components/dashboard"

interface AssessmentDetailsProps {
  assessment: AssessmentEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssessmentDetails({ assessment, open, onOpenChange }: AssessmentDetailsProps) {
  if (!assessment) return null

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "EEEE, MMMM d, yyyy")
    } catch (e) {
      return dateStr
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "lowMood":
        return "Low Mood Assessment"
      case "anxiety":
        return "Anxiety Assessment"
      case "depression":
        return "Depression Assessment"
      default:
        return "Assessment"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "lowMood":
        return "bg-blue-500"
      case "anxiety":
        return "bg-amber-500"
      case "depression":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getScoreColor = (score: number) => {
    if (score <= 3) return "text-green-500"
    if (score <= 6) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] gradient-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getTypeColor(assessment.type)}`}></div>
            {getTypeLabel(assessment.type)}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">{formatDate(assessment.date)}</div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Score:</span>
              <span className={`font-bold text-lg ${getScoreColor(assessment.score)}`}>{assessment.score}/10</span>
            </div>
          </div>

          {assessment.triggers && assessment.triggers.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Triggers</h4>
                <div className="flex flex-wrap gap-2">
                  {assessment.triggers.map((trigger, i) => (
                    <Badge key={i} variant="outline">
                      {trigger}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {assessment.behaviors && assessment.behaviors.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Behaviors</h4>
                <div className="flex flex-wrap gap-2">
                  {assessment.behaviors.map((behavior, i) => (
                    <Badge key={i} variant="outline">
                      {behavior}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {assessment.thoughts && assessment.thoughts.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Thoughts</h4>
                <ul className="list-disc list-inside space-y-1">
                  {assessment.thoughts.map((thought, i) => (
                    <li key={i} className="text-sm">
                      {thought}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {assessment.reflection && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Reflection</h4>
                <p className="text-sm">{assessment.reflection}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
