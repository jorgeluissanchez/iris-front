"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { Calendar, Users, Check, Eye } from "lucide-react";
import { Snippet } from "@/components/ui/snippet";
import { Card, CardBody } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Pagination } from "@/components/ui/pagination";
import { paths } from "@/config/paths";

import { getEventQueryOptions } from "../api/get-event";
import { useEvents } from "../api/get-events";

import { DeleteEvent } from "./delete-event";
import { UpdateEvent } from "./update-event";

export type EventsListProps = {
  onEventPrefetch?: (id: string) => void;
};

export const EventsList = ({ onEventPrefetch }: EventsListProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams?.get("page") ? Number(searchParams.get("page")) : 1;

  const eventsQuery = useEvents({
    page: page,
  });
  const queryClient = useQueryClient();

  if (eventsQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const events = eventsQuery.data?.data;
  const meta = eventsQuery.data?.meta;

  if (!events) return null;

  const handlePageChange = (newPage: number) => {
    router.push(`?page=${newPage}`);
  };

  const handleViewDetails = (eventId: string) => {
    queryClient.prefetchQuery(getEventQueryOptions(eventId));
    onEventPrefetch?.(eventId);
    router.push(paths.app.event.getHref(eventId));
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card shadow="sm" key={event.id}>
            <CardBody className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-sm text-default-500">{event.description}</p>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center  justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-default-400" />
                    <span className="text-default-400">Start:</span>
                    <span>{event.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-default-400" />
                    <span className="text-default-400">End:</span>
                    <span>{event.endDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-default-400" />
                  <span className="text-default-400">Deadline:</span>
                  <span>{event.inscriptionDeadline}</span>
                </div>
              </div>

              <Card className="flex flex-row items-center justify-between p-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-default-400" />
                  <span className="text-sm">
                    Access code:{" "}
                    <Snippet size="sm" symbol="">
                      {event.accessCode}
                    </Snippet>
                  </span>
                </div>
                {event.isPublic && (
                  <div className="flex items-center gap-1 text-green-600 ">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Public</span>
                  </div>
                )}
              </Card>

              <div className="flex items-center justify-between p-1">
                <span className="text-sm text-default-400">Evaluations:</span>
                <span
                  className={`text-sm font-medium ${
                    event.evaluationsStatus === "open"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {event.evaluationsStatus === "open" ? "Open" : "Closed"}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <UpdateEvent eventId={event.id} />
                <DeleteEvent id={event.id} />
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
