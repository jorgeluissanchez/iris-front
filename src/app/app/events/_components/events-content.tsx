"use client";

import { Calendar, Users, Check, Eye } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getEventsQueryOptions } from "@/features/events/api/get-events";
import CreateEventModal from "./create-event-modal";
import { Spinner } from "@heroui/spinner";
import EditEventModal from "./edit-event-modal";
import { Event } from "@/types/api";
import { Snippet } from "@heroui/react";

export const EventsContent = () => {
  const eventsQuery = useQuery(getEventsQueryOptions());

  if (eventsQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const events = eventsQuery.data?.data;

  if (!events) return null;

  const handleViewDetails = (eventId: string) => {
    console.log("View details:", eventId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Event Management</h1>
          <p className="text-muted-foreground">
            Create and manage evaluation events
          </p>
        </div>
        <CreateEventModal />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        {events.map((event: Event) => (
          <Card shadow="sm" key={event.id}>
            <CardBody className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-sm text-default-500">{event.description}</p>
              </div>

              <div className="flex items-center gap-4 text-sm p-1">
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
              <Card className="flex flex-row items-center justify-between p-1 ">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-default-400" />
                  <span className="text-sm">
                    Access code:{" "}
                    <Snippet symbol="" size="sm">
                      {event.accessCode}
                    </Snippet>
                  </span>
                </div>
                {event.isPublic && (
                  <div className="flex items-center gap-1 text-green-600">
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
                <Button
                  variant="flat"
                  size="sm"
                  onPress={() => handleViewDetails(event.id)}
                  startContent={<Eye className="h-4 w-4" />}
                >
                  View details
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};
