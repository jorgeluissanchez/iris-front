import { api } from "@/lib/api-client";
import { Project } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

const projectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  eventId: z.string().uuid(),
  courseId: z.number().min(1).optional(),
  state: z.enum(["DRAFT", "UNDER_REVIEW", "PUBLISHED"]),
});
export type CreateProjectInput = z.infer<typeof projectSchema>;

export const createProject = ({ data }: { data: CreateProjectInput }): Promise<Project> => {
    return api.post(`/projects`, data);
};

