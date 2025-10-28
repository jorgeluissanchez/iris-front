import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Meta, Event } from "@/types/api";

export const getEvents = (
  { page }: { page?: number } = { page: 1 }
): Promise<{ data: Event[]; meta: Meta }> => {
  return api.get(`/events`, { params: { page } });
};

export const getEventsQueryOptions = ({ page }: { page?: number } = {}) => {
  return queryOptions({
    queryKey: ["events", page],
    queryFn: () => getEvents({ page }),
  });
};

type UseEventsOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getEventsQueryOptions>;
};

export const useEvents = ({ queryConfig, page }: UseEventsOptions) => {
  return queryOptions({
    ...getEventsQueryOptions({ page }),
    ...queryConfig,
  });
};
