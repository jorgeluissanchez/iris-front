import { Card } from "@/components/ui/card"

interface JuryFeedbackCardProps {
  evaluatorName: string
  date: string
  feedback: string
}

export function JuryFeedbackCard({ evaluatorName, date, feedback }: JuryFeedbackCardProps) {
  return (
    <Card className="bg-card border-border p-6 text-card-foreground">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-base font-semibold">{evaluatorName}</h3>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{feedback}</p>
    </Card>
  )
}
