'use client';

import { useQueryClient } from '@tanstack/react-query';

import { ContentLayout } from '@/components/layouts/content-layout';
import { getEventQueryOptions } from '@/features/events/api/get-event';
import { CreateEvent } from '@/features/events/components/create-event';
import { EventsList } from '@/features/events/components/events-list';

export const Events = () => {
  const queryClient = useQueryClient();

  return (
    <ContentLayout title="Events">
      <div className="flex justify-end">
        <CreateEvent />
      </div>
      <div className="mt-4">
        <EventsList
          onEventPrefetch={(id) => {
            // Prefetch the event data when the user hovers over the link in the list
            queryClient.prefetchQuery(
              getEventQueryOptions(id),
            );
          }}
        />
      </div>
    </ContentLayout>
  );
};
