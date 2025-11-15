import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Event } from "@/types/api";

export const getEvent = async ({
  eventId,
}: {
  eventId: string;
}): Promise<{ data: Event }> => {
  const response = await api.get<Event>(`/events/${eventId}`);
  return {
    data: response,
  };
};

export const getEventQueryOptions = (eventId: string) => {
  return queryOptions({
    queryKey: ["events", eventId],
    queryFn: () => getEvent({ eventId }),
  });
};

type UseEventOptions = {
  eventId: string;
  queryConfig?: QueryConfig<typeof getEventQueryOptions>;
};

export const useEvent = ({ eventId, queryConfig }: UseEventOptions) => {
  return useQuery({ ...getEventQueryOptions(eventId), ...queryConfig });
};
