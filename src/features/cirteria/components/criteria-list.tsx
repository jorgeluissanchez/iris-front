"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardBody } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { useCriteria } from "../api/get-criteria";
import { Select, SelectItem } from "@/components/ui/select";
import { useEventsDropdown } from "@/features/events/api/get-events-dropdown";
import { useCoursesDropdown } from "@/features/courses/api/get-courses-dropdown";
import { Chip } from "@heroui/chip";
import { UpdateCriteria } from "./update-criteria";
import { DeleteCriteria } from "./delete-criteria";

export const CriteriaList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams?.get("page") ? Number(searchParams.get("page")) : 1;

  // Local filter state (synced with URL)
  const [eventId, setEventId] = useState<string>("");
  const [courseId, setCourseId] = useState<string>("");

  // Initialize from URL
  useEffect(() => {
    const ev = searchParams?.get("eventId") || "";
    setEventId(ev);
    const cid = searchParams?.get("courseId") || "";
    setCourseId(cid);
  }, [searchParams]);

  const criteriaQuery = useCriteria({
    page,
    eventId: eventId || undefined,
    courseIds: courseId ? [courseId] : undefined,
  });

  const eventsQuery = useEventsDropdown();
  const coursesQuery = useCoursesDropdown({ eventId: eventId || undefined, queryConfig: { enabled: !!eventId } });
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

  const buildUrl = (newPage: number, nextEventId: string, nextCourseId: string) => {
    const params = new URLSearchParams();
    params.set("page", String(newPage));
    if (nextEventId) params.set("eventId", nextEventId);
    if (nextCourseId) params.set("courseId", nextCourseId);
    return `?${params.toString()}`;
  };

  const handlePageChange = (newPage: number) => {
    router.push(buildUrl(newPage, eventId, courseId));
  };

  const handleEventChange = (keys: any) => {
    const id = Array.from(keys)[0] as string;
    const nextEvent = id || "";
    // Reset course when event changes
    setEventId(nextEvent);
    setCourseId("");
    router.push(buildUrl(1, nextEvent, ""));
  };

  const handleCourseChange = (keys: any) => {
    const id = Array.from(keys)[0] as string;
    const nextCourseId = id || "";
    setCourseId(nextCourseId);
    router.push(buildUrl(1, eventId, nextCourseId));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="md:w-60">
          <Select
            label="Event"
            placeholder="Select an event"
            selectedKeys={eventId ? [eventId] : []}
            onSelectionChange={handleEventChange}
            isLoading={eventsQuery.isLoading}
            isClearable
          >
            {events.map((ev) => (
              <SelectItem key={ev.id}>{ev.title}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="md:flex-1">
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {criteria.map((criterion) => (
          <Card shadow="sm" key={criterion.id}>
            <CardBody className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold">{criterion.name}</h3>
                  <Chip
                    size="sm"
                    color="primary"
                    variant="flat"
                  >
                    {(criterion.weight * 100).toFixed(0)}%
                  </Chip>
                </div>
                <p className="text-sm text-default-500">{criterion.description}</p>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-default-400">
                  Weight: <span className="font-medium text-default-700">{criterion.weight}</span>
                </div>
                {criterion.createdAt && (
                  <div className="text-sm text-default-400">
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

