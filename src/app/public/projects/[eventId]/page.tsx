import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Project from "./_components/projects";
import { getEventCoursesQueryOptions } from '@/features/course/api/get-course';

const PublicProjectPage = async ({ params }: { params: Promise<{ eventId: string }> }) => {
    const { eventId } = await params;
    
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery(getEventCoursesQueryOptions({ eventId }));

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <Project eventId={eventId} />
        </HydrationBoundary>
    );
};

export default PublicProjectPage;
