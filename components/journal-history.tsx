"use client"

import React, { useState } from "react"
import { format, parseISO } from "date-fns"
import {
  Calendar,
  ChevronDown,
  SmilePlus,
  Smile,
  Meh,
  Frown,
  FolderOpenIcon as FrownOpen,
  Zap,
  BatteryLow,
  Battery,
  BatteryMedium,
  BatteryFull,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { JournalEntry } from "@/components/dashboard"
import { cn } from "@/lib/utils"

interface JournalHistoryProps {
  entries: JournalEntry[]
  showAll?: boolean
}

export function JournalHistory({ entries, showAll = false }: JournalHistoryProps) {
  const [expandedEntries, setExpandedEntries] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpandedEntries((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const getMoodIcon = (level: number) => {
    if (level === 1) return <FrownOpen className="h-5 w-5 text-red-500" />
    if (level === 2) return <Frown className="h-5 w-5 text-orange-500" />
    if (level === 3) return <Meh className="h-5 w-5 text-yellow-500" />
    if (level === 4) return <Smile className="h-5 w-5 text-green-500" />
    return <SmilePlus className="h-5 w-5 text-emerald-500" />
  }

  const getMoodLabel = (level: number) => {
    if (level === 1) return "Very Sad"
    if (level === 2) return "Sad"
    if (level === 3) return "Neutral"
    if (level === 4) return "Happy"
    return "Very Happy"
  }

  const getStressIcon = (level: number) => {
    const color = level <= 3 ? "text-green-500" : level <= 6 ? "text-yellow-500" : "text-red-500"

    return (
      <div className="flex items-center gap-1">
        <Zap className={cn("h-5 w-5", color)} />
        <span className={cn("text-xs font-medium", color)}>{level}/10</span>
      </div>
    )
  }

  const getEnergyIcon = (level: number) => {
    if (level === 1)
      return (
        <div className="flex items-center gap-1">
          <BatteryLow className="h-5 w-5 text-red-500" />
          <span className="text-xs font-medium text-red-500">Very Low</span>
        </div>
      )
    if (level === 2)
      return (
        <div className="flex items-center gap-1">
          <Battery className="h-5 w-5 text-orange-500" />
          <span className="text-xs font-medium text-orange-500">Low</span>
        </div>
      )
    if (level === 3)
      return (
        <div className="flex items-center gap-1">
          <BatteryMedium className="h-5 w-5 text-yellow-500" />
          <span className="text-xs font-medium text-yellow-500">Medium</span>
        </div>
      )
    if (level === 4)
      return (
        <div className="flex items-center gap-1">
          <BatteryMedium className="h-5 w-5 text-green-500" />
          <span className="text-xs font-medium text-green-500">High</span>
        </div>
      )
    return (
      <div className="flex items-center gap-1">
        <BatteryFull className="h-5 w-5 text-emerald-500" />
        <span className="text-xs font-medium text-emerald-500">Very High</span>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "EEEE, MMMM d, yyyy")
    } catch (e) {
      return dateStr
    }
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Morning Mood</TableHead>
            <TableHead>Evening Mood</TableHead>
            <TableHead>Stress</TableHead>
            <TableHead>Energy</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow key={100}>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No journal entries yet
              </TableCell>
            </TableRow>
          ) : (
            entries.slice(0, showAll ? undefined : 7).map((entry) => (
              <React.Fragment key={entry.id}>
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(entry.date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getMoodIcon(entry.morningMood)}
                      <span className="text-xs text-muted-foreground">{getMoodLabel(entry.morningMood)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getMoodIcon(entry.eveningMood)}
                      <span className="text-xs text-muted-foreground">{getMoodLabel(entry.eveningMood)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStressIcon(entry.stressLevel)}</TableCell>
                  <TableCell>{getEnergyIcon(entry.energyLevel)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toggleExpand(entry.id)}>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          expandedEntries[entry.id] && "rotate-180",
                        )}
                      />
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedEntries[entry.id] && (
                  <TableRow key={100} className="bg-muted/50">
                    <TableCell colSpan={6} className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Gratitude</h4>
                        <p className="text-sm text-muted-foreground">
                          {entry.gratitude || "No gratitude entry for this day."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
