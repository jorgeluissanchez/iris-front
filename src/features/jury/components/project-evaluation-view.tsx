"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { FileText, Users, Download, Send, ArrowLeft, AlertCircle } from "lucide-react"
import { useProjectPublic } from "@/features/projects-public/api/get-project"
import { AvatarGroup } from "@/features/projects/components/avatar-icon"
import { useCourseCriteria } from "@/features/cirteria/api/get-course-criterion"
import { useCreateEvaluation } from "@/features/evaluations/api/create-evaluation"
import { useNotifications } from "@/components/ui/notifications"

type ProjectEvaluationViewProps = {
  projectId: string;
};

export function ProjectEvaluationView({ projectId }: ProjectEvaluationViewProps) {
  const router = useRouter()
  // Inicializar scores dinámicamente basado en criteriaData
  const [scores, setScores] = useState<Record<string, number>>({})
  const [comments, setComments] = useState("")
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const { addNotification } = useNotifications()

  const { data: project, isLoading: isLoadingProject } = useProjectPublic({ projectId })
  const projects = project?.data

  const { data: criteria, isLoading: isLoadingCriteria } = useCourseCriteria({
    courseId: String(projects?.courseId || ""),
  })

  const createEvaluationMutation = useCreateEvaluation({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: "success",
          title: "Evaluation submitted",
          message: "Your evaluation has been submitted successfully",
        })
        // Reset form
        setComments("")
        if (Array.isArray(criteriaData) && criteriaData.length > 0) {
          const resetScores: Record<string, number> = {}
          criteriaData.forEach((criterion: any) => {
            resetScores[criterion.id] = 0
          })
          setScores(resetScores)
        }
        if (projects?.eventId) {
          router.push(`/app/events/${projects.eventId}`)
        } else {
          router.push("/app")
        }
      },
      onError: (error: any) => {
        addNotification({
          type: "error",
          title: "Error submitting evaluation",
          message: error?.message || "An error occurred while submitting the evaluation",
        })
      },
    },
  })

  const criteriaData = (criteria as any)?.data || []

  useEffect(() => {
    if (Array.isArray(criteriaData) && criteriaData.length > 0) {
      const initialScores: Record<string, number> = {}
      criteriaData.forEach((criterion: any) => {
        initialScores[criterion.id] = 0
      })
      setScores(initialScores)
    }
  }, [criteriaData.length])

  // New scoring logic: every criterion is rated 0-5, contribution = (rating/5)*weight
  const totalScore = Array.isArray(criteriaData)
    ? criteriaData.reduce((sum: number, criterion: any) => {
      const rating = scores[criterion.id] ?? 0
      const weight = criterion.weight || 0
      return sum + (rating / 5) * weight
    }, 0)
    : 0
  const maxTotalScore = Array.isArray(criteriaData)
    ? criteriaData.reduce((sum: number, criterion: any) => sum + (criterion.weight || 0), 0)
    : 0

  const handleScoreChange = (criterionId: string, value: string, maxScore: number) => {
    const numValue = Number.parseFloat(value) || 0
    setScores((prev) => ({
      ...prev,
      [criterionId]: Math.min(Math.max(0, numValue), maxScore),
    }))
  }

  const handleSubmit = () => {
    if (createEvaluationMutation.isPending) return

    // Validar que al menos un criterio haya sido calificado (incluso con 0)
    const hasAnyScore = Object.keys(scores).length > 0
    if (!hasAnyScore) {
      addNotification({
        type: "error",
        title: "Invalid evaluation",
        message: "Please provide scores for the criteria before submitting",
      })
      return
    }

    // Abrir modal de confirmación
    setIsConfirmModalOpen(true)
  }

  const handleConfirmSubmit = () => {
    setIsConfirmModalOpen(false)

    createEvaluationMutation.mutate({
      data: {
        projectId,
        comments,
        scores: Object.entries(scores).map(([criterionId, score]) => ({
          criterion: criterionId,
          score,
        })),
      }
    })
  }

  const handleGoBack = () => {
    if (projects?.eventId) {
      router.push(`/app/events/${projects.eventId}`)
    } else {
      router.push('/app')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Button
          variant="light"
          className="gap-2"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Details Card */}
        <Card className="glass-card border-border bg-card">
          <CardBody className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-balance">{projects?.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {projects?.description}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Team members</span>
                </div>
                <AvatarGroup
                  members={projects?.participants?.map(p => ({
                    ...p,
                    name: `${p.firstName} ${p.lastName}`
                  })) || []}
                  size={28}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Project poster</span>
                </div>
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center px-4">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Poster 1</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Project poster</span>
                </div>
                <Button className="w-full justify-between bg-transparent transition-transform hover:scale-[1.01]" size="sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Document 1</span>
                  </div>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Evaluation Form Card */}
        <Card className="glass-card border-border bg-card">
          <CardHeader>
            <p className="text-lg font-semibold">Project Evaluation</p>
            <p className="text-sm text-muted-foreground">Rate the project based on the criteria below</p>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* Criterios dinámicos */}
            {Array.isArray(criteriaData) && criteriaData.map((criterion: any) => (
              <div key={criterion.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={criterion.id} className="text-sm font-medium">
                    {criterion.name}
                  </Label>
                  <span className="text-xs text-muted-foreground">/5 (weight {criterion.weight})</span>
                </div>
                <Input
                  id={criterion.id}
                  type="number"
                  step="0.1"
                  min="0"
                  max={5}
                  value={scores[criterion.id]?.toString() || "0"}
                  onChange={(e) => handleScoreChange(criterion.id, e.target.value, 5)}
                  disabled={createEvaluationMutation.isPending}
                />
                {criterion.description && (
                  <p className="text-xs text-muted-foreground">{criterion.description}</p>
                )}
              </div>
            ))}

            {/* Total Score */}
            <div className="flex items-center justify-between rounded-lg p-4">
              <span className="font-semibold">Total score</span>
              <span className="text-2xl font-bold">
                {totalScore.toFixed(1)}/{maxTotalScore.toFixed(1)}
              </span>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <Label htmlFor="comments" className="text-sm font-medium">
                Comments and Feedback
              </Label>
              <Textarea
                id="comments"
                placeholder="Brief description of the course"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="min-h-[100px] resize-none"
                disabled={createEvaluationMutation.isPending}
              />
            </div>

            {/* Submit Button */}
            <Button
              className="w-full transition-transform hover:scale-[1.01]"
              color="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={createEvaluationMutation.isPending}
            >
              {createEvaluationMutation.isPending ? (
                <>
                  <span className="mr-2">Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit evaluation
                </>
              )}
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={isConfirmModalOpen} 
        onOpenChange={setIsConfirmModalOpen}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <span>Confirm Evaluation Submission</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You are about to submit your evaluation for <span className="font-semibold text-foreground">{projects?.name}</span>.
                  </p>
                  <div className="rounded-lg bg-muted p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Score:</span>
                      <span className="font-semibold">{totalScore.toFixed(1)} / {maxTotalScore.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Criteria Evaluated:</span>
                      <span className="font-semibold">{Object.keys(scores).length} / {criteriaData.length}</span>
                    </div>
                  </div>
                  <p className="text-sm text-warning">
                    ⚠️ Once submitted, this evaluation cannot be edited.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="ghost"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onClick={handleConfirmSubmit}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Confirm & Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
