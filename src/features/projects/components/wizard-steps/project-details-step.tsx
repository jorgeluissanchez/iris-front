"use client"

import { Input } from "@heroui/react"
import { Textarea } from "@heroui/input"
import { Select, SelectItem } from "@heroui/select"
import { ProjectData } from "../project-wizard"
import { LogoUpload } from "../image-crop/logo-upload"
import { useEventCourses } from "@/features/course/api/get-course"

type ProjectDetailsStepProps = {
  eventId: string
  project: ProjectData
  onUpdate: (project: ProjectData) => void
}

export function ProjectDetailsStep({eventId, project, onUpdate }: ProjectDetailsStepProps) {
  const { data: courses, isLoading, isError } = useEventCourses({ eventId })

  return (
    <div className="space-y-6">
      <Input
        label="Nombre del Proyecto"
        placeholder="Sistema de gestión de inventario inteligente"
        value={project.name}
        onValueChange={(value) => onUpdate({ ...project, name: value })}
        isRequired
      />

      <Textarea
        label="Descripción del Proyecto"
        placeholder="Describa brevemente el objetivo y alcance de su proyecto..."
        value={project.description}
        onValueChange={(value) => onUpdate({ ...project, description: value })}
        minRows={6}
        description="Incluya el problema que resuelve, la metodología y los resultados esperados."
      />

     <Select
        label="Curso al que Pertenece"
        placeholder={isLoading ? "Cargando cursos..." : "Seleccione un curso"}
        selectedKeys={project.courseId ? [project.courseId] : []}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string
          onUpdate({ ...project, courseId: selected })
        }}
        isDisabled={isLoading || isError}
        isRequired
      >
        {(courses ?? []).map((course: any) => (
          <SelectItem key={String(course.id)}>
            {course.code}
          </SelectItem>
        ))}
      </Select>

      <LogoUpload value={project.logo} onChange={(logo) => onUpdate({ ...project, logo: logo || "" })} />
      
    </div>
  )
}
