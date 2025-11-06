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
import { set, z } from "zod"
import { participantSchema, projectSchema, documentsSchema } from "../schemas/wizard-schema"
import { createProjectInputSchema , useCreateProject } from "../api/create-project"

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
  courseId: string
  logo: string
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
  eventId: string
}

export function ProjectWizard({ eventId }: ProjectWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [stepErrors, setStepErrors] = useState<string[]>([])
  const [wizardData, setWizardData] = useState<WizardData>({
    participants: [],
    project: {
      name: "",
      description: "",
      courseId: "",
      logo: "",
    },
    documents: {
      poster: null,
      additionalDocuments: [],
    },
  })
  const [createErrors, setCreateErrors] = useState<string[]>([])
  const createProjectMutation = useCreateProject()

  const updateParticipants = (participants: Participant[]) => {
    setWizardData((prev) => ({ ...prev, participants }))
  }

  const updateProject = (project: ProjectData) => {
    setWizardData((prev) => ({ ...prev, project }))
  }

  const updateDocuments = (documents: DocumentsData) => {
    setWizardData((prev) => ({ ...prev, documents }))
  }

  const validateStep = (step: number): boolean => {
    setStepErrors([])

    try {
      switch (step) {
        case 1: // Participantes
          z.array(participantSchema)
            .min(1, 'Debe agregar al menos un participante')
            .parse(wizardData.participants)
          return true

        case 2: // Proyecto
          projectSchema.parse(wizardData.project)
          return true

        case 3: // Documentos
          documentsSchema.parse(wizardData.documents)
          return true

        default:
          return true
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues.map((e) => e.message)
        setStepErrors(messages)
      }
      return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setStepErrors([])
      setCurrentStep(currentStep - 1)
    }
  }

  const mapFileToDocument = (file: File | null, kind: 'POSTER' | 'SUPPORTING_DOCUMENT') => {
    if (!file) return null
    return {
      type: kind,
      url: URL.createObjectURL(file),
    }
  }

    const getErrorMessage = (err: unknown) => {
    // Extrae mensaje útil de Axios/fetch/backends comunes
    const anyErr = err as any
    return (
      anyErr?.response?.data?.message ||
      anyErr?.response?.data?.error ||
      anyErr?.message ||
      "Error desconocido al crear el proyecto"
    )
  }  

  const handleSubmit = () => {
    setStepErrors([])
    const payload: any = {
      eventId: eventId,
      courseId: wizardData.project.courseId,
      name: wizardData.project.name,
      logo: `https://storage.example.com/projects/logos/${Date.now()}.png`,
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

    try {
      const validated = createProjectInputSchema.parse(payload)
      createProjectMutation.mutate({ data: validated })
      console.log("Creating project:", validated)
    } catch (e) {
      if (e instanceof z.ZodError) {
        setCreateErrors(e.issues.map(i => i.message))
      } else {
        setCreateErrors([getErrorMessage(e)])
      }
    }

    console.log("Submitting project with payload:", payload)
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
          {currentStep === 2 && <ProjectDetailsStep eventId={eventId} project={wizardData.project} onUpdate={updateProject} />}
          {currentStep === 3 && <DocumentsStep documents={wizardData.documents} onUpdate={updateDocuments} />}
          {currentStep === 4 && <ReviewStep data={wizardData} />}

          {/* Mostrar errores de validación */}
          {stepErrors.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-semibold mb-2">Errores de validación:</p>
              <ul className="list-disc list-inside space-y-1">
                {stepErrors.map((error, idx) => (
                  <li key={idx} className="text-red-700 text-sm">{error}</li>
                ))}
              </ul>
            </div>
          )}
        </CardBody>
      </Card>
                {stepErrors.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-semibold mb-2">Errores de validación:</p>
              <ul className="list-disc list-inside space-y-1">
                {stepErrors.map((error, idx) => (
                  <li key={idx} className="text-red-700 text-sm">{error}</li>
                ))}
              </ul>
            </div>
          )}
          {createErrors.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-semibold mb-2">Errores al crear:</p>
              <ul className="list-disc list-inside space-y-1">
                {createErrors.map((error, idx) => (
                  <li key={idx} className="text-red-700 text-sm">{error}</li>
                ))}
              </ul>
            </div>
          )}
          {createProjectMutation.isSuccess && (
            <div className="mt-4 p-2 rounded bg-green-100 text-green-700 text-sm">
              Proyecto creado correctamente
            </div>
          )}
          {createProjectMutation.isError && (
            <div className="mt-4 p-2 rounded bg-red-100 text-red-700 text-sm">
              Error al crear el proyecto
            </div>
          )}

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
          <Button 
            color="success" 
            onPress={handleSubmit} 
            isLoading={createProjectMutation.isPending}
            isDisabled={createProjectMutation.isPending}
          >
            {createProjectMutation.isPending ? "Creando..." : "Enviar Proyecto"}
          </Button>
        )}
      </div>
    </div>
  )
}
