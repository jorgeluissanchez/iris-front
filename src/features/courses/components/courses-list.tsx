"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";

import { Spinner } from "@/components/ui/spinner";
import { Card, CardBody } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { useCourses } from "../api/get-courses";
import { Chip } from "@heroui/chip";

import { DeleteCourse } from "./delete-course";
import { UpdateCourse } from "./update-course";

export const CoursesList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams?.get("page") ? Number(searchParams.get("page")) : 1;
  const eventId = searchParams?.get("event") || undefined;

  const coursesQuery = useCourses({
    page: page,
    eventId,
  });

  if (coursesQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const courses = coursesQuery.data?.data;
  const meta = coursesQuery.data?.meta;

  if (!courses) return null;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(newPage));
    if (eventId) params.set("event", eventId);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card shadow="sm" key={course.id}>
            <CardBody className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold">{course.code}</h3>
                  <Chip
                    size="sm"
                    color={course.active ? "success" : "default"}
                    variant="flat"
                  >
                    {course.active ? "Active" : "Inactive"}
                  </Chip>
                </div>
                <p className="text-sm text-default-500">{course.description}</p>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-default-400">Event:</div>
                <div className="flex flex-wrap gap-1">
                  {course.event ? (
                    <Chip size="sm" variant="bordered">
                      {course.event.title}
                    </Chip>
                  ) : (
                    <span className="text-sm text-default-400">No event assigned</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <UpdateCourse courseId={course.id} />
                <DeleteCourse id={course.id} />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            total={meta.totalPages}
            page={page}
            onChange={handlePageChange}
            showControls
          />
        </div>
      )}
    </div>
  );
};
