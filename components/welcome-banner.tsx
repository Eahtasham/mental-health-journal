"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem("hasVisited")
    if (!hasVisited) {
      setIsVisible(true)
      localStorage.setItem("hasVisited", "true")
    }
  }, [])

  if (!isVisible) return null

  return (
    <Card className="fixed bottom-4 right-4 z-50 max-w-md shadow-lg border-primary/20">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">Welcome to Mental Health Journal</h3>
          <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="mb-4">
          Prompt: Weekly mental health journal with tags and mood charts. 
        </p>
        <p className="text-sm text-muted-foreground">
          Created by <span className="font-semibold">Ehtasham Ummam</span> for the CodeCircuit Hackathon
        </p>
      </CardContent>
    </Card>
  )
}
