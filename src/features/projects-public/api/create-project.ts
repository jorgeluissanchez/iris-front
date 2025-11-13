import { api } from "@/lib/api-client";
import { Project } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationConfig } from "@/lib/react-query";
import { getProjectsQueryOptions } from "./get-projects";
import { z } from "zod";

export const participantInputSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Debe ser un email válido"),
  studentCode: z.string().optional(),
});

export const documentInputSchema = z.object({
  type: z.enum(["POSTER", "SUPPORTING_DOCUMENT"], {
    message:
      "El tipo de documento no es válido. Debe ser 'POSTER' o 'SUPPORTING_DOCUMENT'.",
  }),
  url: z.string().url("La URL del documento no es válida"),
});

export const createProjectInputSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no debe exceder los 100 caracteres"),

  description: z
    .string()
    .max(500, "La descripción no debe exceder los 500 caracteres")
    .optional(),

  eventId: z.string().min(1, "El ID del evento es requerido"),

  courseId: z.string().min(1, "El ID del curso es requerido"),

  participants: z
    .array(participantInputSchema)
    .min(1, "Debe agregar al menos un participante"),

  documents: z
    .array(documentInputSchema)
    .min(1, "Se requiere al menos el póster del proyecto")
    .refine((docs) => docs.some((doc) => doc.type === "POSTER"), {
      message: "El proyecto debe incluir un documento de tipo 'POSTER'.",
    }),
});

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

export const createProject = ({
  data,
}: {
  data: CreateProjectInput;
}): Promise<Project> => {
  return api.post(`/projects`, data);
};

type UseCreateProjectOptions = {
  mutationConfig?: MutationConfig<typeof createProject>;
};
export const useCreateProject = ({
  mutationConfig,
}: UseCreateProjectOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getProjectsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createProject,
  });
};
