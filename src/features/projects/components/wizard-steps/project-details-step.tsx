"use client"

import { Input } from "@heroui/react"
import { Textarea } from "@heroui/input"
import { Select, SelectItem } from "@heroui/select"
import { ProjectData } from "../project-wizard"

type ProjectDetailsStepProps = {
  project: ProjectData
  onUpdate: (project: ProjectData) => void
}

const courses = [
  { key: "industrial", label: "Ingeniería Industrial" },
  { key: "mecanica", label: "Ingeniería Mecánica" },
  { key: "civil", label: "Ingeniería Civil" },
  { key: "electrica", label: "Ingeniería Eléctrica" },
  { key: "sistemas", label: "Ingeniería de Sistemas" },
  { key: "quimica", label: "Ingeniería Química" },
  { key: "arquitectura", label: "Arquitectura" },
  { key: "administracion", label: "Administración de Empresas" },
  { key: "economia", label: "Economía" },
  { key: "otro", label: "Otro" },
]

export function ProjectDetailsStep({ project, onUpdate }: ProjectDetailsStepProps) {
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
        placeholder="Seleccione un curso"
        selectedKeys={project.course ? [project.course] : []}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string
          onUpdate({ ...project, course: selected })
        }}
        isRequired
      >
        {courses.map((course) => (
          <SelectItem key={course.key}>
            {course.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  )
}
