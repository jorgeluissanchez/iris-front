import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { RoleGuard } from '@/components/auth/role-guard';
import { getEventsQueryOptions } from '@/features/events/api/get-events';
import { EventDashboard } from './_components/event-dashboard';

const EventDashboardPage = async ({ 
  params 
}: { 
  params: Promise<{ eventId: string }> 
}) => {
  const { eventId } = await params;
  
  const queryClient = new QueryClient();

  // Prefetch events data
  await queryClient.prefetchQuery(getEventsQueryOptions({ page: 1 }));

  const dehydratedState = dehydrate(queryClient);

  return (
    <RoleGuard roles={['USER']}>
      <HydrationBoundary state={dehydratedState}>
        <EventDashboard eventId={eventId} />
      </HydrationBoundary>
    </RoleGuard>
  );
};

export default EventDashboardPage;
