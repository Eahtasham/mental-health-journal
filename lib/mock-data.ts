import { format, subDays } from "date-fns"
import type { JournalEntry, AssessmentEntry } from "@/components/dashboard"

export function generateMockData(days = 7) {
  const journalEntries: JournalEntry[] = []
  const assessmentEntries: AssessmentEntry[] = []

  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(today, i), "yyyy-MM-dd")

    // Generate journal entry
    journalEntries.push({
      id: `journal-${date}`,
      date,
      morningMood: Math.floor(Math.random() * 5) + 1,
      eveningMood: Math.floor(Math.random() * 5) + 1,
      stressLevel: Math.floor(Math.random() * 10) + 1,
      energyLevel: Math.floor(Math.random() * 5) + 1,
      gratitude:
        i % 2 === 0
          ? "I'm grateful for the support of my friends and family."
          : "I'm grateful for the opportunity to learn and grow each day.",
    })

    // Generate assessment entries (not every day)
    if (i % 2 === 0) {
      assessmentEntries.push({
        id: `lowmood-${date}`,
        date,
        type: "lowMood",
        score: Math.floor(Math.random() * 10) + 1,
        triggers: ["Work stress", "Not enough sleep"],
        behaviors: ["isolated", "scrolled"],
        thoughts: ["Things will never improve"],
      })
    }

    if (i % 3 === 0) {
      assessmentEntries.push({
        id: `anxiety-${date}`,
        date,
        type: "anxiety",
        score: Math.floor(Math.random() * 10) + 1,
        triggers: ["heart", "breathing"],
        thoughts: ["Feeling nervous, anxious, or on edge", "Not being able to stop or control worrying"],
      })
    }

    if (i % 4 === 0) {
      assessmentEntries.push({
        id: `depression-${date}`,
        date,
        type: "depression",
        score: Math.floor(Math.random() * 10) + 1,
        thoughts: ["Feeling down, depressed, or hopeless", "Trouble falling or staying asleep, or sleeping too much"],
      })
    }
  }

  return { journalEntries, assessmentEntries }
}
