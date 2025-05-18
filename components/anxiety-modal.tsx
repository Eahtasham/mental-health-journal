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
import { cn } from "@/lib/utils"
import { SuccessAnimation } from "@/components/success-animation"

interface AnxietyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (entry: AssessmentEntry) => void
}

const ANXIETY_QUESTIONS = [
  { id: "worry", question: "I worry a lot of the time." },
  { id: "decision", question: "I find difficulty to make a decision." },
  { id: "jumpy", question: "I often feel jumpy." },
  { id: "relax", question: "I find it hard to relax." },
  { id: "enjoy", question: "I often cannot enjoy things because of my worry." },
  { id: "bother", question: "Little things bother me a lot." },
  { id: "butterflies", question: "I often feel like I have butterflies in my stomach." },
  { id: "worrier", question: "I think of myself as a worrier." },
  { id: "trivial", question: "I can't help worrying about even trivial things." },
  { id: "nervous", question: "I often feel nervous." },
  { id: "thoughts", question: "My own thoughts often make me anxious." },
  { id: "stomach", question: "I get an upset stomach due to my worrying." },
  { id: "nervous_person", question: "I think of myself as a nervous person." },
  { id: "anticipate", question: "I always anticipate the worst will happen." },
  { id: "shaky", question: "I often feel shaky inside." },
  { id: "interfere", question: "I think that my worries interfere with my life." },
  { id: "overwhelm", question: "My worries often overwhelm me." },
  { id: "knot", question: "I sometimes feel a great knot in my stomach." },
  { id: "miss_out", question: "I miss out on things because I worry too much." },
  { id: "upset", question: "I often feel upset." },
]

export function AnxietyModal({ open, onOpenChange, onSave }: AnxietyModalProps) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [reflection, setReflection] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  // Update the handleSubmit function to show score and AI message
  const handleSubmit = () => {
    // Calculate score (1 point for each "Agree")
    const totalPoints = Object.values(answers).filter(Boolean).length
    // Normalize to 1-10 scale
    const normalizedScore = Math.round((totalPoints / ANXIETY_QUESTIONS.length) * 9) + 1

    const thoughts = []
    for (const q of ANXIETY_QUESTIONS) {
      if (answers[q.id]) {
        thoughts.push(q.question)
      }
    }

    const entry: AssessmentEntry = {
      id: Date.now().toString(),
      date: format(new Date(), "yyyy-MM-dd"),
      type: "anxiety",
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

  const toggleAnswer = (questionId: string, value: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const isComplete = Object.keys(answers).length === ANXIETY_QUESTIONS.length

  // Calculate stats for success animation
  const getStats = () => {
    const agree = Object.values(answers).filter(Boolean).length
    const disagree = Object.values(answers).filter((val) => val === false).length
    const notAnswered = ANXIETY_QUESTIONS.length - agree - disagree

    return { agree, disagree, notAnswered }
  }

  return (
    <>
      <Dialog open={open && !showSuccess} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto gradient-modal">
          <DialogHeader>
            <DialogTitle>Anxiety Assessment</DialogTitle>
            <DialogDescription>Measure your anxiety levels and identify patterns.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Anxiety Questions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Please respond to each statement</CardTitle>
                <CardDescription>Select &quot;Agree&quot; or &quot;Disagree&quot; for each statement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {ANXIETY_QUESTIONS.map((q) => (
                    <div key={q.id} className="space-y-2">
                      <Label className="text-base">{q.question}</Label>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={answers[q.id] === true ? "default" : "outline"}
                          className={cn("flex-1", answers[q.id] === true && "bg-primary text-primary-foreground")}
                          onClick={() => toggleAnswer(q.id, true)}
                        >
                          Agree
                        </Button>
                        <Button
                          type="button"
                          variant={answers[q.id] === false ? "default" : "outline"}
                          className={cn("flex-1", answers[q.id] === false && "bg-primary text-primary-foreground")}
                          onClick={() => toggleAnswer(q.id, false)}
                        >
                          Disagree
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reflection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Coping Strategies</CardTitle>
                <CardDescription>What helps you manage your anxiety?</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Breathing exercises, talking to a friend, going for a walk..."
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
          score={Object.values(answers).filter(Boolean).length}
          maxScore={ANXIETY_QUESTIONS.length}
          title="Anxiety Assessment Saved"
          message="Your anxiety assessment has been saved. These results can be examined in the future using AI analysis."
          onClose={handleSuccessClose}
          stats={getStats()}
        />
      )}
    </>
  )
}
