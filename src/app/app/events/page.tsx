import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getEventsQueryOptions } from '@/features/events/api/get-events';

import { Events } from './_components/events';
import { RoleGuard } from '@/components/auth/role-guard';

export const metadata = {
  title: 'Events',
  description: 'Events',
};

const EventsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string | null }>;
}) => {
  const queryClient = new QueryClient();

  const resolvedSearchParams = await searchParams;

  await queryClient.prefetchQuery(
    getEventsQueryOptions({
      page: resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1,
    }),
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <RoleGuard roles={['ADMIN', 'JURY']}>
      <HydrationBoundary state={dehydratedState}>
        <Events />
      </HydrationBoundary>
    </RoleGuard>
  );
};

export default EventsPage;

