'use client';

import { useUser } from '@/lib/auth';
import { Calendar, Users, Check, ExternalLink, Eye, Edit } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getEventsQueryOptions, type Event } from '@/features/events/api/get-events';

export const EventsContent = () => {
  const user = useUser();

  // Fetch de eventos desde el API
  const { data: eventsData, isLoading } = useQuery(getEventsQueryOptions(1));

  const events: Event[] = eventsData?.data || [];

  const handleCreateEvent = () => {
    // TODO: Implementar creación de evento
    console.log('Create event clicked');
  };

  const handleEditEvent = (eventId: string) => {
    // TODO: Implementar edición de evento
    console.log('Edit event:', eventId);
  };

  const handleViewDetails = (eventId: string) => {
    // TODO: Implementar vista de detalles
    console.log('View details:', eventId);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Event Management</h1>
          <p className="text-muted-foreground">
            Create and manage evaluation events
          </p>
        </div>
        <Button
          color="primary"
          onPress={handleCreateEvent}
          startContent={<span className="text-xl">+</span>}
        >
          Create event
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          Loading events...
        </div>
      )}

      {/* Events Grid */}
      {!isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
          <Card key={event.id} className="shadow-sm">
            <CardBody className="p-6 space-y-4">
              {/* Event Title and Description */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-sm text-default-500">
                  {event.description}
                </p>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-4 text-sm">
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

              {/* Access Code and Visibility */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-default-400" />
                  <span className="text-sm">
                    Access code: <span className="font-mono font-semibold">{event.accessCode}</span>
                  </span>
                </div>
                {event.isPublic && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Public</span>
                  </div>
                )}
              </div>

              {/* Evaluations Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-default-400">Evaluations:</span>
                <span
                  className={`text-sm font-medium ${
                    event.evaluationsStatus === 'open'
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}
                >
                  {event.evaluationsStatus === 'open' ? (
                    <a href="#" className="flex items-center gap-1 hover:underline">
                      Open
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    'Closed'
                  )}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="bordered"
                  size="sm"
                  onPress={() => handleEditEvent(event.id)}
                  startContent={<Edit className="h-4 w-4" />}
                >
                  Edit event
                </Button>
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
      )}

      {/* Empty State */}
      {!isLoading && events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No events found</p>
        </div>
      )}
    </div>
  );
};

