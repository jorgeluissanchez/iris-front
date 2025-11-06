import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Project, Meta } from "@/types/api";

export const getProjectsByEvent = ({
  eventId,
  page = 1,
}: {
  eventId: string;
  page?: number;
}): Promise<{ data: Project[]; meta: Meta }> => {
  return api.get(`/projects/by-event/${eventId}`, { params: { page } });
};

export const getProjectsByEventQueryOptions = ({
  eventId,
  page = 1,
}: {
  eventId: string;
  page?: number;
}) => {
  return queryOptions({
    queryKey: ["projects", "by-event", eventId, { page }],
    queryFn: () => getProjectsByEvent({ eventId, page }),
  });
};

type UseProjectsByEventOptions = {
  eventId: string;
  page?: number;
  queryConfig?: QueryConfig<typeof getProjectsByEventQueryOptions>;
};

export const useProjectsByEvent = ({
  eventId,
  page = 1,
  queryConfig,
}: UseProjectsByEventOptions) => {
  return useQuery({
    ...getProjectsByEventQueryOptions({ eventId, page }),
    ...queryConfig,
  });
};
