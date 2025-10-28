import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getEventsQueryOptions } from "@/features/events/api/get-events";
import { EventsContent } from "./events-content";

export const Events = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(getEventsQueryOptions());

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <EventsContent />
    </HydrationBoundary>
  );
};
