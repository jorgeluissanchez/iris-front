import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Course } from "@/types/api";

export const getCourse = ({
  courseId,
}: {
  courseId: string;
}): Promise<{ data: Course }> => {
  return api.get(`/courses/${courseId}`);
};

export const getCourseQueryOptions = (courseId: string) => {
  return queryOptions({
    queryKey: ["courses", courseId],
    queryFn: () => getCourse({ courseId }),
  });
};

type UseCourseOptions = {
  courseId: string;
  queryConfig?: QueryConfig<typeof getCourseQueryOptions>;
};

export const useCourse = ({ courseId, queryConfig }: UseCourseOptions) => {
  return useQuery({
    ...getCourseQueryOptions(courseId),
    ...queryConfig,
  });
};
