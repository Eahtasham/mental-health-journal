"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, LineChart, Activity, Brain, History, LayoutGrid, BarChart } from "lucide-react"
import { JournalModal } from "@/components/journal-modal"
import { LowMoodModal } from "@/components/low-mood-modal"
import { AnxietyModal } from "@/components/anxiety-modal"
import { DepressionModal } from "@/components/depression-modal"
import { MoodChart } from "@/components/mood-chart"
import { JournalHistory } from "@/components/journal-history"
import { AssessmentHistory } from "@/components/assessment-history"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { generateMockData } from "@/lib/mock-data"
import { ThemeToggle } from "@/components/theme-toggle"

export type JournalEntry = {
  id: string
  date: string
  morningMood: number
  eveningMood: number
  stressLevel: number
  energyLevel: number
  gratitude: string
}

export type AssessmentEntry = {
  id: string
  date: string
  type: "lowMood" | "anxiety" | "depression"
  score: number
  triggers?: string[]
  behaviors?: string[]
  thoughts?: string[]
  reflection?: string
}

export default function Dashboard() {
  const [journalOpen, setJournalOpen] = useState(false)
  const [lowMoodOpen, setLowMoodOpen] = useState(false)
  const [anxietyOpen, setAnxietyOpen] = useState(false)
  const [depressionOpen, setDepressionOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [historyType, setHistoryType] = useState<"journal" | "assessments">("journal")

  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>("journal-entries", [])
  const [assessmentEntries, setAssessmentEntries] = useLocalStorage<AssessmentEntry[]>("assessment-entries", [])

  // Use a ref to track if we've initialized data
  const initialized = useRef(false)

  // Generate mock data if none exists - only run once
  useEffect(() => {
    // Only run this effect once
    if (!initialized.current && journalEntries.length === 0) {
      const mockData = generateMockData(7)
      setJournalEntries(mockData.journalEntries)
      setAssessmentEntries(mockData.assessmentEntries)
      initialized.current = true
    }
  }, [journalEntries.length, setJournalEntries, setAssessmentEntries])

  const addJournalEntry = (entry: JournalEntry) => {
    setJournalEntries((prev) => [entry, ...prev])
  }

  const addAssessmentEntry = (entry: AssessmentEntry) => {
    setAssessmentEntries((prev) => [entry, ...prev])
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold tracking-tighter mb-2 relative">
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-500">
                Mental Health Dashboard
              </span>
            </h1>
            <p className="text-muted-foreground">Track your mental wellbeing and monitor your progress over time.</p>
          </div>
          <ThemeToggle />
        </div>

        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="bg-card rounded-lg p-1 shadow-sm border">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="dashboard" className="tab-highlight text-base py-3">
                <LayoutGrid className="h-5 w-5 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="history" className="tab-highlight text-base py-3">
                <History className="h-5 w-5 mr-2" />
                History
              </TabsTrigger>
              <TabsTrigger value="charts" className="tab-highlight text-base py-3">
                <BarChart className="h-5 w-5 mr-2" />
                Charts
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Quick Journal Card */}
              <Card className="overflow-hidden border-blue-200 dark:border-blue-900">
                <CardHeader className="gradient-blue text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Daily Quick Journal
                  </CardTitle>
                  <CardDescription className="text-blue-100">Track your daily mood and reflections</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center h-24">
                    <div className="relative pulse-animation flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900">
                      <Calendar className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full pulse-animation bg-blue-500 hover:bg-blue-600"
                    onClick={() => setJournalOpen(true)}
                  >
                    Start Journal Entry
                  </Button>
                </CardFooter>
              </Card>

              {/* Low Mood Assessment Card */}
              <Card className="border-indigo-200 dark:border-indigo-900">
                <CardHeader className="gradient-purple text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Low Mood Assessment
                  </CardTitle>
                  <CardDescription className="text-purple-100">Identify triggers and patterns</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center h-24">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900">
                      <Activity className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-purple-200 text-purple-500 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900"
                    onClick={() => setLowMoodOpen(true)}
                  >
                    Take Assessment
                  </Button>
                </CardFooter>
              </Card>

              {/* Anxiety Assessment Card */}
              <Card className="border-amber-200 dark:border-amber-900">
                <CardHeader className="gradient-amber text-white">
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Anxiety Assessment
                  </CardTitle>
                  <CardDescription className="text-amber-100">Measure your anxiety levels</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center h-24">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900">
                      <LineChart className="h-8 w-8 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-amber-200 text-amber-500 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-900"
                    onClick={() => setAnxietyOpen(true)}
                  >
                    Take Assessment
                  </Button>
                </CardFooter>
              </Card>

              {/* Depression Assessment Card */}
              <Card className="border-green-200 dark:border-green-900">
                <CardHeader className="gradient-green text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Depression Assessment
                  </CardTitle>
                  <CardDescription className="text-green-100">Track depression symptoms</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center h-24">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900">
                      <Brain className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-green-200 text-green-500 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900"
                    onClick={() => setDepressionOpen(true)}
                  >
                    Take Assessment
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Charts section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Mood Trends
                  </CardTitle>
                  <CardDescription>Your mood patterns over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {journalEntries.length > 0 && <MoodChart journalEntries={journalEntries.slice(0, 7)} />}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Stress & Energy Levels
                  </CardTitle>
                  <CardDescription>Compare your stress and energy levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {journalEntries.length > 0 && (
                      <MoodChart
                        journalEntries={journalEntries.slice(0, 7)}
                        dataKeys={["stressLevel", "energyLevel"]}
                        colors={["#ef4444", "#22c55e"]}
                        labels={["Stress", "Energy"]}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent History Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Recent Journal Entries
                  </CardTitle>
                  <CardDescription>Your last 7 days of journal entries</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab("history")}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {journalEntries.length > 0 && <JournalHistory entries={journalEntries.slice(0, 7)} />}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>History</CardTitle>
                  <CardDescription>View your past entries and assessments</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant={historyType === "journal" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHistoryType("journal")}
                  >
                    Journal
                  </Button>
                  <Button
                    variant={historyType === "assessments" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHistoryType("assessments")}
                  >
                    Assessments
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {historyType === "journal"
                  ? journalEntries.length > 0 && <JournalHistory entries={journalEntries} showAll />
                  : assessmentEntries.length > 0 && <AssessmentHistory entries={assessmentEntries} />}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Mood Trends</CardTitle>
                  <CardDescription>Morning and evening mood over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {journalEntries.length > 0 && <MoodChart journalEntries={journalEntries} />}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stress & Energy Levels</CardTitle>
                  <CardDescription>Compare your stress and energy levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {journalEntries.length > 0 && (
                      <MoodChart
                        journalEntries={journalEntries}
                        dataKeys={["stressLevel", "energyLevel"]}
                        colors={["#ef4444", "#22c55e"]}
                        labels={["Stress", "Energy"]}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Assessment Scores</CardTitle>
                  <CardDescription>Track your assessment scores over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {assessmentEntries.length > 0 && (
                      <MoodChart
                        assessmentEntries={assessmentEntries}
                        isAssessment
                        colors={["#3b82f6", "#f59e0b", "#8b5cf6"]}
                        labels={["Low Mood", "Anxiety", "Depression"]}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <JournalModal open={journalOpen} onOpenChange={setJournalOpen} onSave={addJournalEntry} />

      <LowMoodModal open={lowMoodOpen} onOpenChange={setLowMoodOpen} onSave={addAssessmentEntry} />

      <AnxietyModal open={anxietyOpen} onOpenChange={setAnxietyOpen} onSave={addAssessmentEntry} />

      <DepressionModal open={depressionOpen} onOpenChange={setDepressionOpen} onSave={addAssessmentEntry} />
    </div>
  )
}
