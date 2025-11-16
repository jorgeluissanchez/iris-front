import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getEventsQueryOptions } from './get-events';

export const deleteEvent = ({
  eventId,
}: {
  eventId: number;
}) => {
  return api.delete(`/events/${eventId}`);
};

type UseDeleteEventOptions = {
  mutationConfig?: MutationConfig<typeof deleteEvent>;
};

export const useDeleteEvent = ({
  mutationConfig,
}: UseDeleteEventOptions = {}) => {
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
    mutationFn: deleteEvent,
  });
};

