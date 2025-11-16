import { queryOptions, useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Meta, Project } from "@/types/api";

export const getProjectsInputSchema = z.object({
  page: z.number().optional(),
  eventId: z.string().optional(),
  pageSize: z.number().optional(),
});

export type GetProjectsInput = z.infer<typeof getProjectsInputSchema>;

export const getProjects = (
  { page, eventId, pageSize }: GetProjectsInput = { page: 1 }
): Promise<{ data: Project[]; meta: Meta }> => {
  const validatedInput = getProjectsInputSchema.parse({
    page,
    eventId,
    pageSize,
  });

  const params: any = { page: validatedInput.page };
  if (validatedInput.pageSize) params.pageSize = validatedInput.pageSize;

  if (validatedInput.eventId) {
    // Always use the /projects endpoint with event parameter
    params.event = validatedInput.eventId;
    return api.get(`/projects`, { params });
  }
  return api.get(`/projects`, { params });
};

export const getProjectsQueryOptions = ({
  page = 1,
  eventId,
  pageSize,
}: { page?: number; eventId?: string; pageSize?: number } = {}) => {
  return queryOptions({
    queryKey: [
      "projects",
      { page, eventId: eventId ?? null, pageSize: pageSize ?? null },
    ],
    queryFn: () => getProjects({ page, eventId, pageSize }),
  });
};

type UseProjectsOptions = {
  page?: number;
  eventId?: string;
  pageSize?: number;
  queryConfig?: QueryConfig<typeof getProjectsQueryOptions>;
};

export const useProjects = ({
  queryConfig,
  page,
  eventId,
  pageSize,
}: UseProjectsOptions) => {
  return useQuery({
    ...getProjectsQueryOptions({ page, eventId, pageSize }),
    ...queryConfig,
  });
};
