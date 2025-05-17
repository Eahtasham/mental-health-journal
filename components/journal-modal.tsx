"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  SmilePlus,
  Smile,
  Meh,
  Frown,
  FolderOpenIcon as FrownOpen,
  Zap,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Battery,
  CalendarIcon,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { JournalEntry } from "@/components/dashboard"
import { SuccessAnimation } from "@/components/success-animation"

interface JournalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (entry: JournalEntry) => void
}

export function JournalModal({ open, onOpenChange, onSave }: JournalModalProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [morningMood, setMorningMood] = useState<number>(3)
  const [eveningMood, setEveningMood] = useState<number>(3)
  const [stressLevel, setStressLevel] = useState<number>(5)
  const [energyLevel, setEnergyLevel] = useState<number>(3)
  const [gratitude, setGratitude] = useState<string>("")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = () => {
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: format(date, "yyyy-MM-dd"),
      morningMood,
      eveningMood,
      stressLevel,
      energyLevel,
      gratitude,
    }

    onSave(entry)
    setShowSuccess(true)
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setDate(new Date())
    setMorningMood(3)
    setEveningMood(3)
    setStressLevel(5)
    setEnergyLevel(3)
    setGratitude("")
  }

  const moodIcons = [
    { icon: FrownOpen, label: "Very Sad", color: "text-red-500" },
    { icon: Frown, label: "Sad", color: "text-orange-500" },
    { icon: Meh, label: "Neutral", color: "text-yellow-500" },
    { icon: Smile, label: "Happy", color: "text-green-500" },
    { icon: SmilePlus, label: "Very Happy", color: "text-emerald-500" },
  ]

  const energyIcons = [
    { icon: BatteryLow, label: "Very Low", color: "text-red-500" },
    { icon: Battery, label: "Low", color: "text-orange-500" },
    { icon: BatteryMedium, label: "Medium", color: "text-yellow-500" },
    { icon: BatteryMedium, label: "High", color: "text-green-500" },
    { icon: BatteryFull, label: "Very High", color: "text-emerald-500" },
  ]

  return (
    <>
      <Dialog open={open && !showSuccess} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto gradient-modal">
          <DialogHeader>
            <DialogTitle>Daily Quick Journal</DialogTitle>
            <DialogDescription>Record how you're feeling today and track your mental wellbeing.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Date Selector */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Date & Day</CardTitle>
                <CardDescription>Select the date for this journal entry</CardDescription>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(date, "EEEE, MMMM d, yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                  </PopoverContent>
                </Popover>

                <div className="flex justify-between mt-4">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                        i === date.getDay() ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mood Selector */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">How I Felt Today</CardTitle>
                <CardDescription>Select your mood for morning and evening</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="font-medium">Morning</div>
                    <div className="grid grid-cols-5 gap-1 sm:flex sm:justify-between">
                      {moodIcons.map((mood, index) => {
                        const Icon = mood.icon
                        return (
                          <div key={index} className="flex flex-col items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-10 w-10 sm:h-14 sm:w-14 rounded-full",
                                morningMood === index + 1 && "bg-primary/10",
                                mood.color,
                              )}
                              onClick={() => setMorningMood(index + 1)}
                            >
                              <Icon
                                className={cn(
                                  "h-5 w-5 sm:h-8 sm:w-8",
                                  morningMood === index + 1 ? mood.color : "text-muted-foreground",
                                )}
                              />
                            </Button>
                            <span className="text-xs text-muted-foreground">{mood.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-medium">Evening</div>
                    <div className="grid grid-cols-5 gap-1 sm:flex sm:justify-between">
                      {moodIcons.map((mood, index) => {
                        const Icon = mood.icon
                        return (
                          <div key={index} className="flex flex-col items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-10 w-10 sm:h-14 sm:w-14 rounded-full",
                                eveningMood === index + 1 && "bg-primary/10",
                                mood.color,
                              )}
                              onClick={() => setEveningMood(index + 1)}
                            >
                              <Icon
                                className={cn(
                                  "h-5 w-5 sm:h-8 sm:w-8",
                                  eveningMood === index + 1 ? mood.color : "text-muted-foreground",
                                )}
                              />
                            </Button>
                            <span className="text-xs text-muted-foreground">{mood.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stress Level */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Stress Level</CardTitle>
                <CardDescription>Rate your stress level today (1-10)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-1 sm:grid-cols-10 sm:gap-0 sm:flex sm:justify-between">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => {
                    const color = level <= 3 ? "text-green-500" : level <= 6 ? "text-yellow-500" : "text-red-500"

                    const bgColor =
                      level <= 3
                        ? "bg-green-100 dark:bg-green-900"
                        : level <= 6
                          ? "bg-yellow-100 dark:bg-yellow-900"
                          : "bg-red-100 dark:bg-red-900"

                    return (
                      <div key={level} className="flex flex-col items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className={cn("h-8 w-8 sm:h-12 sm:w-12 rounded-full", stressLevel === level && bgColor)}
                          onClick={() => setStressLevel(level)}
                        >
                          <Zap className={cn("h-4 w-4 sm:h-6 sm:w-6", stressLevel === level ? color : "text-muted-foreground")} />
                        </Button>
                        <span className="text-xs font-medium">{level}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </CardContent>
            </Card>

            {/* Energy Level */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Energy Level</CardTitle>
                <CardDescription>How was your energy today?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-1 sm:flex sm:justify-between">
                  {energyIcons.map((energy, index) => {
                    const Icon = energy.icon
                    return (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-10 w-10 sm:h-14 sm:w-14 rounded-full",
                            energyLevel === index + 1 && "bg-primary/10",
                            energy.color,
                          )}
                          onClick={() => setEnergyLevel(index + 1)}
                        >
                          <Icon
                            className={cn(
                              "h-5 w-5 sm:h-8 sm:w-8",
                              energyLevel === index + 1 ? energy.color : "text-muted-foreground",
                            )}
                          />
                        </Button>
                        <span className="text-xs text-muted-foreground">{energy.label}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Gratitude */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Today I Am Grateful For</CardTitle>
                <CardDescription>Write down something you're grateful for today</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="I'm grateful for..."
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="w-full sm:w-auto">
              Save Journal Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showSuccess && (
        <SuccessAnimation
          score={(morningMood + eveningMood + (11 - stressLevel) + energyLevel) / 4}
          maxScore={5}
          title="Journal Entry Saved"
          message={`Your journal entry for ${format(date, "MMMM d, yyyy")} has been saved. You can view your mood trends on the dashboard.`}
          onClose={handleSuccessClose}
        />
      )}
    </>
  )
}