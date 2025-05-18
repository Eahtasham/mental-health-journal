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
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AssessmentEntry } from "@/components/dashboard"
import { SuccessAnimation } from "@/components/success-animation"

interface LowMoodModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (entry: AssessmentEntry) => void
}

const BEHAVIORS = [
  { id: "isolated", label: "Isolated myself" },
  { id: "cried", label: "Cried" },
  { id: "angry", label: "Felt angry" },
  { id: "scrolled", label: "Scrolled mindlessly" },
  { id: "slept", label: "Slept too much/little" },
]

const EMOTIONS = ["Regretful", "More sad", "Exhausted", "Numb", "Anxious", "Frustrated", "Hopeless"]

const THOUGHTS = [
  "Things will never improve",
  "I'm a failure",
  "No one understands me",
  "I'm not good enough",
  "Everything is my fault",
]

export function LowMoodModal({ open, onOpenChange, onSave }: LowMoodModalProps) {
  const [triggers, setTriggers] = useState("")
  const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>([])
  const [otherBehavior, setOtherBehavior] = useState("")
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [otherEmotion, setOtherEmotion] = useState("")
  const [selectedThought, setSelectedThought] = useState("")
  const [customThought, setCustomThought] = useState("")
  const [reflection, setReflection] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = () => {
    // Calculate a score based on inputs (simplified example)
    const behaviorScore = selectedBehaviors.length
    const emotionScore = selectedEmotions.length
    const thoughtScore = selectedThought ? 1 : 0

    // Score from 1-10
    const totalScore = Math.min(10, Math.max(1, Math.round(((behaviorScore + emotionScore + thoughtScore) * 10) / 13)))

    const behaviors = [...selectedBehaviors]
    if (otherBehavior) behaviors.push(otherBehavior)

    const emotions = [...selectedEmotions]
    if (otherEmotion) emotions.push(otherEmotion)

    const thoughts = []
    if (selectedThought) thoughts.push(selectedThought)
    if (customThought) thoughts.push(customThought)

    const entry: AssessmentEntry = {
      id: Date.now().toString(),
      date: format(new Date(), "yyyy-MM-dd"),
      type: "lowMood",
      score: totalScore,
      triggers: triggers ? [triggers] : [],
      behaviors,
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
    setTriggers("")
    setSelectedBehaviors([])
    setOtherBehavior("")
    setSelectedEmotions([])
    setOtherEmotion("")
    setSelectedThought("")
    setCustomThought("")
    setReflection("")
  }

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) => (prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]))
  }

  return (
    <>
      <Dialog open={open && !showSuccess} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto gradient-modal">
          <DialogHeader>
            <DialogTitle>Low Mood Assessment</DialogTitle>
            <DialogDescription>Identify triggers and patterns in your low mood episodes.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Triggers */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">What triggered your low mood today?</CardTitle>
                <CardDescription>Briefly describe what made you feel low</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Work stress, loneliness, conflict..."
                  value={triggers}
                  onChange={(e) => setTriggers(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Behaviors */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">How did you react to these feelings?</CardTitle>
                <CardDescription>Select all behaviors that apply</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {BEHAVIORS.map((behavior) => (
                    <div key={behavior.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={behavior.id}
                        checked={selectedBehaviors.includes(behavior.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedBehaviors([...selectedBehaviors, behavior.id])
                          } else {
                            setSelectedBehaviors(selectedBehaviors.filter((id) => id !== behavior.id))
                          }
                        }}
                      />
                      <Label htmlFor={behavior.id}>{behavior.label}</Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="other-behavior"
                      checked={!!otherBehavior}
                      onCheckedChange={(checked) => {
                        if (!checked) setOtherBehavior("")
                      }}
                    />
                    <Label htmlFor="other-behavior">Other:</Label>
                    <Input
                      placeholder="Specify other behavior..."
                      value={otherBehavior}
                      onChange={(e) => setOtherBehavior(e.target.value)}
                      className="flex-1 h-8"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consequences/Emotions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">How did these behaviors make you feel afterward?</CardTitle>
                <CardDescription>Select all emotions that apply</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {EMOTIONS.map((emotion) => (
                    <Badge
                      key={emotion}
                      variant={selectedEmotions.includes(emotion) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleEmotion(emotion)}
                    >
                      {emotion}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="other-emotion">Other:</Label>
                  <Input
                    id="other-emotion"
                    placeholder="Specify other emotion..."
                    value={otherEmotion}
                    onChange={(e) => setOtherEmotion(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Thought Patterns */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Which negative thoughts came up today?</CardTitle>
                <CardDescription>Select a common thought pattern or add your own</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedThought} onValueChange={setSelectedThought}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a thought pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    {THOUGHTS.map((thought) => (
                      <SelectItem key={thought} value={thought}>
                        {thought}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-3">
                  <Label htmlFor="custom-thought">Or describe your own:</Label>
                  <Input
                    id="custom-thought"
                    placeholder="Describe your thought pattern..."
                    value={customThought}
                    onChange={(e) => setCustomThought(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Reflection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Reflection</CardTitle>
                <CardDescription>What's one small thing that could help you feel better today?</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="One small step I could take is..."
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="min-h-[80px]"
                  maxLength={100}
                />
                <div className="text-xs text-muted-foreground mt-1 text-right">{reflection.length}/100 characters</div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Assessment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showSuccess && (
        <SuccessAnimation
          score={Math.min(
            10,
            Math.max(
              1,
              Math.round(((selectedBehaviors.length + selectedEmotions.length + (selectedThought ? 1 : 0)) * 10) / 13),
            ),
          )}
          maxScore={10}
          title="Low Mood Assessment Saved"
          message="Your low mood assessment has been saved. These results can be examined in the future using AI analysis."
          onClose={handleSuccessClose}
          stats={{
            agree: selectedBehaviors.length + selectedEmotions.length + (selectedThought ? 1 : 0),
            disagree: 0,
            notAnswered: 13 - (selectedBehaviors.length + selectedEmotions.length + (selectedThought ? 1 : 0)),
          }}
        />
      )}
    </>
  )
}
