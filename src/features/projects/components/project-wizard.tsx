"use client"

import { useState } from "react"
import { Card, CardHeader, CardBody } from "@heroui/card"
import { Button } from "@heroui/button"
import { ParticipantsStep } from "./wizard-steps/participants-step"
import { ProjectDetailsStep } from "./wizard-steps/project-details-step"
import { DocumentsStep } from "./wizard-steps/documents-step"
import { ReviewStep } from "./wizard-steps/review-step"
import { CheckCircle2, FileText, Users, Upload } from "lucide-react"
import { cn } from "@/utils/cn"
import { url } from "inspector"

export type Participant = {
  id: string
  firstName: string
  lastName: string
  email: string
  studentCode?: string
}

export type ProjectData = {
  name: string
  description: string
  course: string
}

export type DocumentsData = {
  poster: File | null
  additionalDocuments: File[]
}

export type WizardData = {
  participants: Participant[]
  project: ProjectData
  documents: DocumentsData
}

const steps = [
  { id: 1, name: "Participantes", icon: Users },
  { id: 2, name: "Proyecto", icon: FileText },
  { id: 3, name: "Documentos", icon: Upload },
  { id: 4, name: "Revisión", icon: CheckCircle2 },
]

type ProjectWizardProps = {
  eventId?: string
}

export function ProjectWizard({ eventId }: ProjectWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [wizardData, setWizardData] = useState<WizardData>({
    participants: [],
    project: {
      name: "",
      description: "",
      course: "",
    },
    documents: {
      poster: null,
      additionalDocuments: [],
    },
  })

  const updateParticipants = (participants: Participant[]) => {
    setWizardData((prev) => ({ ...prev, participants }))
  }

  const updateProject = (project: ProjectData) => {
    setWizardData((prev) => ({ ...prev, project }))
  }

  const updateDocuments = (documents: DocumentsData) => {
    setWizardData((prev) => ({ ...prev, documents }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const courseKeyToId: Record<string, number> = {
    industrial: 1,
    mecanica: 2,
    civil: 3,
    electrica: 4,
    sistemas: 5,
    quimica: 6,
    arquitectura: 7,
    administracion: 8,
    economia: 9,
    otro: 99,
  }

  const mapFileToDocument = (file: File | null, kind: 'POSTER' | 'SUPPORTING_DOCUMENT') => {
    if (!file) return null
    return {
      type: kind,
      url: URL.createObjectURL(file),
    }
  }

  const handleSubmit = () => {
    const payload: any = {
      eventId: eventId ?? null,
      courseId: courseKeyToId[wizardData.project.course] ?? null,
      name: wizardData.project.name,
      documents: [
        ...(mapFileToDocument(wizardData.documents.poster, 'POSTER') ? [mapFileToDocument(wizardData.documents.poster, 'POSTER')] : []),
        ...wizardData.documents.additionalDocuments.map((f) => ({
          type: 'SUPPORTING_DOCUMENT',
          url: URL.createObjectURL(f),
        })),
      ],
      participants: wizardData.participants.map((p) => {
        const participant: any = {
          firstName: p.firstName,
          lastName: p.lastName,
          email: p.email,
        }
        if (p.studentCode) {
          participant.studentCode = p.studentCode
        }
        return participant
      }),
    }

    if (wizardData.project.description) {
      payload.description = wizardData.project.description
    }
  }

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, stepIdx) => {
            const Icon = step.icon
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id

            return (
              <li
                key={step.id}
                className={cn("relative flex flex-col items-center", stepIdx !== steps.length - 1 ? "flex-1" : "")}
              >
                {stepIdx !== steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-1/2 top-5 h-0.5 w-full -translate-y-1/2",
                      isCompleted ? "bg-primary" : "bg-default-200",
                    )}
                    aria-hidden="true"
                  />
                )}
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    isCompleted && "border-primary bg-primary text-white",
                    isCurrent && "border-primary bg-white text-primary",
                    !isCompleted && !isCurrent && "border-default-300 bg-white text-default-400",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </button>
                <span className={cn("mt-2 text-sm font-medium", isCurrent ? "text-primary" : "text-default-500")}>
                  {step.name}
                </span>
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Step Content */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold">{steps[currentStep - 1].name}</h2>
            <p className="text-default-500 text-sm">
              {currentStep === 1 && "Agregue los participantes del proyecto"}
              {currentStep === 2 && "Ingrese los detalles del proyecto"}
              {currentStep === 3 && "Suba los documentos requeridos"}
              {currentStep === 4 && "Revise la información antes de enviar"}
            </p>
          </div>
        </CardHeader>
        <CardBody>
          {currentStep === 1 && (
            <ParticipantsStep participants={wizardData.participants} onUpdate={updateParticipants} />
          )}
          {currentStep === 2 && <ProjectDetailsStep project={wizardData.project} onUpdate={updateProject} />}
          {currentStep === 3 && <DocumentsStep documents={wizardData.documents} onUpdate={updateDocuments} />}
          {currentStep === 4 && <ReviewStep data={wizardData} />}
        </CardBody>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="bordered" onPress={handleBack} isDisabled={currentStep === 1}>
          Anterior
        </Button>
        {currentStep < steps.length ? (
          <Button color="primary" onPress={handleNext}>
            Siguiente
          </Button>
        ) : (
          <Button color="success" onPress={handleSubmit}>
            Enviar Proyecto
          </Button>
        )}
      </div>
    </div>
  )
}
