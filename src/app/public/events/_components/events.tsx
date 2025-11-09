'use client';

import { useQueryClient } from '@tanstack/react-query';

import { getEventQueryOptions } from '@/features/events/api/get-event';
import { EventsList } from '@/features/events/components/get-events';

export const Events = () => {
    const queryClient = useQueryClient();

    return (
        <div className="container mx-auto py-12">
            <EventsList
                onEventPrefetch={(id) => {
                    queryClient.prefetchQuery(
                        getEventQueryOptions(id),
                    );
                }}
            />
        </div>
    );
};
