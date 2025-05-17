"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { AssessmentEntry } from "@/components/dashboard"
import { SuccessAnimation } from "@/components/success-animation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DepressionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (entry: AssessmentEntry) => void
}

const DEPRESSION_QUESTIONS = [
  {
    id: "interest",
    question: "Little interest or pleasure in doing things",
  },
  {
    id: "depressed",
    question: "Feeling down, depressed, or hopeless",
  },
  {
    id: "sleep",
    question: "Trouble falling or staying asleep, or sleeping too much",
  },
  {
    id: "tired",
    question: "Feeling tired or having little energy",
  },
  {
    id: "appetite",
    question: "Poor appetite or overeating",
  },
  {
    id: "failure",
    question: "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
  },
  {
    id: "concentrate",
    question: "Trouble concentrating on things, such as reading the newspaper or watching television",
  },
  {
    id: "moving",
    question:
      "Moving or speaking so slowly that other people could have noticed, or being so fidgety or restless that you have been moving around a lot more than usual",
  },
  {
    id: "thoughts",
    question: "Thoughts that you would be better off dead, or of hurting yourself",
  },
]

const FREQUENCY_OPTIONS = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Several days" },
  { value: "2", label: "More than half the days" },
  { value: "3", label: "Nearly every day" },
]

export function DepressionModal({ open, onOpenChange, onSave }: DepressionModalProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [reflection, setReflection] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = () => {
    // Calculate score (0-3 for each question)
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0)
    // Normalize to 1-10 scale
    const normalizedScore = Math.round((totalScore / (DEPRESSION_QUESTIONS.length * 3)) * 9) + 1

    const thoughts = []
    for (const q of DEPRESSION_QUESTIONS) {
      if (answers[q.id] >= 2) {
        // If moderate or severe
        thoughts.push(q.question)
      }
    }

    const entry: AssessmentEntry = {
      id: Date.now().toString(),
      date: format(new Date(), "yyyy-MM-dd"),
      type: "depression",
      score: normalizedScore,
      thoughts,
      reflection,
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
    setAnswers({})
    setReflection("")
  }

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const isComplete = Object.keys(answers).length === DEPRESSION_QUESTIONS.length

  // Calculate stats for success animation
  const getStats = () => {
    const answered = Object.keys(answers).length
    const notAnswered = DEPRESSION_QUESTIONS.length - answered

    // Count answers by severity
    const severeCount = Object.values(answers).filter((val) => val >= 2).length
    const mildCount = answered - severeCount

    return {
      agree: severeCount,
      disagree: mildCount,
      notAnswered,
    }
  }

  return (
    <>
      <Dialog open={open && !showSuccess} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto gradient-modal">
          <DialogHeader>
            <DialogTitle>Depression Assessment</DialogTitle>
            <DialogDescription>Measure your depression symptoms and track changes over time.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* PHQ-9 Questions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Over the last 2 weeks, how often have you been bothered by the following problems?
                </CardTitle>
                <CardDescription>Select a frequency for each item</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {DEPRESSION_QUESTIONS.map((q) => (
                    <div key={q.id} className="space-y-2">
                      <Label>{q.question}</Label>
                      <Select
                        value={answers[q.id]?.toString() || ""}
                        onValueChange={(value) => handleAnswerChange(q.id, Number.parseInt(value))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {FREQUENCY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reflection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Self-Care Plan</CardTitle>
                <CardDescription>What activities help improve your mood?</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Exercise, spending time with friends, creative activities..."
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="min-h-[80px]"
                />
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!isComplete}>
              Save Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showSuccess && (
        <SuccessAnimation
          score={
            Math.round(
              (Object.values(answers).reduce((sum, val) => sum + val, 0) / (DEPRESSION_QUESTIONS.length * 3)) * 9,
            ) + 1
          }
          maxScore={10}
          title="Depression Assessment Saved"
          message="Your depression assessment has been saved. These results can be examined in the future using AI analysis."
          onClose={handleSuccessClose}
          stats={getStats()}
        />
      )}
    </>
  )
}
