"use client"

import { CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface SuccessAnimationProps {
  score: number
  maxScore: number
  title: string
  message: string
  onClose: () => void
  stats?: {
    agree?: number
    disagree?: number
    notAnswered?: number
  }
}

export function SuccessAnimation({ score, maxScore, title, message, onClose, stats }: SuccessAnimationProps) {
  const percentage = (score / maxScore) * 100

  let color = "text-green-500"
  if (percentage < 40) color = "text-red-500"
  else if (percentage < 70) color = "text-amber-500"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <Card className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-6 flex flex-col items-center">
          <div className="success-animation mb-4">
            <CheckCircle className={`h-16 w-16 ${color}`} />
          </div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-center mb-4">{message}</p>

          <div className="w-full mb-6">
            <div className="flex justify-between mb-2">
              <span>Score</span>
              <span className={color}>
                {score}/{maxScore}
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>

          {stats && (
            <div className="w-full grid grid-cols-3 gap-4 mb-6">
              {stats.agree !== undefined && (
                <div className="flex flex-col items-center">
                  <div className="text-sm text-muted-foreground">Agree</div>
                  <div className="text-lg font-semibold">{stats.agree}</div>
                </div>
              )}
              {stats.disagree !== undefined && (
                <div className="flex flex-col items-center">
                  <div className="text-sm text-muted-foreground">Disagree</div>
                  <div className="text-lg font-semibold">{stats.disagree}</div>
                </div>
              )}
              {stats.notAnswered !== undefined && (
                <div className="flex flex-col items-center">
                  <div className="text-sm text-muted-foreground">Not Answered</div>
                  <div className="text-lg font-semibold">{stats.notAnswered}</div>
                </div>
              )}
            </div>
          )}

          <Button onClick={onClose} className="w-full">
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

import { Button } from "@/components/ui/button"
