import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Event } from '@/types/api';

import { getEventsQueryOptions } from './get-events';

export const createEventInputSchema = z.object({
  title: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
  startDate: z.string().min(10).max(10), 
  endDate: z.string().min(10).max(10), 
  inscriptionDeadline: z.string().min(10).max(10),
  evaluationsStatus: z.enum(["open", "closed"]),
  isPublic: z.boolean().optional(),
});

export type CreateEventInput = z.infer<typeof createEventInputSchema>;

export const createEvent = ({
  data,
}: {
  data: CreateEventInput;
}): Promise<Event> => {
  return api.post('/events', data);
};

type UseCreateEventOptions = {
  mutationConfig?: MutationConfig<typeof createEvent>;
};

export const useCreateEvent = ({
  mutationConfig,
}: UseCreateEventOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getEventsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createEvent,
  });
};
