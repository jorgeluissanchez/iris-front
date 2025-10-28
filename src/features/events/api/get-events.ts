import { queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';

export type Event = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  accessCode: string;
  isPublic: boolean;
  evaluationsStatus: 'open' | 'closed';
  createdAt: number;
};

type EventsResponse = {
  data: Event[];
  meta: {
    page: number;
    total: number;
    totalPages: number;
  };
};

const getEvents = async (page = 1): Promise<EventsResponse> => {
  const response = (await api.get(
    `/events?page=${page}`
  )) as { data: EventsResponse };

  return response.data;
};

const eventsQueryKey = ['events'];

export const getEventsQueryOptions = (page = 1) => {
  return queryOptions({
    queryKey: [...eventsQueryKey, page],
    queryFn: () => getEvents(page),
  });
};

export const eventsKeys = {
  all: eventsQueryKey,
  lists: () => [...eventsQueryKey, 'list'] as const,
  list: (page: number) => [...eventsQueryKey, 'list', page] as const,
  details: () => [...eventsQueryKey, 'detail'] as const,
  detail: (id: string) => [...eventsQueryKey, 'detail', id] as const,
};

