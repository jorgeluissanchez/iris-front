import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Project } from "@/types/api";

export const getUserProjects = (
  { userId, eventId }: { userId: string; eventId?: string }
): Promise<{ data: Project[] }> => {
  const params = eventId ? { eventId } : {};
  return api.get(`users/${userId}/projects`, { params });
};

export const getUserProjectsQueryOptions = ({
  userId,
  eventId,
}: {
  userId: string;
  eventId?: string;
}) => {
  return queryOptions({
    queryKey: ["user-projects", userId, eventId],
    queryFn: () => getUserProjects({ userId, eventId }),
    enabled: !!userId,
  });
};

type UseUserProjectsOptions = {
  userId: string;
  eventId?: string;
  queryConfig?: QueryConfig<typeof getUserProjectsQueryOptions>;
};

export const useUserProjects = ({
  userId,
  eventId,
  queryConfig,
}: UseUserProjectsOptions) => {
  return useQuery({
    ...getUserProjectsQueryOptions({ userId, eventId }),
    ...queryConfig,
  });
};