"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardBody } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { useCriteria } from "../api/get-criteria";
import { Select, SelectItem } from "@/components/ui/select";
import { Chip } from "@heroui/chip";
import { UpdateCriteria } from "./update-criteria";
import { DeleteCriteria } from "./delete-criteria";
import { useEvents } from "@/features/events/api/get-events";
import { useCourses } from "@/features/courses/api/get-courses";

export const CriteriaList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams?.get("page") ? Number(searchParams.get("page")) : 1;

  // Local filter state (synced with URL)
  const [eventId, setEventId] = useState<number | undefined>(undefined);
  const [courseId, setCourseId] = useState<number | undefined>(undefined);

  // Initialize from URL
  useEffect(() => {
    const ev = searchParams?.get("eventId") || "";
    setEventId(ev ? Number(ev) : undefined);
    const cid = searchParams?.get("courseId") || "";
    setCourseId(cid ? Number(cid) : undefined);
  }, [searchParams]);

  const criteriaQuery = useCriteria({
    page,
    eventId: eventId || undefined,
    courseIds: courseId ? [courseId] : undefined,
  });

  const eventsQuery = useEvents({ page: 1 });
  const coursesQuery = useCourses({ eventId: eventId || undefined, queryConfig: { enabled: !!eventId } });
  const events = eventsQuery.data?.data ?? [];
  const courses = coursesQuery.data?.data ?? [];

  if (criteriaQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const criteria = criteriaQuery.data?.data;
  const meta = criteriaQuery.data?.meta;

  if (!criteria) return null;

  const buildUrl = (newPage: number, nextEventId?: number, nextCourseId?: number) => {
    const params = new URLSearchParams();
    params.set("page", String(newPage));
    if (nextEventId) params.set("eventId", String(nextEventId));
    if (nextCourseId) params.set("courseId", String(nextCourseId));
    return `?${params.toString()}`;
  };

  const handlePageChange = (newPage: number) => {
    router.push(buildUrl(newPage, eventId, courseId));
  };

  const handleEventChange = (keys: any) => {
    const id = Array.from(keys)[0] as string;
    const nextEvent = id ? Number(id) : undefined;
    // Reset course when event changes
    setEventId(nextEvent);
    setCourseId(undefined);
    router.push(buildUrl(1, nextEvent, undefined));
  };

  const handleCourseChange = (keys: any) => {
    const id = Array.from(keys)[0] as string;
    const nextCourseId = id ? Number(id) : undefined;
    setCourseId(nextCourseId);
    router.push(buildUrl(1, eventId, nextCourseId));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="w-full sm:w-60">
          <Select
            label="Event"
            placeholder="Select an event"
            selectedKeys={eventId ? [eventId] : []}
            onSelectionChange={handleEventChange}
            isLoading={eventsQuery.isLoading}
            isClearable
          >
            {events.map((ev) => (
              <SelectItem key={ev.id}>{ev.name}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="w-full sm:flex-1">
          <Select
            label="Course"
            placeholder={eventId ? "Select a course" : "Select event first"}
            selectedKeys={courseId ? [courseId] : []}
            onSelectionChange={handleCourseChange}
            isDisabled={!eventId}
            isLoading={!!eventId && coursesQuery.isLoading}
          >
            {eventId ? (
              courses.length ? (
                courses.map((c) => (
                  <SelectItem key={String(c.id)}>{c.code}</SelectItem>
                ))
              ) : (
                <SelectItem key="no-courses" isDisabled>
                  No courses
                </SelectItem>
              )
            ) : (
              <SelectItem key="select-event" isDisabled>
                Select event first
              </SelectItem>
            )}
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {criteria.map((criterion) => (
          <Card shadow="sm" key={criterion.id} className="glass-card">
            <CardBody className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base sm:text-xl font-semibold line-clamp-2">{criterion.name}</h3>
                  <Chip
                    size="sm"
                    color="primary"
                    variant="flat"
                    className="flex-shrink-0"
                  >
                    {(criterion.weight * 100).toFixed(0)}%
                  </Chip>
                </div>
                <p className="text-xs sm:text-sm text-default-500 line-clamp-2">{criterion.description}</p>
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="text-default-400">
                  Weight: <span className="font-medium text-default-700">{criterion.weight}</span>
                </div>
                {criterion.createdAt && (
                  <div className="text-default-400">
                    Created:{" "}
                    <span className="font-medium text-default-700">
                      {new Date(criterion.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-around pt-2">
                <UpdateCriteria criterionId={criterion.id} />
                <DeleteCriteria criterionId={criterion.id} />
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

