import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Course } from "@/types/api";

export const getCoursesDropdown = (eventId?: string): Promise<{ data: Course[] }> => {
  return api.get(`/courses-dropdown`, {
    params: eventId ? { eventId } : undefined,
  });
};

export const getCoursesDropdownQueryOptions = (eventId?: string) => {
  return queryOptions({
    queryKey: eventId ? ["courses", "dropdown", eventId] : ["courses", "dropdown"],
    queryFn: () => getCoursesDropdown(eventId),
  });
};

type UseCoursesDropdownOptions = {
  eventId?: string;
  queryConfig?: QueryConfig<typeof getCoursesDropdownQueryOptions>;
};

export const useCoursesDropdown = ({ 
  eventId, 
  queryConfig 
}: UseCoursesDropdownOptions = {}) => {
  return useQuery({
    ...getCoursesDropdownQueryOptions(eventId),
    ...queryConfig,
  });
};
