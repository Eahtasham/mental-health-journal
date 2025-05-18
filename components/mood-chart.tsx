"use client"

import { useMemo } from "react"
import { format, parseISO, subDays } from "date-fns"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"
import { Card } from "@/components/ui/card"
import type { JournalEntry, AssessmentEntry } from "@/components/dashboard"

interface MoodChartProps {
  journalEntries?: JournalEntry[]
  assessmentEntries?: AssessmentEntry[]
  dataKeys?: string[]
  colors?: string[]
  labels?: string[]
  isAssessment?: boolean
}

export function MoodChart({
  journalEntries = [],
  assessmentEntries = [],
  dataKeys = ["morningMood", "eveningMood"],
  colors = ["#3b82f6", "#f97316"],
  labels = ["Morning", "Evening"],
  isAssessment = false,
}: MoodChartProps) {
  const data = useMemo(() => {
    if (isAssessment && assessmentEntries.length > 0) {
      // Group assessment entries by date and type
      const groupedData: Record<string, Record<string, any>> = {}

      // Initialize with last 7 days
      const today = new Date()
      for (let i = 6; i >= 0; i--) {
        const date = format(subDays(today, i), "yyyy-MM-dd")
        groupedData[date] = {
          date,
          lowMood: 0,
          anxiety: 0,
          depression: 0,
        }
      }

      // Fill with actual data
      assessmentEntries.forEach((entry) => {
        if (groupedData[entry.date]) {
          groupedData[entry.date][entry.type] = entry.score
        } else {
          groupedData[entry.date] = {
            date: entry.date,
            lowMood: entry.type === "lowMood" ? entry.score : 0,
            anxiety: entry.type === "anxiety" ? entry.score : 0,
            depression: entry.type === "depression" ? entry.score : 0,
          }
        }
      })

      return Object.values(groupedData).sort((a, b) => String(a.date).localeCompare(String(b.date)))
    } else if (journalEntries.length > 0) {
      // Process journal entries
      const groupedData: Record<string, any> = {}

      // Initialize with last 7 days
      const today = new Date()
      for (let i = 6; i >= 0; i--) {
        const date = format(subDays(today, i), "yyyy-MM-dd")
        const entry: Record<string, any> = { date }
        dataKeys.forEach((key) => {
          entry[key] = 0
        })
        groupedData[date] = entry
      }

      // Fill with actual data
      journalEntries.forEach((entry) => {
        if (groupedData[entry.date]) {
          dataKeys.forEach((key) => {
            if ((entry as Record<string, any>)[key] !== undefined) {
                groupedData[entry.date][key] = (entry as Record<string, any>)[key]
            }
          })
        } else {
          const newEntry: Record<string, any> = { date: entry.date }
          dataKeys.forEach((key) => {
            newEntry[key] = (entry as Record<string, any>)[key] !== undefined ? (entry as Record<string, any>)[key] : 0
          })
          groupedData[entry.date] = newEntry
        }
      })

      return Object.values(groupedData).sort((a, b) => a.date.localeCompare(b.date))
    }

    return []
  }, [journalEntries, assessmentEntries, dataKeys, isAssessment])

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "MMM d")
    } catch (e) {
      return dateStr
    }
  }

  const getLabelForValue = (dataKey: string, value: number) => {
    if (dataKey === "morningMood" || dataKey === "eveningMood") {
      if (value === 1) return "Very Sad"
      if (value === 2) return "Sad"
      if (value === 3) return "Neutral"
      if (value === 4) return "Happy"
      if (value === 5) return "Very Happy"
    }

    if (dataKey === "stressLevel") {
      return `Stress Level: ${value}/10`
    }

    if (dataKey === "energyLevel") {
      if (value === 1) return "Energy: Very Low"
      if (value === 2) return "Energy: Low"
      if (value === 3) return "Energy: Medium"
      if (value === 4) return "Energy: High"
      if (value === 5) return "Energy: Very High"
    }

    if (dataKey === "lowMood" || dataKey === "anxiety" || dataKey === "depression") {
      const type = dataKey.charAt(0).toUpperCase() + dataKey.slice(1)
      return `${type} Score: ${value}/10`
    }

    return `${value}`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3 bg-background border shadow-sm">
          <p className="font-medium">{formatDate(label)}</p>
          <div className="mt-2 space-y-1">
            {payload.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-muted-foreground">{labels[index]}:</span>
                <span className="text-sm font-medium">{getLabelForValue(item.dataKey, item.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      )
    }
    return null
  }

  // If there's no data, return null or a placeholder
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={[0, 10]}
          ticks={[0, 2, 4, 6, 8, 10]}
        />
        <Tooltip content={<CustomTooltip />} />
        {isAssessment ? (
          <>
            <Line
              type="monotone"
              dataKey="lowMood"
              stroke={colors[0]}
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="anxiety"
              stroke={colors[1]}
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="depression"
              stroke={colors[2]}
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 4 }}
            />
          </>
        ) : (
          dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 4 }}
            />
          ))
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
