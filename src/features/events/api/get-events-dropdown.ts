import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Event } from "@/types/api";

export const getEventsDropdown = (): Promise<{ data: Event[] }> => {
  return api.get(`/events-dropdown`);
};

export const getEventsDropdownQueryOptions = () => {
  return queryOptions({
    queryKey: ["events", "dropdown"],
    queryFn: () => getEventsDropdown(),
  });
};

type UseEventsDropdownOptions = {
  queryConfig?: QueryConfig<typeof getEventsDropdownQueryOptions>;
};

export const useEventsDropdown = ({ queryConfig }: UseEventsDropdownOptions = {}) => {
  return useQuery({
    ...getEventsDropdownQueryOptions(),
    ...queryConfig,
  });
};
