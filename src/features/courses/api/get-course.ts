import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Course } from "@/types/api";

export const getCourse = async ({
  courseId,
}: {
  courseId: number;
}): Promise<{ data: Course }> => {
  const response = await api.get<Course>(`/events/courses/${courseId}`);

  return {
    data: response,
  };};

export const getCourseQueryOptions = (courseId: number) => {
  return queryOptions({
    queryKey: ["courses", courseId],
    queryFn: async () => {
      const result = await getCourse({ courseId });
      console.log("✅ Resultado getCourse", result);
      return result;
    },  });
};

type UseCourseOptions = {
  courseId: number;
  queryConfig?: QueryConfig<typeof getCourseQueryOptions>;
};

export const useCourse = ({ courseId, queryConfig }: UseCourseOptions) => {
  return useQuery({
    ...getCourseQueryOptions(courseId),
    ...queryConfig,
  });
};
