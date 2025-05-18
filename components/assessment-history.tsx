"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { Activity, Brain, LineChart, ChevronDown, Info, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { AssessmentEntry } from "@/components/dashboard"
import { cn } from "@/lib/utils"
import { AssessmentDetails } from "@/components/assessment-details"

interface AssessmentHistoryProps {
  entries: AssessmentEntry[]
}

export function AssessmentHistory({ entries }: AssessmentHistoryProps) {
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentEntry | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "MMM d, yyyy")
    } catch (e) {
      return dateStr
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lowMood":
        return <Activity className="h-5 w-5 text-blue-500" />
      case "anxiety":
        return <LineChart className="h-5 w-5 text-amber-500" />
      case "depression":
        return <Brain className="h-5 w-5 text-purple-500" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "lowMood":
        return "Low Mood"
      case "anxiety":
        return "Anxiety"
      case "depression":
        return "Depression"
      default:
        return "Assessment"
    }
  }

  const getScoreColor = (score: number) => {
    if (score <= 3) return "text-green-500"
    if (score <= 6) return "text-amber-500"
    return "text-red-500"
  }

  const handleRowClick = (assessment: AssessmentEntry) => {
    setSelectedAssessment(assessment)
    setDetailsOpen(true)
  }

  return (
    <>
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Triggers</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No assessment entries yet
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow
                  key={entry.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(entry)}
                >
                  <TableCell className="font-medium">{formatDate(entry.date)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(entry.type)}
                      <span>{getTypeLabel(entry.type)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn("font-medium", getScoreColor(entry.score))}>{entry.score}/10</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {entry.triggers && entry.triggers.length > 0 ? (
                        entry.triggers.slice(0, 2).map((trigger, i) => (
                          <Badge key={i} variant="outline" className="max-w-[100px] truncate">
                            {trigger}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                      {entry.triggers && entry.triggers.length > 2 && (
                        <Badge variant="outline">+{entry.triggers.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="float-right">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AssessmentDetails assessment={selectedAssessment} open={detailsOpen} onOpenChange={setDetailsOpen} />
    </>
  )
}
