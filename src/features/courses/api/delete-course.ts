import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { Course } from "@/types/api";
import { MutationConfig } from "@/lib/react-query";

import { getCoursesQueryOptions } from "./get-courses";

export const deleteCourse = ({ courseId }: { courseId: string }): Promise<{ data: Course }> => {
  return api.delete(`/courses/${courseId}`);
};

type UseDeleteCourseOptions = {
  mutationConfig?: MutationConfig<typeof deleteCourse>;
};

export const useDeleteCourse = ({
  mutationConfig,
}: UseDeleteCourseOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig,
    mutationFn: deleteCourse,
  });
};
