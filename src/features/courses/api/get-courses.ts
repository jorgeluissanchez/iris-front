import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Meta, Course } from "@/types/api";

export const getCourses = (
  { page, eventId }: { page?: number; eventId?: string } = { page: 1 }
): Promise<{ data: Course[]; meta: Meta }> => {
  return api.get(`/courses`, { params: { page, eventId } });
};

export const getCoursesQueryOptions = (
  { page = 1, eventId }: { page?: number; eventId?: string } = {}
) => {
  return queryOptions({
    queryKey: ["courses", { page, eventId }],
    queryFn: () => getCourses({ page, eventId }),
  });
};

type UseCoursesOptions = {
  page?: number;
  eventId?: string;
  queryConfig?: QueryConfig<typeof getCoursesQueryOptions>;
};

export const useCourses = ({ queryConfig, page, eventId }: UseCoursesOptions) => {
  return useQuery({
    ...getCoursesQueryOptions({ page, eventId }),
    ...queryConfig,
  });
};
